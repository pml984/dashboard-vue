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

fetch(`${apiUri}/dashboard-groups`, {...defaultFetchOptions})
      .then(checkFetchStatus)
      .then((response) => response.json())
      .then((json) => {
        dispatch(fetchDashboardGroupsSuccess(json))

        return Promise.resolve()
      })
      .catch((error) => dispatch(fetchDashboardGroupsFailure(error)))
