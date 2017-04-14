<template>
  <div id="timeline"></div>
</template>

<script >
  import vis from 'vis'
  import {mapGetters} from 'vuex'

  export default {
    name: 'timeline',
    props: ['groups', 'items', 'options'],
    computed : {
      
    },
    mounted () {
      const container = document.getElementById('timeline')

      this.items = new vis.DataSet(this.items)
      this.groups = new vis.DataSet(this.groups)

      this.timeline = new vis.Timeline(
        container,
        this.items,
        this.groups,
        this.options
      )
    }
  }
</script>

<style scoped>
@import '~vis/dist/vis.css';
@import '~vis/dist/vis-timeline-graph2d.min.css';

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

<style src="vis/dist/vis.css" lang="css"></style>
<style src="vis/dist/vis-timeline-graph2d.min.css" lang="css"></style>