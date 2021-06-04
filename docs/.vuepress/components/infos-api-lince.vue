<template>
<div>
  <table>
    <tr v-for="info, key in infos" v-if="!key.startsWith('kitchen')">
      <th>{{ key }}</th>
      <td class="data">{{ info }}</td>
    </tr>
  </table>
</div>
</template>

<style>
  .data {
    text-align: right;
  }
</style>

<script>
const axios = require('axios')
export default {
  data () {
      return {
          infos: {}
      }
  },
  async beforeMount() {
    const response = await axios.get('http://lince.tintamarre.be')
    this.$data.infos = response.data.data
  }
}
</script>
