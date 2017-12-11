<template>
  <md-sidenav class="md-left" :style="{width: 110}">
    
    <md-list>
      <!-- Main Home Link -->
      <md-list-item >
         <router-link to="/">{{homeText}}</router-link>
      </md-list-item>
      
      <!-- Route Links -->
      <md-list-item 
        md-expand-multiple
        v-for="(route, i) in routes"
        v-if="route.enabled && route.name !== 'Home'"
        :style="{padding: 0}"
        :key="route.name"
      >
        <md-icon>{{route.icon}}</md-icon>
         <router-link :to="route.path">{{routeName}}</router-link>
      </md-list-item>
      
      <!-- Help Links -->
      <md-list-item 
        md-expand-multiple
      >
        <md-list-expand>
          <md-list>
            <md-list-item 
              v-for="item in helpMenuItems"
              class="md-inset"
              :href="item.link"
              :key="item.title"
              :target="item.target || '_self'" 
            >
              {{item.title}}
            </md-list-item>
          </md-list>
        </md-list-expand>
      </md-list-item>
    </md-list>
    
  </md-sidenav>
</template>

<script>
export default {
  props: {
    helpMenuItems: {
      type: Array,
      default: []
    },
    homeText: {
      type: String,
      default: 'Home'
    },
    routes: {
      type: Object,
      required: true
    }
  },

  computed() {
    return {
      routeNames() {
        return Object.keys(this.routes)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logoLabel {
  font-size: 2rem;
  font-weight: 400;
  padding: 0;
}
</style>
