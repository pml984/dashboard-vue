import { checkFetchStatus, defaultFetchOptions } from './utilities'

const types = {
  ADD_DASHBOARD: 'dashboards/ADD_DASHBOARD',
  REMOVE_DASHBOARD: 'dashboards/REMOVE_DASHBOARD',
  FAILURE: 'dashboard-groups/FAILURE',
  REQUEST: 'dashboard-groups/REQUEST',
  RESET: 'dashboard-groups/RESET',
  SUCCESS: 'dashboard-groups/SUCCESS'
}

const state = {
  data: [],
  error: undefined,
  isFetching: false,
  lastUpdated: null
}

// actions
const actions = {
  fetchDashboardGroups() {
    commit(types.REQUEST)

    this.$http.get(`${apiUri}/dashboard-groups`)
      .then(checkFetchStatus)
      .then((response) => response.json())
      .then((json) => {
        commit(types.SUCCESS, { list: response.data })

        dispatch(fetchDashboardGroupsSuccess(json))

        return Promise.resolve()
      })
      .catch((error) => dispatch(fetchDashboardGroupsFailure(error)))
  }
}

const mutations = {
  [types.REQUEST](state) {
    state.dashboardGroups = {
      ...state.dashboardGroups,
      error: undefined,
      isFetching: true
    }
  },
  [types.SUCCESS](state, { data, receivedAt }) {
    state.dashboardGroups = {
      ...state.dashboardGroups,
      data,
      isFetching: false,
      lastUpdated: receivedAt
    }
  },
  [types.FAILURE](state, { error }) {
    state.dashboardGroups = {
      ...state.dashboardGroups,
      error,
      isFetching: false
    }
  }
}

export default {
  namespace: true,
  state,
  actions,
  mutations
}
