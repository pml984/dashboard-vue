<script>

import Vue from 'vue';

Vue.component('wrapper-component', {
  render(createElement) {
    return createElement(
      this.tag, // tag name/object
      this.$slots.default // array of children
    )
  },

  props: {
    tag: {
      type: [String, Object],
      required: true,
    }
  }
})

</script>
