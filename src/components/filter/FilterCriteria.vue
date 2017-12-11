<template>
  <md-card>
    
    <md-card-header>
      <div class="md-title">{{headerText}}</div>
    </md-card-header>
    
    <md-card-expand>
      <md-card-actions>
        <md-button class="md-raised md-primary" @click="handleClickFilter">Submit</md-button>
        <md-button class="md-raised md-primary" @click="handleClickReset">Reset</md-button>
        <span style="flex: 1"></span>
        <md-button class="md-icon-button" md-expand-trigger>
          <md-icon>keyboard_arrow_down</md-icon>
        </md-button>
      </md-card-actions>
    </md-card-expand>
    
    <filter-element
      v-for="(filter, id) in filters"
      :key="id"
      :containerId="containerId"
      :fields="fields"
      :filter="filter"
    />
    
</template>

<script>
import FilterElement from './FilterElement'
import { excludeEmptyFiltersObject, getRequiredFields } from '@/utilities'


export default {
  components: {
    FilterElement
  },
  
  props: {
    containerId: {
      type: String,
      required: true
    },
    criteriaDataProperty: {
      type: String,
      default: 'data'
    },
    fields: {
      type: String,
      required: true
    },
    filters: {
      type: Object,
      required: true
    },
    headerText: {
      type: String,
      default: 'Select filter criteria'
    },
    label: {
      type: String
    },
    valid: {
      type: Boolean,
      default: true
    },
    onClickReset: {
      type: Function,
      default: () => {}
    },
    onClickSubmit: {
      type: Function,
      default: () => {}
    }
  },

  computed() {
    return {
      routeNames() {
        return Object.keys(this.routes)
      }
    }
  },

  methods: {
    createFilter(filter = {}) {
      const initialValue = {
        field: '',
        operator: '=',
        required: false,
        value: ''
      }
    },

    handleClickFilter(...params) {
      const { onClickSubmit } = this.props

      onClickSubmit(...params)
    },

    handleClickReset(...params) {
      const { onClickReset } = this.props

      onClickReset(...params)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logoLabel {
  font-size: 2rem;
  font-weight: 400;
  padding: 0;
}
</style>
