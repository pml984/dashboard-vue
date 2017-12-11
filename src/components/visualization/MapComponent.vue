<template>
  <d-map
    baseLayer="baseLayer"
    dataOptions="visualizationParams"
    layers="layers"
    tileLayerOptions="tileLayerOptions"
    title="title"
    wms="tileLayerOptions.wms"
  />
</template>

<script>
import Map from '@/components/map/Map'

export default {
  components: {
    'd-map': Map
  },

  data() {
    return {
      containerStyle: {
        height: 'auto'
      }
    }
  },

  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    metadata: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },

  computed() {
    return {
      dataObject() {
        const { data } = this

        return Array.isArray(data) ? { baseData: data } : data
      },

      visualizationParams() {
        return this.metadata.visualizationParams || {}
      },

      baseLayer() {
        const { baseData } = this.dataObject

        return { data: baseData }
      },

      layers() {
        return this.dataObject.layers || []
      },

      tileLayerOptions() {
        return !mapTileLayer ? {} : {...mapTileLayer }
      },

      title() {
        return this.visualizationParams.title
      }
    }
  }
}
</script>
