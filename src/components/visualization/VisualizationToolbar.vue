<template>
  <md-toolbar class="md-transparent toolbar">
    <h2 class="md-title" style="flex: 1">{{title}}</h2>
  
    <md-menu md-size="4" md-direction="bottom left" ref="menu">
      <md-button class="md-icon-button" md-menu-trigger>
        <md-icon>menu</md-icon>
      </md-button>
    
      <!-- Menu Items -->
      <md-menu-item 
        v-for="(menuItem, key} in menuItems" 
        :key="key"
        @selected="menuItem.onClick"
      >
        <md-icon>{{menuItem.icon}}</md-icon>
        <span>{{menuItem.text}}</span>
      </md-menu-item>
      
      
      <md-button class="md-icon-button" @click="onClose">
        <md-icon>close</md-icon>
      </md-button>
    </md-menu>
    
  </md-toolbar>
</template>

<script>
import { menuItemDefs } from '@/constants'

export default {
  data() {
    return {
      menuItems: menuItemDefs[this.visualizationType]
    }
  },

  props: {
    title: {
      type: String
    },
    visualizationType: {
      type: String,
      required: true
    },
    onClose : {
      type: Function,
      default: () => {}
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
toolbar: {
  cursor: move;
}
</style>
