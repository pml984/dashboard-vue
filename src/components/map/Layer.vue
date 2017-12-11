<template>
  <v-group ref="group">
    <v-marker-cluster v-if="layer.cluster" :color="color">
      <v-marker v-for="marker in layer.markers" 
        :key="`marker${key}`" 
        :icon="getIcon(marker)"
        :lat-lng="marker.position">
        <v-popup v-show="label" :content="getMarkerLabel(marker)"></v-popup>
      </v-marker>
    </v-marker-cluster>
      <v-marker v-else v-for="marker in layer.markers" 
        :key="`marker${key}`" 
        :icon="getIcon(marker)"
        :lat-lng="marker.position">
        <v-popup v-show="label" :content="getMarkerLabel(marker)"></v-popup>
      </v-marker>
    <template v-for="(line, index) in layer.lines">
      <v-poly
        :key="getLineKey(index)"
        :lat-lngs="line.positions"
        :color="line.color || color"
        weight="2">
      </v-poly>
      <v-marker v-for="(position, positionIndex) in positions"
        :key="getLineKey(index, position)"
        :icon="getIcon(color)"
        :lat-lng="position">
        <v-popup v-show="label" :content="getMarkerLabel(line.labels[positionIndex])"></v-popup>
      </v-marker>
    </template>
  </v-group>
</template>

<script>
  import L from 'leaflet'

  import 'drmonty-leaflet-awesome-markers'
  import changeCase from 'change-case'
  import {parseDataOptions} from '../../utilities'
  import Vue2Leaflet from 'vue2-leaflet'
  import MarkerCluster from './MarkerCluster'
  
  export default {
    components: {
      'v-marker-cluster': MarkerCluster,
      'v-marker': Vue2Leaflet.Marker,
      'v-poly': Vue2Leaflet.Polyline,
      'v-group': Vue2Leaflet.LayerGroup,
      'v-tooltip': Vue2Leaflet.Tooltip,
      'v-popup': Vue2Leaflet.Popup
    },
    
    // Expects layers as array of objects with id and name properties
    props: {
      color: String,
      dataOptions: {
        type: Object,
        default: {}
      },
      layer: {
        type: Object,
        required: true
      },
      layerKey: String
    },
    
    computed: {
      mapObject() {
        const {$children = []} = this
        const [group = {}] = $children
        
        return group.mapObject
      },
      name() {
        return (this.layer || {}).name
      }
    },

    mounted() {
      const {layer, dataOptions} = this
      const {layerParams = {}} = dataOptions

      // Populate with layer information from data..
      if (this.layer.data) {
        this.layer = {
          ...layer,
          ...this.getLayerFromData(
            layer.data,
            layerParams[layer.name] || dataOptions
          )
        }
      }
    },

    methods: {
      deferredMountedTo(parent) {
        const components = this.$children
      
        for (const component of components) {
          component.deferredMountedTo(parent)
        }
      
        this.parent = parent
      },
      
      getIcon(marker) {
        return new L.AwesomeMarkers.Icon({
          icon: 'circle',
          markerColor: (marker && marker.color) || this.color,
          prefix: 'material-icons'
        })
      },

      getLineKey(index, prefix = '') {
        return `${prefix}${this.key || this.layer.name}line${index}`
      },

      getMarkerLabel(marker) {
        const {label, labels = []} = marker

        if (label) {
          labels.push(label)
        }

        return this.createLabels(labels)
      },
      
      createLabels (labels) {
        return labels.filter((label) => label)
          .map((label, index) => `<div>${label}</div>`)
          .join(' ')
      },

      getLayerFromData(data = [], dataOptions) {
        // TODO: Extract these names and make them configurable to the Map.
        const parsedDataOptions = parseDataOptions(dataOptions)
        const {
          sourceLat,
          sourcePrefix
        } = parsedDataOptions
  
        const markers = []
        const lines = []
  
        for (const dataItem of data) {
          // If contains source prefix value in data,
          // assume we are creating a line.
          if (sourcePrefix && dataItem[sourceLat]) {
            lines.push(this.getLineFromData(dataItem, parsedDataOptions))
          }
          else {
            markers.push(this.getMarkerFromData(dataItem, parsedDataOptions))
          }
        }
  
        return {
          lines,
          markers
        }
      },
  
      getLineFromData(dataItem, options) {
        const {
          destinationLat,
          destinationLong,
          destinationPrefix,
          labelFields,
          sourceLat,
          sourceLong,
          sourcePrefix
        } = options
  
        const labels = labelFields.reduce((prev, labelField) => {
          const labelTitle = changeCase.titleCase(labelField)
  
          return prev.concat([
            `${dataItem[sourcePrefix + labelTitle]}`,
            `${dataItem[destinationPrefix + labelTitle]}`
          ])
        }, [])
        const validSourceLatLong = this.isValidLatLong(dataItem[sourceLat], dataItem[sourceLong])
        const validDestinationLatLong = this.isValidLatLong(dataItem[destinationLat], dataItem[destinationLong])
  
        if (!validSourceLatLong || !validDestinationLatLong) {
          return null
        }
  
        return {
          labels,
          positions: [
            [dataItem[sourceLat], dataItem[sourceLong]],
            [dataItem[destinationLat], dataItem[destinationLong]]
          ],
          source: sourcePrefix,
          destination: destinationPrefix
        }
      },
  
      getMarkerFromData(dataItem, options) {
        const {
          labelFields,
          latField,
          longField
        } = options
  
        const labels = labelFields.map((labelField) => (
          dataItem[labelField]
        ))
  
        if (!this.isValidLatLong(dataItem[latField], dataItem[longField])) {
          return null
        }
  
        return {
          position: [dataItem[latField], dataItem[longField]],
          labels,
          color: this.color
        }
      },
  
      isValidLatLong(latitude, longitude) {
        return latitude && longitude &&
          typeof latitude !== 'string' &&
          typeof longitude !== 'string'
      }
    }
  }
</script>