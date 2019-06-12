<template>
  <div class="main-content">
    <ul class="shopping-list">
      <shopping-list-item
        v-for="item in listItems"
        :key="item.id"
        :name="item.product.name"
        :amount="item.amount"
        :unit="item.product.purchaseUnit.name"
        :in-cart="item.inCart"
      />
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ShoppingListItem from '~/components/ShoppingListItem.vue'

export default {
  name: 'ShoppingList',
  components: {
    ShoppingListItem
  },
  data: function() {
    return {}
  },
  computed: {
    ...mapGetters('shoppinglist', ['listItems'])
  },
  async fetch({ store }) {
    await store.dispatch('shoppinglist/get')
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/theme.scss';

.shopping-list {
  @include card;
}
.actions {
  position: sticky;
  bottom: 0;
  outline: solid 1px red;
}
</style>
