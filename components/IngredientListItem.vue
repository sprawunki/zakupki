<template>
  <li class="ingredient">
    <span v-if="ingredient.product" class="ingredient__amount"
      >{{ ingredient.amount }} {{ ingredient.product.stockUnit.name }}</span
    >
    <span v-if="ingredient.product" class="product__name">{{
      ingredient.product.name
    }}</span>
  </li>
</template>

<script>
export default {
  props: ['ingredient']
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
}
.ingredient__amount {
  position: absolute;
  display: block;
  top: 0;
  right: 100%;
  width: 50%;
  text-align: right;
  white-space: nowrap;
  font-weight: 300;

  &::after {
    content: ' ';
    white-space: pre;
  }
}
</style>
