import {
  MobileResource,
}
from './resources'

export default {
  getApps:function () {
    return MobileResource.get({id: 'getApps'})
  }
}