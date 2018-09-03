<template>
  <div class="stock">
    <div
      class="location"
      v-for="location in $store.state.stock"
      :key="location.id"
      :class="{
        'has-missing-items': hasMissingItems(location)
      }"
    >
          <div class="title">
            <h2>{{ location.name }}</h2>
          </div>
          <ul class="products">
            <li
              class="product"
              v-for="item in location.products"
              :key="item.id"
              v-if="item.stockLevel > 0 || item.minStockAmount > 0"
              :class="{
                'expires-soon': item.expiresSoon,
                'low-stock': item.lowStock
              }"
            >
              <span v-if="item.stockLevel > 0" class="product__amount">{{ item.stockLevel }} {{ item.stockUnit.name }}</span>
              <span >{{ item.name }}</span>
            </li>
          </ul>

          <!-- <ul>
            <li v-for="item in location.products" :key="item.id" v-if="item.minStockAmount == 0 && item.stockLevel > 0" :class="{ 'md-inset': !item.expiresSoon }">
              <md-icon v-if="item.expiresSoon">warning</md-icon>
              <del v-if="item.stockLevel == 0" class="md-list-item-text">{{ item.name }}</del>
              <span v-if="item.stockLevel > 0" class="md-list-item-text">{{ item.name }}</span>
              <span v-if="item.stockLevel > 0" class="md-caption">{{ item.stockLevel }} {{ item.stockUnit.name }}</span>
            </li>
          </ul> -->
    </div>

    <md-snackbar md-position="center" :md-duration="alertDuration" :md-active.sync="error" md-persistent>
      <span>{{ errorMessage }}</span>
      <md-button class="md-primary" @click="error = false">Close</md-button>
    </md-snackbar>
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
    },
    updateStockList (collection) {
      this.$store.dispatch({
        type: 'updateStockList',
        item: collection
      })
    },
    load () {
      this.loading = true
      let tokens = this.$store.state.token
      let query = '{locations {name products {name bestBefore stockLevel minStockAmount stockUnit {name}}}}'
      let q = JSON.stringify(
        {
          query: query,
          tokens: tokens
        }
      )
      axios
        .get('https://api.lewkowi.cz/?q=' + encodeURIComponent(q))
        .then(
          response => {
            if (response.data.errors) {
              throw response.data.errors[0].message
            }

            this.updateStockList(response.data.data.locations)

            this.loading = false
            this.error = false
          }
        ).catch(
          (error) => {
            this.loading = false
            this.error = true
            this.errorMessage = error
          }
        )
    }
  },
  created () {
    this.load()
  },
  computed: mapState({
    stock: state => this.$store.state.stock
  })
}
</script>

<style lang="scss">

.title {
  width: 50%;
  float: left;
  text-align: right;
  position: sticky;
  top: .25em;

  &::after {
    content: '';
    display: block;
    width: 50%;
    position: absolute;
    top: -.25em;
    left: 100%;
    height: .25em;
    background: black;
  }
}
.stock {
  display: grid;
  grid-template-columns: repeat(auto-fill, 360px);
  overflow: scroll;
}
.location {
  background: #fbae17;
  padding: .25em;
  position: relative;
}
.has-missing-items {
  background: #f7772c;
}
.low-stock {
  // background: #546a76;
  text-decoration: line-through;
}
.products {
  width: 50%;
  float: left;
  display: block;
  list-style: none;
  margin: 0 0 1.25em;
  padding: 0 0 0 25%;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 12.5%;
    position: absolute;
    top: -.25em;
    left: 25%;
    height: .25em;
    background: black;
  }
}
.product {
  position: relative;
  margin: 0 0 .5em;
}
.product__amount {
  position: absolute;
  top: 0;
  right: 100%;
  display: block;
  text-align: right;
  white-space: nowrap;
  font-weight: 300;

  &::after {
    content: ' ';
    white-space: pre;
  }
}
</style>
