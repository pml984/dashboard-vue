<template>
  <div>
    <page-header :title="title"></page-header>

    <main class="main">
      
      <md-toolbar class="md-transparent" style="height: 72px">
        <select-field
          childProp='dashboards'
          fieldLabel="Select a dashboard"
          :isFetching="dashboardGroups.isFetching"
          :items="sortedDashboardGroups"
          keyProp="_id"
          labelProp="title"
          :selected="dashboardId"
          valueProp="_id"
          @change="selectDashboard"
        >
        
        <h2 class="md-title" style="flex: 1"></h2>
        
        <span class="buttons">
          <md-button class="md-icon-button" @click="showCreateDialog">
            <md-icon>add</md-icon>
            <md-tooltip md-direction="top">Create Dashboard</md-tooltip>
          </md-button>
          <md-button class="md-icon-button" @click="showEditDialog" :disabled="!dashboardId" >
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="top">Edit Dashboard</md-tooltip>
          </md-button>
          <md-button class="md-icon-button" @click="saveDashboard" :disabled="!dashboardId">
            <md-icon>save</md-icon>
            <md-tooltip md-direction="top">Save filter</md-tooltip>
          </md-button>
          <md-button class="md-icon-button" @click="revertDashboard" :disabled="!dashboardId">
            <md-icon>undo</md-icon>
            <md-tooltip md-direction="top">Revert filter</md-tooltip>
          </md-button>
          <md-button class="md-icon-button" @click="showDeleteDialog" :disabled="!dashboardId">
            <md-icon>delete</md-icon>
            <md-tooltip md-direction="top">Delete filter</md-tooltip>
          </md-button>
          <md-select 
            v-if="unusedVisualizations.length > 0"
            md-direction="bottom left"
            md-size="4" 
            @select="addVisualization"
          >
            <md-button class="md-icon-button" md-menu-trigger slot="value">
              <md-icon>playlist_add</md-icon>
              <md-tooltip md-direction="top">Add Visualization</md-tooltip>
            </md-button>
          
            <md-menu-item v-for="(viz, i) in unusedVisualizations" :key="i">
              <span>{{viz.name}}</span>
            </md-menu-item>
          
          </md-select>
        </span>
        
      </md-toolbar>
      
      <dashboard
        v-if="!hideDashboard"
        :key="dashboardId"
        :dashboard="currentDashboard"
        :dashboardId="dashboardId"
        @layoutChange="onLayoutChange"
      />
    </main>

    <!-- CRUD Dialogs -->
    
    <form-dialog
      class="dialog"
      submitText="Create"
      title="Create a Dashboard"
      @submit="createDashboard"
      ref="createDialog"
    >
      <dashboard-form :dashboardGroups="sortedDashboardGroups" />
    </form-dialog>
    
    <md-dialog-prompt
      :md-title="`Delete ${title}?`"
      md-ok-text="Yes"
      md-cancel-text="No"
      @submit="onOpen"
      ref="deleteDialog"
    >
      <p>Are you sure you want to delete this dashboard?</p>
    </md-dialog-prompt>
    
    <form-dialog
      class="dialog"
      submitText="Edit"
      :title="`Edit ${title}`"
      @submit="editDashboard"
      ref="editDialog"
    >
      <dashboard-form :dashboard="currentDashboard" :dashboardGroups="sortedDashboardGroups" />
    </form-dialog>
    
    
  </div>
</template>

<script>
import Dashboard from 'Dashboard'
import DashboardForm from 'DashboardForm'
import FormDialog from 'FormDialog'
import SelectField from 'SelectField'
import { getDefaultFilters, validateFilters } from '@/utilities'

