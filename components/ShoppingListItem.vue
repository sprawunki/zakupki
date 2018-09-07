<template>
  <!-- <md-list-item class="md-triple-line">
    <md-checkbox v-model="inCart" />
    <div class="md-list-item-text">
      <span>{{ name }}</span>
      <span class="md-caption">{{ amount }} {{ unit }}</span>
    </div>
  </md-list-item> -->
  <li class="list-item">
    <label class="product">
      <input class="product__checkbox" type="checkbox">
      <span class="product__name">{{name}}</span>
      <span class="product__amount">{{amount}} {{unit}}</span>
    </label>
  </li>
</template>

<script>
export default {
  props: [
    'name',
    'amount',
    'unit',
    'inCart'
  ],
  mounted () {
    console.log('item')
  }
}
</script>

<style lang="scss" scoped>
@import "assets/theme.scss";

.list-item {
  position: relative;
  line-height: 2rem;
  height: 2rem;
  font-size: 1rem;
  line-height: 1rem;
  display: block;
  margin: .25rem 1rem;
  padding: 0;
  list-style: none;
}
.product {
  position: relative;
  margin: 0 0 .5em;
  display: flex;
}
.product__name {
  // &::before {
  //   content: ' ';
  //   white-space: pre;
  // }

  flex-grow: 1;

  :checked ~ & {
    text-decoration: line-through solid $color-highlight-background;
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
// label {
//   position: relative;
//   margin: 0;
//   padding: 0;
//   display: flex;
// }
//
// .name {
//   font-size: 2rem;
//   line-height: 1em;
//   font-weight: 300;
//   display: block;
//   transition: transform .2s;
//   width: 100%;
//   position: absolute;
//   top: 0;
//   left: 0;
//   padding-left: 3rem;
//   transform-origin: top left;
//   overflow: hidden;
//   white-space: nowrap;
// }
//
// .name::after {
//   position: absolute;
//   left: -100%;
//   top: 50%;
//   height: .2rem;
//   width: 100%;
//   content: '';
//   background: #ddd;
//   transition: left .4s;
//   z-index: 1;
// }
//
// :checked ~ .name {
//   transform: scale(1.5);
//   transition: transform .2s;
//   color: #ddd;
//   font-weight: 900;
//   letter-spacing: -.12em;
// }
//
// :checked ~ .name::after {
//   left: 0;
// }
//
// .amount {
//   position: absolute;
//   top: 0rem;
//   left: 1rem;
//   display: block;
//   font-size: 3rem;
//   font-weight: 900;
//   line-height: 1em;
//   color: #666;
//   width: 2rem;
//   text-align: right;
//   transition: color .2s, left .2s;
// }
//
// :checked ~ .amount {
//   color: #ddd;
//   left: 3rem;
// }
//
// :checked ~ .unit {
//   display: none;
// }
//
// .unit {
//   font-size: .8em;
//   line-height: 1em;
//   position: absolute;
//   left: 3rem;
//   bottom: .5rem;
//   display: block;
//   color: #666;
// }
//
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
