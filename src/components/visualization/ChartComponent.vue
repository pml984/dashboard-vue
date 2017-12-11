<template>
  <wrapper-component
    :tag="chartType"
    :containerStyle="containerStyle"
    :data="chartData"
    :drilldown="drillDownFieldName != null"
    :options="options"
    :onChartClick="onChartClick"
    ref="component"
  />
</template>

<script>
import * as Components from '@/components/charts'

export default {
  data() {
    return {
      containerStyle: {
        height: 'calc(100% - 88px)',
        padding: '1em 0'
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
    type: {
      type: String,
      required: true
    }
  },

  computed() {
    return {
      chartType() {
        return Components[`${this.type}Chart`]
      },

      params() {
        return this.metadata.params || {}
      },

      drillDownFieldName() {
        return this.params.drillDownFieldName
      },

      xAxisType() {
        return this.params.type
      },

      tooltipFields() {
        return this.params.tooltipFields
      },

      yAxis() {
        return this.params.yAxis || 'Count'
      },

      chartData() {
        const chartData = {
          data: this.data,
          xAxis: ['Value']
        }

        if (this.params.series) {
          chartData.ySeriesField = 'Details'
          chartData.ySeriesFieldName = 'Value'
          chartData.ySeriesFieldValue = this.yAxis
        } else {
          chartData.yAxis = [{
            dataProperty: this.yAxis,
            label: this.yAxis
          }]
        }
      },

      options() {
        const xAxisScale = this.xAxisType !== 'timeline' ? {} : {
          time: {
            tooltipFormat: 'dddd, MMMM Do YYYY, hh:mm'
          },
          type: 'time'
        }

        const options = {
          scales: {
            xAxes: [xAxisScale],
            yAxes: [{
              scaleLabel: {
                display: false,
                labelString: ''
              }
            }]
          },
          zoom: {
            enabled: false
          }
        }

        if (this.xAxisType === 'timeline') {
          options.pan = {
            enabled: false,
            mode: 'x'
          }

          options.zoom = {
            enabled: true,
            drag: true,
            mode: 'x'
          }
        }

        if (!this.params.series) {
          options.legend = {
            display: false,
            position: 'right'
          }
        }

        if (this.tooltipFields) {
          options.tooltips = {
            callbacks: {
              afterLabel: this.getTooltipLabel
            }
          }
        }

        return options
      }
    }
  },

  methods: {
    getItemData(seriesItem, dataItem, drillDownFieldName) {
      if (seriesItem && seriesItem[drillDownFieldName]) {
        return seriesItem[drillDownFieldName]
      }

      return dataItem[drillDownFieldName]
    },

    getTooltipLabel(tooltipItem, data) {
      const { data: dataList = [], ySeriesField } = data
      let dataItem = dataList[tooltipItem.index]
      const tooltipLabels = []

      if (ySeriesField) {
        dataItem = dataItem[ySeriesField][tooltipItem.datasetIndex]
      }

      for (const tooltipField of this.tooltipFields) {
        const tooltipFieldValue = dataItem[tooltipField]

        if (tooltipFieldValue) {
          if (Array.isArray(tooltipFieldValue)) {
            tooltipLabels.push(...tooltipFieldValue)
          } else {
            tooltipLabels.push(`${tooltipField}: ${tooltipFieldValue}`)
          }
        }
      }

      return tooltipLabels
    },

    onChartClick(dataItem, seriesItem) {
      if (!this.drillDownFieldName) {
        return
      }

      const data = this.getItemData(
        seriesItem,
        dataItem,
        this.drillDownFieldName
      )

      this.component.drilldown({
        ...this.chartData,
        data
      })
    }
  }
}
</script>

<style scoped>
.containerStyle {
  height: calc(100% - 88px);
  padding: 1em 0;
}
</style>
