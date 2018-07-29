<template>

  <md-app>
    <md-app-toolbar class="md-dense">
      <div class="md-toolbar-row">
        <span class="md-title">Zakupki</span>

        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" to="/login">
            <md-icon>more_vert</md-icon>
          </md-button>
        </div>
      </div>
    </md-app-toolbar>

    <md-app-content>
      <md-progress-bar class="progress" md-mode="query" v-if="loading"></md-progress-bar>
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
    </md-app-content>
  </md-app>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'ShoppingList',
  data: function () {
    return {
      loading: false,
      error: false,
      alertDuration: 5000,
      errorMessage: ''
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

          this.$store.state.shoppinglist.forEach((item) => {
            this.removeItem(item)
          })
          response.data.data.items.forEach((item) => {
            this.addItem(item)
          })
          this.loading = false
          this.error = false
        }
      ).catch(
        (error) => {
          this.loading = false
          this.error = true
          this.errorMessage = error
          console.dir(this.errorMessage)
        }
      )
  },
  computed: mapState({
    shoppinglist: state => this.$store.state.shoppinglist
  })
}
</script>
