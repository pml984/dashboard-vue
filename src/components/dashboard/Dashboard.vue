<template>
  <div v-if="dashboard">
    <!-- If still loading -->
    <div v-if="isFetching" class="loading">
      <md-spinner :md-size="150" md-indeterminate class="loading-icon"></md-spinner>
    </div>
    
    <div v-else>
    
      <filter-criteria
        class="filter-criteria"
        containerId="dashboard._id"
        fields="fields"
        label="label"
        showFilterButton="true"
        valid="validateFilters()"
        onClickReset="onClickReset"
        onClickSubmit="onClickSubmit"
      />
    
      <!-- Otherwise, show actual visualization -->
      <grid-layout
        :layout="layout"
        :col-num="totalCols"
        :row-height="250"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        class="gridList"
        ref="gridLayout"
        @compact="onLayoutChange"
      >
        <grid-item v-for="viz in visualizations"
          :key="viz._id"
          :style="visualizationStyle"
          :x="layoutMap[viz.id].x"
          :y="layoutMap[viz.id].y"
          :w="layoutMap[viz.id].w"
          :h="layoutMap[viz.id].h"
          :i="layoutMap[viz.id].i"
        >
          <visualization
            :filters="filters[dashboard._id]"
            :results="results"
            :visualization="viz"
            :onClose="onVisualizationClose"
          />
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script>
import FilterCriteria from 'FilterCriteria'
import uniqBy from 'lodash.uniqby'
import Visualization from 'visualization/Visualization'
import { GridItem, GridLayout } from 'vue-grid-layout'
import { getDefaultFilters, validateFilters } from '@/utilities'

export default {
  components: {
    FilterCriteria,
    GridItem,
    GridLayout,
    Visualization
  },

  props: {
    dashboard: {
      type: Object,
      required: true
    },
    dashboardFetch: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      required: true
    },
    visualizationResults: {
      type: Object,
      required: true
    }
  },


  data() {
    return {
      dashboardLayout: [],
      gridTile: {
        height: '100%',
        overflow: 'visible'
      },
      gridTileLoading: {
        boxSizing: 'border-box'
      },
    }
  },

  computed: {
    dashboardParams() {
      return this.dashboard.dashboardParams || {}
    },

    label() {
      const { _id, title } = this.dashboard

      return `Dashboard_${title}_${_id}`
    },

    visualizations() {
      return this.dashboard.visualizations || []
    },

    size() {
      return this.dashboardParams.size || 2
    },

    totalCols() {
      return this.visualizations.length > 1 ? Number(this.size) : 1
    },

    visualizationSizes() {
      return this.dashboardParams.visualizationSizes || {}
    },

    layoutMap() {
      const layoutMap = {}
      let i = 0

      for (const id in this.visualizationSizes) {
        const vizSize = this.visualizationSizes[id]

        layoutMap[id] = {
          x: i % this.totalCols,
          y: Math.floor(i / this.totalCols),
          h: vizSize.cols || 2,
          w: vizSize.rows || 1,
          i: id,
          ...vizSize
        }

        i++
      }
    },

    layout() {
      return this.layoutMap.values()
    },

    uniqueFields() {
      const sources = this.visualizations.map((visualization) => (
        visualization.source
      ))

      return uniqBy(sources.reduce((fields, { fields: sourceFields = [] } = {}) => (
        [...fields, ...sourceFields]
      ), []), 'name')
    },

    fields() {
      return {
        data: this.uniqueFields,
        isFetching: false
      }
    },

    visualizationStyle() {
      return {
        ...this.gridTile,
        ...(results && results.isFetching ? {} : this.gridTileLoading)
      }
    }

  },

  mounted() {
    if (!this.filters[this.dashboard._id]) {
      this.resetFilters()
    }
  },

  methods: {
    resetFilters() {
      const { dashboardParams = {} } = this.dashboard
      const { filters: dashboardFilters = [] } = dashboardParams
      const defaultFilters = getDefaultFilters(this.uniqueFields, dashboardFilters)

      dispatch(
        setFilters(
          this.dashboard._id,
          defaultFilters
        )
      )
    },

    validateFilters() {
      const { dashboard, filters } = this.props

      return validateFilters(filters[dashboard._id])
    },

    onClickSubmit() {
      for (const visualization of this.visualizations) {
        const { _id = null } = visualization

        if (!_id) {
          return
        }

        dispatch(fetchVisualizationResults(
          _id, excludeEmptyFilters(filtersToArray(filters, this.dashboard._id))
        ))
      }
    },

    onClickReset() {
      this.resetFilters()
    },
    
    onLayoutChange() {
      this.$emit('layoutChange', this.refs.gridLayout.layout)
    },

    onVisualizationClose(vizToRemove) {
      const { dashboard, dispatch } = this.props
      const { visualizations = [] } = dashboard

      dashboard.visualizations = visualizations.filter((viz) => (
        vizToRemove._id !== viz._id
      ))

      dispatch(editDashboard(dashboard))
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gridList {
  margin-bottom: 24;
  margin-left: -10;
  margin-right: -10;
  width: calc(100% + 20px);
}

.loading {
  position: absolute;
  left: 50%;
  top: 50%;
}

.filter-criteria {
  margin-bottom: 1em;
  vertical-align: top;
}
</style>
