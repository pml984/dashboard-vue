<template>
  <div>
    <md-button 
      class="md-raised md-primary drillDownButton"
      v-if="inDrillDown"
      @click.native="onDrillDown">
      Return
    </md-button>
    <md-button 
      class="md-raised md-primary resetButton"
      v-if="inZoom"
      @click.native="onReset">
      Reset Zoom
    </md-button>
  </div>
</template>

<script>
export default {
  name: 'hello',
  props: {
    chart: true,
    inDrillDown: {
      type: Boolean,
      default: false
    },
    inZoom: {
      type: Boolean,
      default: false
    },
    onReset: {
      type: Function
    },
    onDrillDown: {
      type: Function
    }
  },
  methods: {
    onResetZoom () {
      this.onReset()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .drillDownButton {
    position: absolute;
    right: 24px;
    top: 18px;
    width: 64px;
  }
  
  .resetButton {
    position: absolute;
    left: 64px;
    top: 18px;
    width: 124px;
  }
</style>
