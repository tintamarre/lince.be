<template>
<div>



  <table>
     <tr>
         <th>#</th>
         <th>Qty</th>
         <th>Prix</th>
        <!-- <th>Prix au L</th> -->
    </tr> 
    <tr v-for="product in products">
      <td><a @click="(sum = sum + product.price) && caddy.push(product)">{{ product.name }} </a></td>
      <td class="data">{{ product.qty }} 🍺  </td>
      <td class="data">€ {{ product.price }}</td>
      <!-- <td class="data">€ {{ product.price / product.qty * 3 }}</td> -->
      </tr>
      <tr v-if="sum != 0">
        <td colspan="3">
         <small>
             <ul>
                <li v-for="item in caddy">{{ item.name }} de {{ item.qty }}</li>
            </ul>
        </small>
        </td>
      </tr>

      <tr v-if="sum != 0">
      <th colspan="2" class="data">Total
      </th>
      <td class="data">€ {{ sum }}
          <br>
          <small>
              <a @click="(sum = 0) & (caddy = [])" class="small">vider</a>
          </small>
      </td>
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
export default {
  data () {
      return {
          sum: 0,
          caddy: [],
          products: [
        {
        name: 'Pack',
        qty: 6,
        price: 15
        },
        {
        name: 'Caisse',
        qty: 24,
        price: 50
        },

          ]
      }
  },
  
}
</script>
