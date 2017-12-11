<template>
  <md-input-container>
    <label>Title</label>
    <md-input name="title" required v-model="form[field.name]"></md-input>
  </md-input-container>
  
  <md-input-container>
    <label>Subtitle (optional)</label>
    <md-input name="subtitle" v-model="form[field.name]"></md-input>
  </md-input-container>
  
  <md-input-container>
    <label>Group</label>
    <md-select name="group" required v-model="form[field.name]">
      <md-option v-for="group in dashboardGroups" :value="group._id">
        {{group.title}}
      </md-option>
    </md-select>
  </md-input-container>
  
</template>

<script>
export default {
  data() {
    return {
      form: this.dashboard || {}
    }
  },

  props: {
    dashboard: {
      type: Object
    },
    dashboardGroups: {
      type: Array,
      default: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer: {
  display: flex;
  font-size: 0.8rem;
  padding: .2em 1.25em
}

.footerParagraph: {
  margin: 0;
  padding: 0;
}

.spacer: {
  flex: 1;
}
</style>
