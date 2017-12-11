<template>
  <div ref="component" class="flexColumn">
    <div class="flexWrapper">
      <div v-for="(item, i) in data" key={i}>
        <h2>
          {{getSummary(item)}}
         </h2>
        <h4>
          {{getSummaryKey(item)}}
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },

  methods: {
    getSummary(item) {
      const key = this.getSummaryKey(item)

      return numeral(item[key]).format('0,0')
    },

    getSummaryKey(item) {
      return Object.keys(item)[0]
    }
  }
}
</script>

<style scoped>
.flexColumn {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center
}

.flexWrapper {
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: space-around
}
</style>
