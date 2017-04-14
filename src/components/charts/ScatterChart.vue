<script>
import Chart from './Chart'
import {Pie, mixins} from 'vue-chartjs'

export default Pie.extend({
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
      options.showLines = options.showLines || false

      return options
    }
  }
})
</script>