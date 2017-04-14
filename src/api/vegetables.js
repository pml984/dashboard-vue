import axios from 'axios'

export default {
  getVegetables: () => (
    this.$http.get('/vegetables')
    .then(function(response) {
      return response.body
    })
    .catch(function(error) {
      console.log(error);
    })
  )
}
