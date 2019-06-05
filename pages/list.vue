<template>
  <div class="main-content">
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
  </div>
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
  fetch ({store}) {
    store.state.refresh = false
    this.loading = true
    let tokens = store.state.token
    let query = '{items {amount product {name purchaseUnit {name}}}}'
    let q = JSON.stringify(
      {
        query: query,
        tokens: tokens
      }
    )
    return axios
      .get('https://api.lewkowi.cz/?q=' + encodeURIComponent(q))
      .then(
        response => {
          if (response.data.errors) {
            throw response.data.errors[0].message
          }

          store.dispatch({
            type: 'updateShoppingList',
            item: response.data.data.items
          })

          this.loading = false
          this.error = false
          store.state.refresh = true
        }
      ).catch(
        (error) => {
          console.error(error)
          this.loading = false
          this.error = true
          this.errorMessage = error
        }
      )
  },
  computed: mapState({
    shoppinglist: state => this.$store.state.shoppinglist
  })
}
</script>

<style lang="scss" scoped>
@import "assets/theme.scss";

.shopping-list {
  @include card;
}
.actions {
  position: sticky;
  bottom: 0;
  outline: solid 1px red;
}
</style>
