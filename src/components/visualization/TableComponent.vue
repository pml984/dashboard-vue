<template>
  <data-table
    :childProp="drillDownFieldName"
    :containerStyle="containerStyle"
    :data="data"
    :enableColResize="true"
    :enableSorting="true"
    :exportFileName="exportFileName"
    ref="component"
  />
</template>

<script>
import changeCase from 'change-case'
import DataTable from '@/components/DataTable'

export default {
  components: {
    DataTable
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
      type: Array,
      required: true
    },
    metadata: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },

  computed() {
    return {
      drillDownFieldName() {
        const { visualizationParams: params = {} } = this.metadata

        return params.drillDownFieldName
      },
      exportFileName() {
        return `${changeCase.pascalCase(this.name)}.csv`
      }
    }
  }
}
</script>
