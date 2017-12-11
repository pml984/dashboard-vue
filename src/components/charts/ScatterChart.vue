<script>
import Chart from './Chart'
import {Line, mixins} from 'vue-chartjs'

export default Line.extend({
  mixins: [Chart, mixins.reactiveProp, mixins.reactiveData],
  methods: {
    customData(data) {
      data.datasets = data.datasets.map((dataset, index) => ({
        ...dataset,
        pointBackgroundColor: dataset.backgroundColor,
        pointBorderColor: dataset.borderColor
      }))

      return data
    },

    customOptions(options) {
      const {scales} = options
      const {xAxes = {}} = options.scales

      options.showLines = options.showLines || false

      scales.xAxes = {
        ...xAxes,
        type: 'linear',
        position: 'bottom'
      }

      return options
    }
  }
})
</script>