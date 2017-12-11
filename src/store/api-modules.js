import shop from '../api/shop'
import * as types from './mutation-types'

export const getCall = ({ dispatch }, product) => {
  this.$http.get('/vegetables')
    .then(checkFetchStatus)
    .then((response) => response.json())
    .then((json) => {
      dispatch(fetchDashboardGroupsSuccess(json))

      return Promise.resolve()
    })
    .catch((error) => dispatch(fetchDashboardGroupsFailure(error)))
}

export const checkout = ({ dispatch, state }, products) => {
  const savedCartItems = [...state.cart.added]
  dispatch(types.CHECKOUT_REQUEST)
  shop.buyProducts(
    products,
    () => dispatch(types.CHECKOUT_SUCCESS),
    () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
  )
}

export const getAllProducts = ({ dispatch }) => {
  shop.getProducts(products => {
    dispatch(types.RECEIVE_PRODUCTS, products)
  })
}
