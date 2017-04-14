import createLogger from 'vuex/dist/logger'
import vegetables from './modules/vegetables'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.config.debug = true

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    vegetables
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})