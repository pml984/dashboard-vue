<template>
  <v-map :center="center" v-bind="combinedMapOptions" v-on:load="loaded">
    
    <!-- Setup the tile layer -->
    <wms-tilelayer v-if="wms" v-bind="tileLayerOptions"></wms-tilelayer>
    <v-tilelayer v-else v-bind="tileLayerOptions"></v-tilelayer>
    
    <!-- Base Layer -->
    <layer
      :color="getColor(0)"
      :dataOptions="dataOptions"
      layerKey="baseLayer"
      :layer="baseLayer"
    ></layer>
    
    <!-- Overlays shown in Control -->
    <v-layers-control>
      <layer v-for="(layer, index) in layers"
        :key="'layer' + index"
        :color="getColor(index + 1)"
        :dataOptions="dataOptions"
        :layer="layer"
      ></layer>
    </v-layers-control>

  </v-map>
</template>

<script>
import 'leaflet'
import 'leaflet-fullscreen'

import {parseDataOptions} from '../../utilities'
import Layer from './Layer'
import LayersControl from './LayersControl'
import Vue2Leaflet from 'vue2-leaflet'
import 'vue2-leaflet-markercluster'

export default {
  components: {
    layer: Layer,
    'v-layers-control': LayersControl,
    'v-map': Vue2Leaflet.Map,
    'v-group': Vue2Leaflet.LayerGroup,
    'v-tilelayer': Vue2Leaflet.TileLayer,
    'wms-tilelayer': Vue2Leaflet.WMSTileLayer
  },
  
  mounted () {
    this.mapObject.on('load', this.loaded)
  },

  computed: {
    combinedMapOptions() {
      return {
        fullscreenControl: true,
        minZoom: 1,
        maxZoom: 20,
        zoom: 5,
        zoomControl: true,
        ...this.mapOptions
      }
    },
    mapObject() {
      const {$children = []} = this
      const [group = {}] = $children

      return group.mapObject
    }
  },

  props: {
    mapData: Object,
    baseLayer: Object,
    dataOptions: {
      type: Object,
      default: {}
    },
    center: {
      type: Array,
      default () {
        const {baseLayer, dataOptions} = this
        const [firstItem = {}] = baseLayer.data
        const {
          latField,
          longField,
          sourceLat,
          sourceLong,
          sourcePrefix
        } = parseDataOptions(dataOptions)
    
        if (sourcePrefix && firstItem[sourceLat]) {
          return [firstItem[sourceLat], firstItem[sourceLong]]
        }
    
        return [firstItem[latField], firstItem[longField]]
      }
    },
    layers: Array,
    mapOptions: {
      type: Object,
      default: {}
    },
    tileLayerOptions: {
      type: Object,
      default () {
        return {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          baseurl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          // onLoad: this.loaded
        }
      }
    },
    title: {
      type: String,
      default: ''
    },
    wms: {
      type: Boolean,
      default: false
    },
    zoomControlPosition: {
      type: String,
      default: 'topright'
    }
  },
  
  methods: {
    loaded () {
      // Grab all of the Layer Control Labels and move them to accommodate
      // material ui theming.
      const checkboxLabels =
        this.$el.querySelectorAll('.leaflet-control-layers-selector + span')
  
      for (const [index, checkboxLabel] of checkboxLabels.entries()) {
        if (checkboxLabel.innerHTML.length === 0) {
          break
        }
  
        checkboxLabel.insertAdjacentHTML('afterend', checkboxLabel.innerHTML)
        checkboxLabel.insertAdjacentHTML(
          'afterend', 
          '<i class="material-icons leaflet-control-icon"' +
          `style="color:${this.getColor(index + 1)}">place</i>`
        )
  
        checkboxLabel.innerHTML = ''
      }
    },
  
    getColor (index) {
      return allColors[index]
    }
  }
}

const allColors = [
  'blue',
  'green',
  'purple',
  'orange',
  'darkred',
  'beige',
  'darkblue',
  'darkgreen',
  'cadetblue',
  'darkpurple',
  'lightred',
  'white',
  'pink',
  'lightblue',
  'lightgreen',
  'gray',
  'black',
  'lightgray'
]
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

@import "~leaflet/dist/leaflet.css";
@import "~drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css";
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

.leaflet-control-icon {
  height: 16px;
  width: 16px;
}

</style>
