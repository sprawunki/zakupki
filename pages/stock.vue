<template>
  <div class="main-content">
    <div class="stock">
      <div
        v-for="location in $store.state.stock.items"
        :key="location.id"
        class="location"
      >
        <h2 class="title">{{ location.name }}</h2>
        <ul class="products">
          <product-list-item
            v-for="item in location.products"
            :key="item.id"
            :product="item"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductListItem from '~/components/ProductListItem.vue'

export default {
  name: 'Stock',
  components: {
    ProductListItem
  },
  data: function() {
    return {
      error: false,
      alertDuration: 10000,
      errorMessage: '',
      loading: false
    }
  },
  computed: mapState({
    stock: state => this.$store.state.stock
  }),
  async fetch({ store }) {
    await store.dispatch('stock/get')
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/theme.scss';

.title {
  line-height: 2rem;
  font-size: 1.6rem;
  font-weight: 900;
  margin: 0.5em;
  padding: 0;
}
.stock {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1em;
  margin: 0 auto;
}
.products {
  display: block;
  list-style: none;
  margin: 0 0 1.25em;
  padding: 0;
  position: relative;
}
.location {
  background: $color-background;
  padding: 0.25em;
  position: relative;
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
