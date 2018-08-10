<template>

  <div class="app">
    <div class="top-bar">
      <md-toolbar :md-elevation="1">
        <span class="md-title">Zakupki</span>

        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" v-on:click="refresh">
            <md-icon>refresh</md-icon>
          </md-button>

          <md-button class="md-icon-button" to="/settings">
            <md-icon>settings</md-icon>
          </md-button>
        </div>
      </md-toolbar>

      <md-progress-bar class="progress" md-mode="query" v-if="loading"></md-progress-bar>
    </div>
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

    <!-- <md-bottom-bar md-sync-route class="bottom-bar">
      <md-bottom-bar-item v-on:click="refresh" md-label="Odśwież" md-icon="refresh"></md-bottom-bar-item>
      <md-bottom-bar-item to="/settings" md-label="Ustawienia" md-icon="settings"></md-bottom-bar-item>
    </md-bottom-bar> -->
  </div>
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
    refresh () {
      this.load()
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
    load () {
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
    }
  },
  created () {
    this.load()
  },
  computed: mapState({
    shoppinglist: state => this.$store.state.shoppinglist
  })
}
</script>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
// .top-bar {
//   position: fixed;
//   top: 0;
//   right: 0;
//   left: 0;
//   z-index: 10;
// }
// .bottom-bar {
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   right: 0;
//   z-index: 10;
// }
.main-content {
  flex: 1;
  display: flex;
  overflow: scroll;
  // margin-top: 66px;
  // margin-bottom: 56px;
}
</style>
