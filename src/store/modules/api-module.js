import { apiUri } from '../../../config'
import changeCase from 'change-case'
import { checkFetchStatus } from './utilities'

const hanldeResults = (apiCall, promiseId = undefined) => {
  commit('request')

  apiCall
    .then(checkFetchStatus)
    .then((response) => response.json())
    .then((data) => commit('success', { data }))
    .catch((error) => commit('failure', { error }))
}

let getUrl = (name, id) => `${apiUri}/${name}{id ? '/' + id : ''}`

// The api reusable module.
export default (name, {
  actions: customActions,
  mutations: customMutations,
  getUrl: getUrlFn,
  fetchOptions = {},
  defaultOptions = {}
} = {}) => {

  const methodName = changeCase.pascalCase(name.slice(0, -1))
  getUrl = getUrlFn || getUrl
  fetchOptions = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    withCredentials: true,
    ...defaultOptions
  }

  return {
    namespace: true,

    state: {
      data: [],
      error: undefined,
      isFetching: false,
      lastUpdated: null
    },

    actions: {
      [`create${methodName}`](item) {
        hanldeResults(this.$http.post(getUrl(name, item._id), {
          ...fetchOptions,
          data: item ? JSON.stringify(item) : undefined
        }))
      },

      [`delete${methodName}`](id) {
        hanldeResults(this.$http.delete(getUrl(name, arguments), {
          ...fetchOptions
        }), id)
      },

      [`edit{methodName}`](item) {
        const { _id: id } = item

        hanldeResults(this.$http.put(getUrl(name, id), {
          ...fetchOptions,
          data: item ? JSON.stringify(item) : undefined
        }), id)
      },

      [`fetch${methodName}s`]() {
        hanldeResults(this.$http.get(getUrl(name)))
      },

      ...customActions
    },

    mutations: {
      request(state) {
        state = {
          ...state,
          error: undefined,
          isFetching: true
        }
      },

      success(state, { data, receivedAt }) {
        state = {
          ...state,
          data,
          isFetching: false,
          lastUpdated: receivedAt
        }
      },

      failure(state, { error }) {
        state = {
          ...state,
          error,
          isFetching: false
        }
      },

      ...customMutations
    }
  }
}
