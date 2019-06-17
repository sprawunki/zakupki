<template>
  <product-list-item v-if="getProduct()" :product="getProduct()" />
</template>

<script>
import ProductListItem from '~/components/ProductListItem.vue'

export default {
  props: ['ingredient'],
  components: {
    ProductListItem
  },
  methods: {
    getProduct: function() {
      if (this.ingredient.product) {
        this.ingredient.product.minStockAmount = this.ingredient.amount
        return this.ingredient.product
      }
    }
  }
}
</script>
