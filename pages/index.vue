<template>
  <div>
    <md-card>
      <md-card-header>
        <md-progress-bar class="progress" md-mode="query" v-if="loading"></md-progress-bar>
        <div class="md-title">Zakupki</div>
      </md-card-header>
      <md-card-content>
        <md-list>
          <md-list-item class="md-triple-line" v-for="item in $store.state.shoppinglist" :key="item.id">
            <md-checkbox v-model="item.inCart" />
            <span class="md-list-item-text">{{ item.product.name }}</span>
            <span class="md-caption">{{ item.amount }} {{ item.product.stock.purchase_unit }}</span>
          </md-list-item>
        </md-list>
      </md-card-content>
      <!--<md-card-actions>
        <md-button class="md-mini md-plain md-fab-bottom-right">
          <md-icon>cached</md-icon>
        </md-button>
      </md-card-actions>//-->
    </md-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ShoppingList',
  data: function () {
    return {
      loading: false,
      error: false,
      alertDuration: 5000
    }
  },
  methods: {
    addItem (item) {
      this.$store.dispatch({
        type: 'addItem',
        item: item
      })
    },
    removeItem (item) {
      this.$store.dispatch({
        type: 'removeItem',
        item: item
      })
    }
  },
  created () {
    this.loading = true
    axios
      .get('http://192.168.0.100:4000/graphql?query=%7B%0A%09shoppinglist%20%7B%0A%20%20%20%20amount%0A%20%20%20%20product%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20stock%20%7B%0A%20%20%20%20%20%20%20%20purchase_unit%0A%20%20%20%20%20%20%20%20unit%0A%20%20%20%20%20%20%20%20amount%0A%20%20%20%20%20%20%20%20min_stock_amount%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%09%7D%0A%7D%0A')
      .then(
        response => {
          response.data.data.shoppinglist.forEach((item) => {
            this.addItem(item)
          })
          this.loading = false
          this.error = false
        }
      ).catch(
        (error) => {
          this.loading = false
          this.error = true
          console.error(error)
        }
      )
  }
}
</script>

<style lang="scss" scoped>
  @media screen and (min-width: 481px) {
    .md-card {
      max-width: 480px;
      margin: 1em auto;
    }
  }
  .progress {
    position: fixed;
    top: 5px;
    right: 0;
    left: 0;
    z-index: 1;
  }
  .refresh {
    z-index: 10;
  }
</style>
