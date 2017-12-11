<template>
  <div id="app">
    <h1>Sample Components</h1>
    <select-field
      :isFetching="true"
    />
    <select-field
      :items="selectData"
      keyProp="id"
      label="Some Select Box"
      labelProp="label"
      valueProp="value"
    />

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
    <d-map
      :baseLayer="mapData.baseLayer"
      :dataOptions="mapDataOptions"
      :layers="mapData.layers"
      :mapData="mapData"
      :mapOptions="mapOptions"
      :tileLayerOptions="tileLayerOptions"
      :wms="false"
    ></d-map>
    <data-table
      :checkboxColumn="true"
      childProp="children"
      :containerStyle="{height: '400px'}"
      :data="tableData"
      :enableColResize="true"
      :enableSorting="true"
    ></data-table>
  </div>
</template>

<script>
import {
  areaSeries,
  columnSeries,
  columnSeriesUpdateData,
  lineSeries,
  mapData,
  pieDrilldown,
  pieSeries,
  scatterSeries,
  tableData
}
from './fixtures'
import store from './store'
import {
  AreaChart,
  BarChart,
  DataTable,
  LineChart,
  Map,
  PieChart,
  ScatterChart,
  SelectField
} from './components'

export default {
  name: 'app',
  store,
  components: {
    AreaChart,
    BarChart,
    'data-table': DataTable,
    LineChart,
    'd-map': Map,
    PieChart,
    ScatterChart,
    SelectField
  },
  data: function() {
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
            type: 'linear',
            position: 'bottom',
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
      },
      mapDataOptions: {
        latField: 'latitude',
        longField: 'longitude',
        label: 'label',
        sourcePrefix: 'from',
        destinationPrefix: 'to'
      },
      mapOptions: {
        style: {
          height: '500px',
          'margin-bottom': '50px'
        }
      },
      mapData,
      tileLayerOptions: {
        attribution: '<a href="http://www.esri.com/">Esri</a>',
        transparent: true,
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      },
      tableData,
      selectData: [{
        id: 1,
        label: 'First Value',
        value: 'someVal1'
      }, {
        id: 2,
        label: 'Second Value',
        value: 'someVal2'
      }]
    }
  },

  methods: {
    handleGetCSV() {
      this.setState({
        copiedText: this.dataTable.getCSV(),
        open: true
      })
    },

    handleExport() {
      this.dataTable.exportToCSV()
    },

    handleClose() {
      this.setState({ open: false })
    },

    onBarClick(dataItem, seriesItem) {
      const { barChart } = this.$refs

      barChart.drilldown(columnSeriesUpdateData)
    }
  }
}
</script>

<style>
@import '~roboto-fontface/css/roboto/roboto-fontface.css';
@import '//fonts.googleapis.com/icon?family=Material+Icons';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
