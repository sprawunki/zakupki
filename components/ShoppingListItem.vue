<template>
  <li class="list-item">
    <label class="product">
      <input class="product__checkbox" type="checkbox" :checked="inCart" @change="toggleItem(name)">
      <span class="product__name">{{name}}</span>
      <span class="product__amount">{{amount}} {{unit}}</span>
    </label>
  </li>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: [
    'name',
    'amount',
    'unit',
    'inCart'
  ],
  methods: {
    ...mapActions('shoppinglist', [
      'toggleItem'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import "assets/theme.scss";

.list-item {
  position: relative;
  line-height: 2rem;
  font-size: 1rem;
  line-height: 1rem;
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
}

.product {
  position: relative;
  padding: 1em .5em;
  display: flex;
  align-items: center;
}

.product__name {
  flex-grow: 1;

  :checked ~ & {
    text-decoration: line-through solid $color-base;
  }
}

.product__amount {
  text-align: right;
  white-space: nowrap;
  font-weight: 300;

  :checked ~ & {
    color: $color-dim-background;
  }
}

input[type=checkbox] {
  appearance: none;
  display: inline-block;
  display: none;
  vertical-align: baseline;
  width: 1.2rem;
  height: 1.2rem;
  margin-bottom: -.2rem;
  background: $color-background;

  &::before {
    content: '➔ ';
  }

  &:checked::before {
    content: '';
  }
}
</style>
