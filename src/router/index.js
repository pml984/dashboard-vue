import App from '@/App'
import Dashboard from '@/components/Dashboard'
import Dashboards from '@/components/Dashboards'
import Search from '@/components/Search'
import Settings from '@/components/Settings'
import Upload from '@/components/Upload'

import Router from 'vue-router'
import Vue from 'vue'
import { disabledRoutes } from '../../config'

Vue.use(Router)

const isRouteEnabled = (name) => (
  disabledRoutes.indexOf(name) === -1
)

let routes = [{
  component: App,
  name: 'Home',
  path: '/'
}, {
  icon: 'dashboard',
  component: Dashboards,
  path: 'dashboards',
  children: [{
    component: Dashboard,
    name: 'Dashboard',
    path: ':dashboardId'
  }]
}, {
  icon: 'search',
  component: Search,
  name: 'Search',
  path: 'search',
  children: [{
    component: Search,
    name: 'Source',
    path: ':source'
  }]
}, {
  icon: 'folder',
  component: Upload,
  name: 'Upload',
  path: 'upload'
}, {
  icon: 'settings',
  component: Settings,
  name: 'Settings',
  path: 'settings'
}]

routes = routes.map((route) => ({
  ...route,
  enabled: isRouteEnabled(routes.name)
}))

export default new Router({
  mode: 'history',
  routes
})

export { routes }
