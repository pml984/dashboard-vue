<template>
  <md-input-container>
    <md-spinner 
      v-if="isFetching" 
      :md-size="20"
      md-indeterminate
      class="loading"
    ></md-spinner>
    <label :for="name">{{selectLabel}}</label>
    <md-select 
      :name="name" 
      v-model="selected"
      :disabled="isDisabled">
      @change="change"
      <md-option 
        v-for="(item, index) in items"
        :value="item[valueProp]"
        :key="item[keyProp]">
        
        {{item[labelProp]}}
        
        <md-option 
           v-for="(child, index) in getChildren(item)"
          :value="child[valueProp]"
          :key="child[keyProp]">
          {{child[labelProp]}}
        </md-option>
        
      </md-option>
    </md-select>
  </md-input-container>
</template>

<script>
export default {
  computed: {
    isDisabled() {
      return this.disabled || this.isFetching
    }
  },

  data() {
    return {
      selectLabel: this.isFetching ? 'Loading...' : this.fieldLabel
    }
  },

  props: {
    childProp: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fieldLabel: {
      type: String,
      default: 'Select a field'
    },
    isFetching: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: []
    },
    keyProp: {
      type: String,
      default: 'id'
    },
    labelProp: {
      type: String,
      default: 'label'
    },
    name: {
      type: String,
      default: 'name'
    },
    valueProp: {
      type: String,
      default: 'value'
    },
    selected: {
      type: Object
    }
  },

  methods: {
    change() {
      this.$emit('change');
    },

    getChildren(item) {
      return item[this.childProp] || []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading {
  margin-left: 75px;
  margin-top: 5px;
}
</style>
