<script>
import Chart from './Chart'
import {Line, mixins} from 'vue-chartjs'

export default Line.extend({
  mixins: [Chart, mixins.reactiveProp]
})
</script>