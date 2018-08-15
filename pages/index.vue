<template>
  <md-content class="main-content">
    <md-list>
      <md-subheader>Lista</md-subheader>

      <md-list-item class="md-triple-line" v-for="item in $store.state.shoppinglist" :key="item.id">
        <md-checkbox v-model="item.inCart" />
        <div class="md-list-item-text">
          <span>{{ item.product.name }}</span>
          <span class="md-caption">{{ item.amount }} {{ item.product.purchaseUnit.name }}</span>
        </div>
      </md-list-item>
    </md-list>

    <md-snackbar md-position="center" :md-duration="alertDuration" :md-active.sync="error" md-persistent>
      <span>{{ errorMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>
  </md-content>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'ShoppingList',
  data: function () {
    return {
      error: false,
      alertDuration: 5000,
      errorMessage: ''
    }
  },
  methods: {
    updateList (collection) {
      this.$store.dispatch({
        type: 'updateList',
        item: collection
      })
    },
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
    },
    loadData () {
      this.$store.state.refresh = false
      this.$store.state.loading = true
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

            this.updateList(response.data.data.items)

            this.$store.state.loading = false
            this.error = false
            this.$store.state.refresh = true
          }
        ).catch(
          (error) => {
            this.$store.state.loading = false
            this.error = true
            this.errorMessage = error
          }
        )
    }
  },
  created () {
    this.loadData()

    setInterval(function () {
      this.loadData()
    }.bind(this), 60000)
  },
  computed: mapState({
    shoppinglist: state => this.$store.state.shoppinglist
  })
}
</script>
