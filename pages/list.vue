<template>
  <div class="main-content">
    <ul class="shopping-list">
      <shopping-list-item
        v-for="item in listItems"
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
// import axios from 'axios'
import { mapGetters } from 'vuex'
import ShoppingListItem from '~/components/ShoppingListItem.vue'

export default {
  name: 'ShoppingList',
  data: function () {
    return {
    }
  },
  components: {
    ShoppingListItem
  },
  async fetch ({store}) {
    await store.dispatch('shoppinglist/get')
  },
  computed: {
    ...mapGetters('shoppinglist', [
      'listItems'
    ])
  }
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
