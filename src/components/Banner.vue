<template>
  <div v-if="bannerText" class="banner">{{bannerText}}</div>
</template>

<script>
export default {
  props: {
    bannerText: {
      type: String
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.banner {
  background: #424242;
  color: #FFF59D;
  font-size: 0.8rem;
  font-weight: 400;
  text-align: center;
}
</style>
