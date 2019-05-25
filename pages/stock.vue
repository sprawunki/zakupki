<template>
  <div class="main-content">
    <div class="stock">
      <div
        class="location"
        v-for="location in $store.state.stock"
        :key="location.id"
        :class="{
          'has-missing-items': hasMissingItems(location)
        }"
      >
            <h2 class="title">{{ location.name }}</h2>
            <ul class="products">
              <li
                class="product"
                v-for="item in location.products"
                :key="item.id"
                v-if="item.stockLevel > 0 || item.minStockAmount > 0"
                :class="{
                  'expires-soon': item.expiresSoon,
                  'low-stock': item.lowStock,
                  'out-of-stock': item.stockLevel === 0
                }"
              >
                <span v-if="item.stockLevel > 0" class="product__amount">{{ item.stockLevel }} {{ item.stockUnit.name }}</span>
                <span v-if="item.stockLevel == 0" class="product__amount">×</span>
                <span >{{ item.name }}</span>
              </li>
            </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'stock',
  data: function () {
    return {
      error: false,
      alertDuration: 10000,
      errorMessage: '',
      loading: false
    }
  },
  methods: {
    hasMissingItems (location) {
      return location.products.reduce(
        (acc, cur) => (acc || cur.stockLevel < cur.minStockAmount),
        false
      )
    }
  },
  fetch ({store}) {
    this.loading = true
    let tokens = store.state.token
    let apiUrl = process.env.apiUrl
    let query = '{locations {name products {name bestBefore stockLevel minStockAmount stockUnit {name}}}}'
    let q = JSON.stringify(
      {
        query: query,
        tokens: tokens
      }
    )

    return axios
      .get(apiUrl + '?q=' + encodeURIComponent(q))
      .then(
        response => {
          if (response.data.errors) {
            throw response.data.errors[0].message
          }

          this.loading = false
          this.error = false

          store.dispatch({
            type: 'updateStockList',
            item: response.data.data.locations
          })
        }
      ).catch(
        (error) => {
          this.loading = false
          this.error = true
          this.errorMessage = error
        }
      )
  },
  computed: mapState({
    stock: state => this.$store.state.stock
  })
}
</script>

<style lang="scss" scoped>
@import "assets/theme.scss";

.title {
  line-height: 2rem;
  font-size: 1.6rem;
  font-weight: 900;
  margin: .5em;
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
.product {
  position: relative;
  display: block;
  font-size: 1rem;
  margin: .25rem 0 .25rem 34%;
  padding: 0 .25rem;
}
.product__amount {
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
.location {
  background: $color-background;
  padding: .25em;
  position: relative;
}
.has-missing-items {
  background: $color-highlight-background;
  color: $color-highlight;
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
