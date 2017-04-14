import {
  FAILURE_GET_VEGETABLES,
  SUCCESS_GET_VEGETABLES
} from '../mutation-types'

const state = {
  items: []
}

const mutations = {
  [FAILURE_GET_VEGETABLES] (state) {
    state.items = []
  },
  [SUCCESS_GET_VEGETABLES] (state, action) {
    state.items = action.vegetables
  }
}

export default {
  state,
  mutations
}