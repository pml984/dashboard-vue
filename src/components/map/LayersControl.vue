<template>
  <div><slot></slot></div>
</template>

<script>
  import L from 'leaflet'
  
  export default {
    // Expects layers as array of objects with id and name properties
    props: {
      baseLayer: {
        type: Array,
        default () {
          return []
        }
      },
      overlays: {
        type: Array
      }
    },
    mounted () {
      console.log(this.$children)
    },
    methods: {
      deferredMountedTo(parent) {
        const components = this.$children
        const overlays = {}
      
        for (const component of components) {
          component.deferredMountedTo(parent)
          overlays[component.name] = component.mapObject
        }
        
        this.mapObject = 
          L.control.layers(this.baseLayer, this.overlays || overlays).addTo(parent)
      }
    }
  }
</script>