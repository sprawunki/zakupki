<template>
  <li
    class="product"
    :class="{
      'expires-soon': product.expiresSoon,
      'low-stock': lowStock,
      'out-of-stock': outOfStock
    }"
  >
    <span v-if="product.stockLevel > 0" class="product__amount"
      >{{ product.stockLevel }} {{ product.stockUnit.name }}</span
    >
    <span class="product__name">{{ product.name }}</span>
  </li>
</template>

<script>
export default {
  props: ['product'],
  computed: {
    outOfStock: function() {
      return this.product.stockLevel === 0
    },
    lowStock: function() {
      return this.product.stockLevel < this.product.minStockAmount
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/theme.scss';

.product {
  position: relative;
  display: block;
  font-size: 1rem;
  margin: 0.25rem 0 0.25rem 34%;
  padding: 0 0.25rem;

  &__name {
    .low-stock & {
      text-transform: uppercase;
    }
    .out-of-stock & {
      text-decoration: line-through solid $color-base;
    }
    .expires-soon & {
      font-weight: 900;
    }
  }

  &__amount {
    position: absolute;
    top: 0;
    right: 100%;
    display: block;
    text-align: right;
    white-space: nowrap;
    font-weight: 300;
    width: 50%;

    &::after {
      content: ' ';
      white-space: pre;
    }
  }
}
</style>
