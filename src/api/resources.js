import {API_ROOT} from '../config'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

// HTTP options
// Vue.http.options.crossOrigin = true
// Vue.http.options.credentials = true

Vue.http.interceptors.push((request, next)=>{
  next((response) => {
    if (response.status === 401) {
    //   signOut()
    //   window.location.pathname = '/login'
    }
  })
})

// export const UserResource = Vue.resource(API_ROOT + 'users{/id}')
// export const AuthResource = Vue.resource(API_ROOT + 'auth{/id}')
export const VegetableResource = Vue.resource(API_ROOT + 'vegetables{/id}')
export const TagResource = Vue.resource(API_ROOT + 'tags{/id}')
export const CommentResource = Vue.resource(API_ROOT + 'comment{/id}{/controller}')
export const MobileResource = Vue.resource(API_ROOT + 'mobile{/id}')