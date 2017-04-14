<template>
  <div id="app">
    <h1>Sample Charts</h1>
    <line-chart
      :data="lineData"
      :options="lineOptions"
      title="Monthly Average Temperature" 
    ></line-chart>
    <bar-chart
      :data="barData"
      :options="barOptions"
      drilldown="true"
      ref="barChart"
      @click="onBarClick"
    ></bar-chart>
    <area-chart
      :data="areaData"
      :options="areaOptions"
    ></area-chart>
    <pie-chart
      :data="pieData"
      :options="pieOptions"
      drilldown="pieDrilldown"
    ></pie-chart>
    <scatter-chart
      :data="scatterData"
      :options="scatterOptions"
    ></scatter-chart>
  </div>
</template>

<script>
import {
  areaSeries,
  columnSeries,
  columnSeriesUpdateData,
  lineSeries,
  pieDrilldown,
  pieSeries,
  scatterSeries
}
from './fixtures'
import store from './store'
import {AreaChart, BarChart, LineChart, PieChart, ScatterChart} from './components'

export default {
  name: 'app',
  store,
  components: {
    AreaChart,
    BarChart,
    LineChart,
    PieChart,
    ScatterChart
  },
  data: function () {
    return {
      lineData: lineSeries,
      barData: columnSeries,
      areaData: areaSeries,
      pieData: pieSeries,
      pieDrilldown,
      scatterData: scatterSeries,
      lineOptions: {
        scales: {
          xAxes: [{}],
          yAxes: [{
            scaleLabel: {
              label: true,
              labelString: 'Temperature (°C)'
            }
          }]
        },
        legend: {
          layout: 'vertical',
          position: 'bottom',
          verticalAlign: 'middle',
          borderWidth: 0
        }
      },
      barOptions: {
        legend: {
          display: false
        },
        onClick: this.onBarClick,
        scales: {
          xAxis: [{}],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Total percent market share'
            }
          }]
        }
      },

      areaOptions: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: false,
              labelString: ''
            },
            type: 'time'
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Nuclear weapon states'
            },
            ticks: {
              callback: (tickValue, index, ticks) => {
                return tickValue / 1000 + 'k'
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            afterLabel: (tooltipItem, data) => {
              const dataLabel = data.datasets[tooltipItem.datasetIndex].label

              return `${dataLabel} produced ${tooltipItem.yLabel} warheads`
            }
          }
        },
        // Container for pan options
        zoom: {
          enabled: true,
          drag: true,
          mode: 'x'
        }
      },

      pieOptions: {
        legend: {
          display: true,
          position: 'right'
        }
      },

      scatterOptions: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Height (cm)'
            }
          }],
          yAxes: [{
            title: {
              text: 'Weight (kg)'
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return `${tooltipItem.xLabel} cm, ${tooltipItem.yLabel} kg`
            }
          }
        }
      }
    }
  },

  methods: {
    onBarClick(dataItem, seriesItem) {
      const {
        barChart
      } = this.$refs

      barChart.drilldown(columnSeriesUpdateData)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
