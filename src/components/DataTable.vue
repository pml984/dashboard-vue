<template>
  <div className='ag-material' ref="container">
    
    <md-input-container class="textField">
      <label>Filter</label>
      <md-input
        name="quickFilter"
        @change="onQuickFilterChange"
      ></md-input>
    </md-input-container>
  
    <div class="clearfix" />
    
    <ag-grid-vue
      class="ag-material"
      ref="grid"
      :headerHeight="48"
      :rowHeight="48"
      :suppressRowClickSelection="true"
      :style="containerStyle"
      :onCellClicked="onCellClicked"
      :gridReady="handleReady"
      :gridOptions="gridProps"
      v-bind="gridProps"
    ></ag-grid-vue>
    
    <p class="rowCount"></p></p>
       Total rows: {{data.length}}
    </p>
  </div>
</template>

<script>
import 'matches-selector-polyfill/dist/matches-selector-polyfill.js'
import { AgGridVue } from 'ag-grid-vue'
import changeCase from 'change-case'
import debounce from 'lodash.debounce'

export default {
  components: {
    AgGridVue
  },

  data() {
    return {
      csvDefaults: {
        skipHeader: false,
        skipFooters: false,
        skipGroups: false,
        allColumns: true,
        onlySelected: false
      },
      gridOptions: null,
      quickFilterText: ''
    }
  },

  computed: {
    columnDefs() {
      let columnDefs = this.columns || this.createColumns(this.data)

      columnDefs = this.addTooltipsToColumns(columnDefs)
      columnDefs = this.addCheckboxColumn(columnDefs)
      columnDefs = this.addGroupingColumn(columnDefs)

      return columnDefs
    },

    api() {
      return this.gridProps.api || this.$refs.grid.api
    },

    gridProps() {
      const { columnDefs, data, quickFilterText } = this
      const gridProps = {}

      // Add the row striping class to every other row
      if (this.stripeRows === true) {
        gridProps.getRowClass = (params) => {
          return params.rowIndex % 2 === 1 ? 'ag-row-colored' : ''
        }
      }

      if (this.checkboxColumn) {
        // Setup the grid so that it properly checks/unchecks
        gridProps.rowSelection = 'multiple'
      }

      if (this.childProp) {
        gridProps.getNodeChildDetails = this.defaultGroupingFn

        if (this.columnDefs.length > 0) {
          gridProps.icons = {
            groupContracted: function() {
              return this.getGroupIcon('add')
            }.bind(this),
            groupExpanded: function() {
              return this.getGroupIcon('remove')
            }.bind(this)
          }
        }
      }

      return {
        ...gridProps,
        ...this.$props,
        columnDefs,
        quickFilterText,
        rowData: data
      }
    }
  },

  props: {
    autoResize: {
      type: Boolean,
      default: true
    },
    checkboxColumn: {
      type: null,
      default: false
    },
    checkboxColumnConfig: {
      type: Object,
      default: {}
    },
    childProp: String,
    columns: Array,
    containerStyle: {
      type: Object,
      default: {}
    },
    data: {
      type: Array,
      required: true
    },
    enableColResize: {
      type: Boolean,
      default: true
    },
    enableFilter: {
      type: Boolean,
      default: true
    },
    enableSorting: {
      type: Boolean,
      default: true
    },
    exportFileName: {
      type: String,
      default: 'table_export.csv'
    },
    getNodeChildDetails: Function,
    resizeDelay: {
      type: Number,
      default: 100
    },
    stripeRows: {
      type: Boolean,
      default: true
    }
  },

  mounted() {
    this.handleDebouncedResize =
      debounce(this.handleResize, this.resizeDelay)

    window.addEventListener('resize', this.handleDebouncedResize)
    
    this.handleResize()
  },

  updated() {
    this.handleResize()
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleDebouncedResize)
    this.api.destroy()
  },

  methods: {
    addCheckboxColumn(columnDefs) {
      const {
        checkboxColumn,
        checkboxColumnConfig
      } = this

      // Add a new column containing the checkboxes along with header.
      if (checkboxColumn) {
        return [{
          ...checkboxColumnConfig,
          checkboxSelection: true,
          headerCellRenderer: this.checkboxHeaderRendererFunc,
          headerName: '',
          suppressMovable: true,
          suppressResize: true,
          suppressSorting: true,
          width: 60,
          onCellClicked: ({
            node
          }) => {
            node.setSelected(!node.isSelected())
          }
        }, ...columnDefs]
      }

      return columnDefs
    },

    addGroupingColumn(columnDefs) {
      if (this.childProp) {
        // Add the cell renderer to the first column to show children.
        if (columnDefs.length > 0) {
          return [{
            cellRenderer: 'group',
            // headerCellRenderer: this.headerCellRendererFunc,
            headerName: '',
            suppressMovable: true,
            suppressResize: true,
            suppressSorting: true,
            width: 100
          }, ...columnDefs]
        }
      }

      return columnDefs
    },

    addTooltipsToColumns(columnDefs) {
      return columnDefs.map((column) => {
        if (column.enableTooltip === true) {
          column.previousCellRenderer = column.cellRenderer
          column.cellRenderer = this.tooltipRenderer
        }

        return column
      })
    },

    checkboxHeaderRendererFunc(params) {
      const { api } = params
      const cb = document.createElement('input')

      cb.setAttribute('type', 'checkbox')
      cb.setAttribute('class', 'ag-selection-checkbox')

      const label = document.createElement('label')
      const title = document.createTextNode(params.colDef.headerName)
      const span = document.createElement('span')

      span.setAttribute('class', 'ag-cell-value')
      label.appendChild(cb)
      label.appendChild(span)
      label.appendChild(title)
      cb.addEventListener('change', function(e) {
        if (this.checked) {
          api.selectAll()

          return
        }

        api.deselectAll()
      })

      return label
    },

    createColumns(data) {
      const { childProp } = this
      const [firstItem = {}] = data

      const dataColumnKeys =
        Object.keys(firstItem).filter((field) => (!field.startsWith('_') && field !== childProp))

      const drilldownColumnKeys =
        Object.keys((firstItem[childProp] || [])[0] || {}).filter((field) => (!field.startsWith('_')))

      // Combine the columns names from both top level and child level fields.
      // Create a Set to eliminate duplicates.
      return [
        ...new Set([
          ...dataColumnKeys,
          ...drilldownColumnKeys
        ])
      ]
      .map((field) => ({
        headerName: changeCase.titleCase(field),
        field
      }))
    },

    defaultGroupingFn(rowItem) {
      if (!rowItem[this.childProp]) {
        return null
      }

      return {
        children: rowItem[this.childProp],
        group: true
      }
    },

    exportToCSV(exportParams = {}) {
      this.api.exportDataAsCsv({
        fileName: this.exportFileName,
        ...this.csvDefaults,
        ...exportParams
      })
    },

    getCSV(copyParams = {}) {
      return this.api.getDataAsCsv({
        ...this.csvDefaults,
        ...copyParams
      })
    },

    getGroupIcon(iconName) {
      return '<i class="material-icons" style="cursor: pointer" ' + `>${iconName}</i>`
    },

    redraw() {
      const {
        container
      } = this.$refs

      container.style.display = 'none'
      container.offsetHeight
      container.style.display = 'block'
    },

    tooltipRenderer(params) {
      let renderedValue = params.value

      // If there is another renderer that was saved off, call that renderer first.
      if (params.previousCellRenderer !== undefined) {
        renderedValue = params.previousCellRenderer.call(this, params)
      }

      return `<span title="${renderedValue}">${renderedValue}</span>`
    },

    onCellClicked(event) {
      const { target } = event
      const range = document.createRange()

      if (!target.matches('.ag-cell')) {
        return
      }

      range.selectNodeContents(target)

      const selection = window.getSelection()

      selection.removeAllRanges()
      selection.addRange(range)
    },

    onQuickFilterChange(value) {
      if (this.enableFilter) {
        this.quickFilterText = value
      }
    },

    handleReady(params) {
      this.columnApi = params.columnApi

      const gridWidth = this.api.gridPanel.eBody.clientWidth
      const columnWidth = 200 * this.api.gridPanel.columnController.primaryColumns.length

      if (columnWidth > gridWidth) {
        return
      }
    },

    handleResize() {
      if (this.autoResize) {
        this.api.sizeColumnsToFit()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "~ag-grid/dist/styles/ag-grid.css";
@import "~ag-grid/dist/styles/theme-material.css";
@import "/static/theme-material.css";

.clearfix {
  clear: both;
  display: block;
  overflow: hidden;
}

.textField {
  float: right;
  width: 400px;
}

.rowCount {
  font-weight: normal;
  font-size: 14px;
  margin: 0;
  padding: .25em;
  text-align: left;
}
</style>
