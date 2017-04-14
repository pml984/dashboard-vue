<script>
import Chart from './Chart'
import {Line, mixins} from 'vue-chartjs'

export default Line.extend({
  mixins: [Chart, mixins.reactiveProp, mixins.reactiveData],
  methods: {
    customData(data) {
      return {
        ...data,
        datasets: data.datasets.map((dataset) => ({
          ...dataset,
          fill: false
        }))
      }
    }
  }
})
</script>