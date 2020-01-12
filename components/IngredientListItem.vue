<template>
  <li
    class="ingredient"
    :class="{
      'expires-soon': ingredient.expiresSoon,
      'low-stock': lowStock,
      'out-of-stock': outOfStock
    }"
  >
    <span class="ingredient__amount"
      >{{ ingredient.amount }} {{ ingredient.unit.name }}</span
    >
    <span class="ingredient__name">{{ ingredient.product.name }}</span>
  </li>
</template>

<script>
export default {
  props: ['ingredient'],
  computed: {
    outOfStock: function() {
      return this.ingredient.product.stockLevel === 0
    },
    lowStock: function() {
      return this.ingredient.product.stockLevel < this.ingredient.amount
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/theme.scss';

.ingredient {
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
