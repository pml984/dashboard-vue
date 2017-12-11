import Vue from 'vue'
import { AUTHENTICATE, AUTHENTICATE_FAILURE } from '../mutation-types'

export default {
  authenticate(request) {
    return Vue.http.post('auth/authenticate', request)
      .then((response) => store.dispatch(AUTHENTICATE, response))
      .catch((error) => store.dispatch(AUTHENTICATE_FAILURE, error));
  },

  // other methods
}


export const authenticate = (store, request) => {

  return authService.authenticate(request)
    .then((response) => store.dispatch(AUTHENTICATE, response))
    .catch((error) => store.dispatch(AUTHENTICATE_FAILURE, error));

}

// other actions