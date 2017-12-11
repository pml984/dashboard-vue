<template>
  <header class="header">
    <p class="headerAppName">{{applicationName}}</p>
    <h1>{{title}}</h1>
  </header>
</template>

<script>
import { applicationName } from '@/../config'

export default {
  data: {
    applicationName
  },

  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  background-color: #00bcd4;
  color: #fff;
  height: 65px;
  padding: 1.7em 0 0 1.25em;
}

.headerAppName {
  font-size: .9em;
  margin: 0;
}

h1 {
  margin: 0
}
</style>