export default {
  components: {
    Dashboard,
    DashboardForm,
    SelectField
  },

  props: {
    dashboardGroups: {
      type: Array,
      default: []
    },
    dashboardId: {
      type: Object
    },
    filters: {
      type: Object,
      required: true
    },
    gridOptions: {
      type: Object,
      default: {}
    },
    visualizationResults: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      gridTile: {
        height: '100%',
        overflow: 'visible'
      },
      gridTileLoading: {
        boxSizing: 'border-box'
      },
    }
    f
  },

  computed: {
    sortedDashboardGroups() {
      return (this.dashboardGroups.data || []).sort((a, b) => (
        a.title.localeCompare(b.title)
      ))
    },
    title() {
      const { title } = this.dashboard

      return 'Dashboards' + title ? `/ ${title}` : ''
    },

    // If ever need flat list of dashboards.
    /*dashboards() {
      return dashboardGroups.data.reduce((dashboards, dashboardGroup) => ([
        ...dashboards,
        ...dashboardGroup.dashboards
      ]), [])
    },*/

    currentDashboard() {
      return this.dashboardGroups.data.find((dashboardGroup) => (
        dashboardGroup.dashboards.find(dashboard => this.dashboardId === dashboard._id)
      ))
    },

    currentVisualizations() {
      const { visualizations = [] } = this.currentDashboard || {}
      const usedVisualizations = {}

      for (const v in visualizations) {
        usedVisualizations[v.id] = v
      }

      return usedVisualizations
    },

    hideDashboard() {
      return !this.dashboardId || this.dashboardGroups.data.length === 0 ||
        this.dashboardGroups.isFetching || this.dashboardGroups.error
    },

    unusedVisualizations() {
      return this.visualizations.data.filter(function(currViz) {
        return !this.currentVisualizations[currViz._id]
      })
    }

  },

  mounted() {
    if (!this.filters[this.dashboard._id]) {
      this.resetFilters()
    }
  },

  methods: {
    addVisualization(visualization) {
      const { dispatch } = this.props
      const dashboard = this.getCurrentDashboard()
      const { dashboardParams = {}, visualizations = [] } = dashboard
      const { visualizationSizes = {} } = dashboardParams
      const { _id: vizId } = visualization

      visualizations.push(visualization)

      dashboard.visualizations = visualizations
      dashboardParams.visualizationSizes = {
        ...visualizationSizes,
        [vizId]: {
          h: 2,
          w: 1,
          i: vizId
        }
      }

      dashboard.dashboardParams = dashboardParams

      dispatch(addDashboard(dashboard))
    },

    deleteDashboard() {
      const { dashboardId, dispatch } = this.props

      if (!dashboardId) {
        console.error('Cannot delete a dashboard that is not selected')

        return
      }

      dispatch(deleteDashboard(dashboardId, (json) => {
        dispatch(removeDashboard(dashboardId))
        browserHistory.push('/dashboards/')
      }))
    },

    editDashboard(fields = {}) {
      const {
        dashboardId = '',
          dispatch
      } = this.props
      const { dashboardLayout: layouts } = this.state
      const currentDashboard = this.getCurrentDashboard() || {}
      let { dashboardParams = {} } = currentDashboard

      if (!dashboardId) {
        console.error('Cannot edit a dashboard that is not selected')

        return
      }

      const visualizationSizes = layouts.reduce((object, value) => {
        object[value.i] = {
          ...value
        }

        return object
      }, {})

      dashboardParams = {
        ...dashboardParams,
        visualizationSizes
      }

      dispatch(editDashboard({
        ...currentDashboard,
        ...fields,
        dashboardParams
      }, (json) => {
        dispatch(addDashboard(json))
      }))
    },

    getDashboardsFromGroups(dashboardGroups) {
      return
      dashboardGroups.data.reduce((dashboards, dashboardGroup) => {
        return [
          ...dashboards,
          ...dashboardGroup.dashboards
        ]
      }, [])
    },

    getDashboardById(dashboards, id) {
      let dashboard

      dashboards.forEach((currentDashboard) => {
        if (currentDashboard._id !== id) {
          return
        }

        dashboard = currentDashboard
      })

      return dashboard
    },

    revertDashboard() {
      const { dashboardId = '', dispatch } = this.props

      dispatch(revertDashboard(dashboardId, (json) => {
        dispatch(addDashboard(json))
      }))
    },

    saveDashboard() {
      this.editDashboard()
    },

    openDialog(ref) {
      this.$refs[ref].open();
    },

    closeDialog(ref) {
      this.$refs[ref].close();
    },

    selectDashboard(event, index, id) {
      this.$router.push(`/dashboards/${id}`)
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.buttons {
  margin-top: auto;
}

.dialog {
  width: 400px
}
</style>
