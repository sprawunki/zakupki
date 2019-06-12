<template>
  <li class="product">
    <span v-if="product.stockLevel > 0" class="product__amount"
      >{{ product.stockLevel }} {{ product.stockUnit.name }}</span
    >
    <span
      class="product__name"
      :class="{
        'expires-soon': product.expiresSoon,
        'low-stock': product.lowStock,
        'out-of-stock': outOfStock
      }"
      >{{ product.name }}</span
    >
  </li>
</template>

<script>
export default {
  props: ['product'],
  computed: {
    outOfStock: function() {
      return this.product.stockLevel === 0
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

.low-stock {
  font-weight: 900;
}
.out-of-stock {
  text-decoration: line-through solid $color-highlight-background;

  .has-missing-items & {
    text-decoration: line-through solid $color-base;
  }
}
.expires-soon {
  .product__amount::before {
    content: '➔ ';
  }
}
</style>
