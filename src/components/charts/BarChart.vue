<script>
import Chart from './Chart'
import {Bar, mixins} from 'vue-chartjs'

export default Bar.extend({
  mixins: [Chart, mixins.reactiveProp],

  props: {
    backgroundColorAlpha: {
      type: Number,
      default: 1
    }
  }
})
</script>