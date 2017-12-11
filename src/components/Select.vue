<template>
    <div>
      <SelectField
        disabled={required}
        floatingLabelText='Select a field'
        hintText='Select a field'
        isFetching={fields.isFetching}
        items={fields.data}
        keyProp={'name'}
        primaryTextProp={'name'}
        style={verticalTop}
        value={fieldName}
        valueProp={'name'}
        onChange={(ev, index, value) => this.onChangeField(id, value)}
      />
      <SelectField
        floatingLabelText='Select an operator'
        hintText='Select an operator'
        items={operators}
        keyProp={'value'}
        primaryTextProp={'primaryText'}
        style={verticalTop}
        value={operator}
        valueProp={'value'}
        onChange={(ev, index, value) => this.onChangeOperator(id, value)}
      />
    
  </div>
</template>

<script>
import { excludeEmptyFilters, filtersToArray, getRequiredFields } from '@/utilities'


export default {
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
