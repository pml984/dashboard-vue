<template>
  <header v-if="text" class="header" :style="style.header">{{text}}</header>
</template>

<script>
export default {
  props: {
    style: {
      type: Object,
      default: {}
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header: {
  background: #f44336;
  color: white;
  font-size: 0.8rem;
  text-align: center;
}

</style>
