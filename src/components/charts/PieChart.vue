<script>
import Chart from './Chart'
import {Pie, mixins} from 'vue-chartjs'

export default Pie.extend({
  mixins: [Chart, mixins.reactiveProp, mixins.reactiveData],
  methods: {
    customData(data) {
      const {
        colorPalette,
        colorScale
      } = this
      const [dataset] = data.datasets

      if (!dataset) {
        return
      }

      const {
        length
      } = dataset.data

      delete dataset.borderColor
      dataset.backgroundColor = colorPalette(length, colorScale)

      return data
    },

    customOptions(options) {
      delete options.scales

      options.legend = {
        ...options.legend,
        display: true
      }

      return options
    }
  }
})
</script>