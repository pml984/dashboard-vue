// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App'
import axios from 'axios'
import router from './router'
import Vue from 'vue'
import VueMaterial from 'vue-material'
import VeeValidate from 'vee-validate'
import 'components/WrapperComponent'
import './directives'
import 'vue-material/dist/vue-material.css'

Vue.prototype.$http = axios
Vue.use(VueMaterial)
Vue.use(VeeValidate);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  mount () {}
})