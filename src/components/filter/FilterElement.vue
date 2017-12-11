<template>
  <div>
    <!-- Filter Field Names -->
    <select-field
      class="vertical-top"
      :disabled="required"
      fieldLabel="Select a field"
      :isFetching="fields.isFetching"
      :items="fields.data"
      keyProp="name"
      labelProp="name"
      :selected="fieldName"
      valueProp="name"
      @change="onChangeField"
    >
      
    <!-- Operators -->
    <select-field
      class="vertical-top"
      fieldLabel='Select an operator'
      :items="operators"
      keyProp="value"
      labelProp="'primaryText'"
      selected="operator"
      valueProp="value"
      @change="onChangeOperator"
    />
    
    <!-- Value Field. Either Auto-complete or Text field. -->
    <!-- md-autocomplete when done -->
    <select-field 
      v-if="fieldData"
      class="vertical-top"
      fieldLabel='Filter Criteria'
      :items={fieldData}
      @change="onChangeValue"
    />
    <md-input-container v-else class="vertical-top">
      <label>Filter Criteria</label>
      <md-input v-model="value" @change="onChangeValue"></md-input>
    </md-input-container>
    <md-button v-if class="md-icon-button md-raised md-primary" @click="onAddFilter">
      <md-icon>add</md-icon>
      <md-tooltip md-direction="top">Add filter</md-tooltip>
    </md-button>
    <md-button 
      v-if="!filter.required" 
      class="md-icon-button md-raised md-accent"
      @click="onRemoveFilter"
    >
      <md-icon>remove</md-icon>
      <md-tooltip md-direction="top">Remove Filter</md-tooltip>  
    </md-button>
  </div>
</template>

<script>
import SelectField from '@/SelectField'

export default {
  components: {
    SelectField
  },

  props: {
    containerId: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    filter: {
      type: Object,
      required: true
    }
  },

  computed() {
    return {
      isFirstAndOnlyOptionalFilter() {
        return true
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

      return Object.assign({}, initialValue, filter)
    },

    onAddFilter() {
      const { containerId } = this
      const filter = this.createFilter()

      dispatch(addFilter(this.containerId, filter))
    },

    onRemoveFilter(id) {
      const { containerId, dispatch } = this.props

      dispatch(removeFilter(containerId, id))
    },

    onChangeField(id, field) {
      const { containerId, dispatch } = this.props

      dispatch(editFilter(containerId, id, { field }))
    },

    onChangeOperator(id, operator) {
      const { containerId, dispatch } = this.props

      dispatch(editFilter(containerId, id, { operator }))
    },

    onChangeValue(id, newValue) {
      const { containerId, dispatch, fields, filters } = this.props
      const filter = filters[containerId][id]
      let value = newValue
      let valueDataTypeMismatch = false

      fields.data.forEach((item) => {
        const isCurrentField = filter.field === item.name
        const shouldConvert = isCurrentField && !['String', 'IPv4'].includes(item.dataType)

        if (!shouldConvert) {
          return
        }

        try {
          value = JSON.parse(value)
        } catch (e) {
          valueDataTypeMismatch = true
          value = ''
        }
      })

      const currentValueIsEmpty = filter.value.toString().length === 0
      const newValueIsEmpty = newValue.length === 0

      if (valueDataTypeMismatch && !currentValueIsEmpty && !newValueIsEmpty) {
        return
      }

      dispatch(editFilter(containerId, id, { value }))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vertical-top {
  vertical-align: top;
}

.filterButton {
  margin: 1em 0 0 1em;
}
</style>
