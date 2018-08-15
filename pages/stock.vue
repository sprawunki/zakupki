<template>
  <md-content class="main-content md-layout">
    <div class="md-layout-item md-xsmall-size-100 md-small-size-50 md-medium-size-33 md-large-size-25" v-for="location in this.sortByName($store.state.stock)" :key="location.id">
      <md-card>
        <md-card-header>
          <span class="md-title">
            <md-icon v-if="hasMissingItems(location)">error</md-icon>
            <md-icon v-if="!hasMissingItems(location)">check</md-icon>
            <span>{{ location.name }}</span>
          </span>
        </md-card-header>
        <md-card-content>
          <md-list>
            <md-subheader>Przede wszystkim</md-subheader>
            <md-list-item v-for="item in sortByPriority(location.products)" :key="item.id" v-if="item.minStockAmount > 0"  :class="{ 'md-inset': !item.lowStock }">
              <md-icon v-if="item.lowStock">error</md-icon>
              <del v-if="item.stockLevel == 0" class="md-list-item-text">{{ item.name }}</del>
              <span v-if="item.stockLevel > 0" class="md-list-item-text">{{ item.name }}</span>
              <span v-if="item.stockLevel > 0" class="md-caption">{{ item.stockLevel }} {{ item.stockUnit.name }} <md-icon v-if="!item.expiresSoon">check</md-icon><md-icon v-if="item.expiresSoon">warning</md-icon></span>
            </md-list-item>
          </md-list>

          <md-list>
            <md-subheader>Poza tym</md-subheader>
            <md-list-item v-for="item in sortByPriority(location.products)" :key="item.id" v-if="item.minStockAmount == 0 && item.stockLevel > 0" :class="{ 'md-inset': !item.expiresSoon }">
              <md-icon v-if="item.expiresSoon">warning</md-icon>
              <del v-if="item.stockLevel == 0" class="md-list-item-text">{{ item.name }}</del>
              <span v-if="item.stockLevel > 0" class="md-list-item-text">{{ item.name }}</span>
              <span v-if="item.stockLevel > 0" class="md-caption">{{ item.stockLevel }} {{ item.stockUnit.name }} <md-icon v-if="!item.expiresSoon">check</md-icon><md-icon v-if="item.expiresSoon">warning</md-icon></span>
            </md-list-item>
          </md-list>
        </md-card-content>
      </md-card>
    </div>

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
  name: 'stock',
  data: function () {
    return {
      error: false,
      alertDuration: 5000,
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
    sortByName (data) {
      return data.sort((a, b) => a.name > b.name)
    },
    sortByPriority (data) {
      return data.sort((a, b) => {
        if (a.priority === b.priority) {
          return a.name > b.name
        }

        return a.priority < b.priority
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
    addStockItem (item) {
      this.$store.dispatch({
        type: 'addStockItem',
        item: item
      })
    },
    removeStockItem (item) {
      this.$store.dispatch({
        type: 'removeStockItem',
        item: item
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

            this.$store.state.stock.forEach((location) => {
              this.removeStockItem(location)
            })

            response.data.data.locations.forEach((location) => {
              this.addStockItem(location)
            })

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
.md-card {
  margin: 4px;
}
</style>
