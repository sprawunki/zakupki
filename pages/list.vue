<template>
  <md-content class="main-content">
    <ul class="shopping-list">
      <shopping-list-item
        v-for="item in $store.state.shoppinglist"
        :key="item.id"
        v-bind:name="item.product.name"
        v-bind:amount="item.amount"
        v-bind:unit="item.product.purchaseUnit.name"
        v-bind:inCart="item.inCart"
      />
    </ul>

    <md-snackbar md-position="center" :md-duration="alertDuration" :md-active.sync="error" md-persistent>
      <span>{{ errorMessage }}</span>
      <md-button class="md-primary" @click="error = false">Close</md-button>
    </md-snackbar>
  </md-content>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import ShoppingListItem from '~/components/ShoppingListItem.vue'

export default {
  name: 'ShoppingList',
  data: function () {
    return {
      error: false,
      alertDuration: 10000,
      errorMessage: '',
      loading: false
    }
  },
  components: {
    ShoppingListItem
  },
  methods: {
    updateShoppingList (collection) {
      this.$store.dispatch({
        type: 'updateShoppingList',
        item: collection
      })
    },
    loadData () {
      this.$store.state.refresh = false
      this.loading = true
      let tokens = this.$store.state.token
      let query = '{items {amount product {name purchaseUnit {name}}}}'
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

            this.updateShoppingList(response.data.data.items)

            this.loading = false
            this.error = false
            this.$store.state.refresh = true
          }
        ).catch(
          (error) => {
            console.error(error)
            this.loading = false
            this.error = true
            this.errorMessage = error
          }
        )
    }
  },
  created () {
    this.loadData()
  },
  computed: mapState({
    shoppinglist: state => this.$store.state.shoppinglist
  })
}
</script>

<style lang="scss" scoped>
.shopping-list {
  width: 100%;
  max-width: 360px;
  display: block;
  margin: 1rem auto 1.25rem;
  padding: 0;
}
</style>
