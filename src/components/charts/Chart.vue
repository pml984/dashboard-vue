<script>
import 'chart.js'
import 'Chart.Zoom.drag.js'
import changeCase from 'change-case'
import chroma from 'chroma-js'
import ChartButtons from './ChartButtons'

/* global Chart */

Chart.defaults.global.defaultFontFamily = 'Roboto'

const defaultColorScale = [
  '#5da5da',
  '#faa43a',
  '#60bd68',
  '#f17cb0',
  '#b276b2',
  '#decf3f',
  '#f15854',
  '#4d4d4d',
  '#b2912f'
]

export default {
  components: [ChartButtons],
  computed: {
    parsedData() {
      return this.parseObjectsFromData({...this.data}, this.options.scales)
    }
  },
  data: function () {
    return {
      baseConfig: {
        legend: {
          position: 'bottom'
        },
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          fontSize: 18,
          text: 'Default Chart'
        }
      },
      inDrillDown: false,
      inZoom: false
    }
  },
  props: {
    ChartElement: Object,
    backgroundColorAlpha: {
      type: Number,
      default: 0.4
    },
    colorPalette: {
      type: Function,
      default: (numDataSets, scale) => {
        return chroma.scale(scale)
          .colors(Math.max(numDataSets, 2))
      }
    },
    colorScale: {
      type: [Array, String],
      default: defaultColorScale
    },
    containerStyle: {
      type: Object,
      default: {}
    },
    data: {
      type: Object,
      required: true
    },
    useDrilldown: {
      type: Boolean,
      default: false
    },
    onChartClick: {
      type: Function
    },
    options: {
      type: Object,
      default: {}
    },
    style: {
      type: Object,
      default: {}
    },
    title: String
  },

  created() {},

  mounted() {
    if (this.title) {
      this.baseConfig.title = {
        ...this.baseConfig.title,
        display: true,
        text: this.title
      }
    }

    const data = this.customData(this.parsedData)
    const combinedOptions = this.customOptions({
      ...this.baseConfig,
      ...this.options,
      zoom: {
        ...this.options.zoom,
        onZoom: this.onZoom
      }
    })

    this.renderChart(data, combinedOptions)
  },

  render(createElement) {
    return createElement('div', {
      style: {
        position: 'relative',
        height: '100%'
      }
    }, [createElement('canvas', {
      attrs: {
        id: this.chartId,
        width: this.width,
        height: this.height
      },
      ref: 'canvas'
    }), createElement(ChartButtons, {
      props: {
        onReset: this.resetZoom,
        onDrillDown: this.returnFromDrilldown
      },
      ref: 'chartButtons'
    })])
  },

  methods: {
    customData(data) {
      return data
    },

    customOptions(options = {}) {
      return options
    },

    redraw() {
      const chart = this.getChart()

      if (!chart.resize) return

      chart.resize()
    },

    getChart() {
      return this._chart || {}
    },

    getChartData() {
      return this.getChart().data
    },

    getChartCanvas() {
      const chart = this.getChart()
      const {
        chart: canvasChart = {}
      } = chart

      return canvasChart.canvas
    },

    onClick(event) {
      const {
        inDrillDown,
        onChartClick
      } = this

      if (inDrillDown || !onChartClick) {
        return
      }

      const chart = this.getChart()
      const [clickedElement] = chart.getElementAtEvent(event) || []

      if (clickedElement) {
        const {
          data,
          datasets,
          ySeriesField
        } = chart.data
        const {
          _datasetIndex: datasetIndex,
          _index: index
        } = clickedElement
        const canvas = this.getChartCanvas()

        if (data) {
          const dataItem = data[index]
          const series = dataItem[ySeriesField] || []

          onChartClick(dataItem, series[datasetIndex], series, datasetIndex)
        }
        else {
          const dataset = datasets[datasetIndex]

          onChartClick(dataset.data[index], dataset)
        }

        // Reset the cursor after clicking.
        canvas.style.cursor = null
      }
    },

    drilldown(newData) {
      this.setDrilldown(newData, true)
    },

    chartButtons() {
      return this.$refs.chartButtons
    },

    onZoom() {
      this.chartButtons().inZoom = true
    },

    resetZoom() {
      this.getChart().resetZoom()

      this.chartButtons().inZoom = false
    },

    returnFromDrilldown() {
      this.setDrilldown(this.data, false)
    },

    setDrilldown(data, drilldownState = true) {
      this.getChart().data.datasets = []

      this.data = this.parseObjectsFromData({...data})
      this.chartButtons().inDrillDown = drilldownState
    },

    onMouseMove(event) {
      const {drilldown} = this
      const {inDrillDown} = this.chartButtons()

      if (!drilldown || inDrillDown) {
        return
      }

      const chart = this.getChart()
      const [clickedElement] = chart.getElementAtEvent(event) || []
      const canvas = this.getChartCanvas()

      if (clickedElement) {
        canvas.style.cursor = 'pointer'
      }
      else {
        canvas.style.cursor = null
      }
    },

    parseObjectsFromData(data, scales) {
      const {
        data: dataset,
        datasets,
        xAxis,
        yAxis,
        ySeriesField,
        ySeriesFieldName = 'name',
        ySeriesFieldValue = 'value'
      } = data
      const ySeriesMap = new Map()

      if (datasets && datasets.length > 0) {
        data.datasets = this.populateWithColors(data.datasets)

        return data
      }

      const isArrayOfArrays = dataset.length > 0 && Array.isArray(dataset[0])

      data.datasets = []
      data.labels = data.labels || []

      let [firstXAxis = {}] = xAxis

      // Go through both the x and y axis properties and
      // translate it into datasets to conform with chartjs.
      for (let dataset of xAxis || []) {
        if (typeof dataset === 'string') {
          firstXAxis = dataset = {
            dataProperty: dataset
          }
        }

        dataset = {
          ...dataset,
          data: [],
          xAxisID: dataset.xAxisID || dataset.axisId
        }

        if (dataset.id != null) {
          data.datasets.push(dataset)
        }
      }

      for (let dataset of yAxis || []) {
        if (typeof dataset === 'string') {
          dataset = {
            dataProperty: dataset
          }
        }

        dataset = {
          ...dataset,
          data: [],
          yAxisID: dataset.yAxisID || dataset.axisId
        }

        data.datasets.push(dataset)
      }

      // After creating all the datasets, populate with data.
      for (const [dataIndex, dataObject] of dataset.entries()) {
        const datasetYSeries = dataObject[ySeriesField]

        // If ySeriesField was not found in the data and
        // no datasets were provided, create a datset.
        if (ySeriesField && !datasetYSeries && data.datasets.length === 0) {
          data.datasets.push({
            data: [],
            dataProperty: ySeriesFieldValue,
            label: changeCase.titleCase(ySeriesFieldName)
          })
        }

        // Create the set of labels from the first dataset
        // to conform to the chartjs framework.
        data.labels.push(dataObject[firstXAxis.dataProperty])

        for (const [index, dataset] of data.datasets.entries()) {
          // If data is in array format, add to corresponding
          // dataset in order of x-axes first then y-axes.
          if (isArrayOfArrays) {
            dataset.data.push(dataObject[index])

            continue
          }

          dataset.data.push(dataObject[dataset.dataProperty])
        }

        // If the ySeriesField was provided, we want to traverse
        // through each of these fields and construct a new series from that
        // field if needed.
        if (Array.isArray(datasetYSeries)) {
          for (const newSeries of datasetYSeries) {
            this.createNewYSeries(
              ySeriesMap, newSeries[ySeriesFieldName], newSeries[ySeriesFieldValue], dataIndex)
          }
        }
        else if (typeof datasetYSeries === 'object') {
          const dataKeys = Object.keys(datasetYSeries)

          for (const seriesName of dataKeys) {
            this.createNewYSeries(
              ySeriesMap, seriesName, datasetYSeries[seriesName], dataIndex)
          }

          // Fill in any fields that were no present in the
          // object, but need empty values for its dataset.
          ySeriesMap.forEach((value, key) => {
            if (datasetYSeries[key] === undefined) {
              this.createNewYSeries(
                ySeriesMap, key, null, dataIndex)
            }
          })
        }
      }

      // Add each of the new Y-Series as datasets.
      ySeriesMap.forEach((ySeries, key, map) => data.datasets.push(ySeries))

      data.datasets = this.populateWithColors(data.datasets)

      return data
    },

    createNewYSeries(ySeriesMap, seriesName, seriesValue, dataIndex = 0) {
      let ySeriesDataset = ySeriesMap.get(seriesName)

      if (!ySeriesDataset) {
        ySeriesDataset = {
          label: changeCase.titleCase(seriesName),
          data: Array(dataIndex).fill(0)
        }

        ySeriesMap.set(seriesName, ySeriesDataset)
      }

      ySeriesDataset.data.push(seriesValue)

      return ySeriesDataset
    },

    populateWithColors(datasets) {
      const {
        backgroundColorAlpha,
        colorPalette,
        colorScale
      } = this

      // update the colors on the datasets.
      const datasetColors = colorPalette(datasets.length, colorScale)

      // Make a copy of each of the datasets before passing them along
      datasets = datasets.map((dataset, index) => {
        const backgroundColor = dataset.backgroundColor ||
          chroma(datasetColors[index]).alpha(backgroundColorAlpha).css()
        const borderColor = dataset.borderColor || datasetColors[index]

        return {
          ...dataset,
          backgroundColor,
          borderColor
        }
      })
      return datasets
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
