<template>
  <div class="visualization">
    <visualization-toolbar
      :visualizationType="visualizationTypeName"
      :title="name"
      :onClose"onClose"
    />
    
    <!-- If still loading -->
    <div v-if="isFetching" class="loading">
      <md-spinner :md-size="150" md-indeterminate class="loading-icon"></md-spinner>
    </div>
    
    <!-- If no data was loaded -->
    <div v-else-if="data.length === 0" class="no-data">
      <span>No data</span>
    </div>
    
    <!-- Otherwise, show actual visualization -->
    <wrapper-component v-else
      :tag="visualizationComponent"
      :data="data"
      :metadata="visualization"
      :name="name"
      ref="component"
      :type="visualizationTypeName"
    />
  </div>
</template>

<script>
import { ChartComponent } from './ChartComponent'
import { MapComponent } from './MapComponent'
import { SummaryComponent } from './SummaryComponent'
import { TableComponent } from './TableComponent'
import VisualizationToolbar from './VisualizationToolbar'

const components = { ChartComponent, MapComponent, SummaryComponent, TableComponent }

export default {
  components: {
    VisualizationToolbar
  },

  props: {
    visualization: {
      type: Object,
      required: true
    }
  },

  computed() {
    return {
      component() {
        return this.$refs.component
      },
      data() {
        return this.results && this.results.data
      },
      type() {
        return this.visualization.name
      },
      typeGroup() {
        if (components[`${this.type}Component`]) {
          return this.type
        }

        return 'Chart'
      },
      visualizationComponent() {
        let visualizationComponentName = this.getTypeGroup(this.visualizationTypeName)

        return components[`${visualizationComponentName}Component`]
      },
      visualizationTypeName() {
        return this.visualization.visualizationType.name
      }
    }
  },

  methods: {
    onClose() {
      // const { onClose, visualization } = this.props
      
      // onClose(visualization)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading {
  flex: 1;
  position: relative;
  vertical-align: middle;
}

.loading-icon {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

.no-data {
  flex: 1;
  position: relative;
}

.no-data span {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
