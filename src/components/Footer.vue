<template>
  <footer v-if="footerLeft || footerRight" class="footer">
    <p 
      v-for="(text, i) in footerLeft"
      key={iter}
      style={style.footerParagraph}
    >{{text}}</p>
    <div class="spacer" />
    <p
      v-for="(text, i) in footerRight"
      key={iter}
      style={style.footerParagraph}
    >{{text}}</p>
  </footer>
</template>

<script>
export default {
  props: {
    footerLeft: {
      type: String
    },
    footerRight: {
      type: String
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
