<template>
  <div id="app">
    
    <div v-if="user.isFetching" class="loading-wrapper">
      <CircularProgress text={''} />
      <h1>Fetching User Data</h1>
    </div>
    
    <div v-elseif="" class="loading-wrapper">
      <h1>{{'We couldn\'t authenticate you.'}}</h1>
      <span v-if="user.error">{{user.error.message}}</span>
    </div>
    
    <div v-else>
      <left-nav />
      <div class="wrapper">
        <banner />
        <header :text="text" />
        <div class="">
          <router-view name="Home"></router-view>
        </div>
        <footer />
        <banner />
      </div>
    </div>
  </div>
</template>

<script>
import store from './store'
import Components from './components'

export default {
  name: 'app',
  store,
  components: {
    ...Components
  },

  data: function() {
    return {

    }
  },

  // TODO: LOOK over this code to see if it can be put into a global function somewhere

  mount() {
    dispatch(fetchUser())
    dispatch(fetchAlerts())
  },

  methods: {}
}
</script>

<style scoped>
@import '~roboto-fontface/css/roboto/roboto-fontface.css';
@import '//fonts.googleapis.com/icon?family=Material+Icons';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.loading-wrapper {
  left: 50%;
  position: absolute;
  text-align: center;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 15%;
}

.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
