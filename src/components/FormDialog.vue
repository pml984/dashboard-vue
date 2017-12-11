<template>
  <md-dialog class="md-dialog-prompt" ref="dialog" @close="fireCloseEvent('cancel')">
    <md-dialog-title v-if="title">{{title}}</md-dialog-title>

    <md-dialog-content v-if="htmlContent" v-html="htmlContent"></md-dialog-content>
    <md-dialog-content v-if="content">{{content}}</md-dialog-content>

    <md-dialog-content>
      <slot></slot>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click.native="cancelClick">{{cancelText}}</md-button>
      <md-button class="md-primary" @click.native="submitClick" :disabled="!formDirty">{{sumbitText}}</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    title: String,
    content: String,
    contentHtml: String,
    sumbitText: {
      type: String,
      default: 'Submit'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    }
  },
  data: () => ({
    debounce: false
  }),
  methods: {
    fireCloseEvent(type) {
      if (!this.debounce) {
        this.$emit('close', type);
      }
    },

    open() {
      this.$emit('open');
      this.debounce = false;
      this.$refs.dialog.open();
    },

    close(type) {
      this.fireCloseEvent(type);
      this.debounce = true;
      this.$refs.dialog.close();
    },

    formDirty() {
      // are some fields dirty?
      return Object.keys(this.fields).some(key => this.fields[key].dirty);
    },

    submitClick() {
      this.$validator.validateAll().then(() => {
        this.$emit('submit');
        this.close('ok');
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
