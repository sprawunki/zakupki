<template>
  <div class="main-content">
    <div class="recipes">
      <div
        class="recipe"
        v-for="recipe in $store.state.recipes.items"
        :key="recipe.id"
        :class="{
          'promoted': recipe.score > 0,
          'demoted': recipe.score < 0
        }"
      >
          <h2 class="title">{{ recipe.name }}</h2>
          <ul class="ingredients">
            <li
              v-for="item in recipe.ingredients"
              v-if="item.product"
              :key="item.id"
              class="ingredient"
              :class="{
                'expires-soon': item.product.expiresSoon,
                'low-stock': item.product.stockLevel < item.amount,
                'out-of-stock': item.product.stockLevel === 0
              }"
            >
              <span class="ingredient__amount">{{ item.amount }} {{item.product.stockUnit.name }}</span>
              <span>{{ item.product.name }}</span>
            </li>
          </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'stock',
  data: function () {
    return {
      loading: false,
      error: false,
      alertDuration: 10000,
      errorMessage: ''
    }
  },
  async fetch ({store}) {
    await store.dispatch('recipes/get')
  },
  computed: mapState({
    recipes: state => this.$store.state.recipes
  })
}
</script>

<style lang="scss" scoped>
@import "assets/theme.scss";

.title {
  line-height: 2rem;
  font-size: 1.6rem;
  font-weight: 900;
  margin: .5em;
  padding: 0;
}
.ingredients {
  display: block;
  list-style: none;
  margin: 0 0 1.25em;
  padding: 0;
  position: relative;
}
.ingredient {
  position: relative;
  display: block;
  font-size: 1rem;
  margin: .25rem 0 .25rem 34%;
  padding: 0 .25rem;
}
.ingredient__amount {
  position: absolute;
  display: block;
  top: 0;
  right: 100%;
  width: 50%;
  text-align: right;
  white-space: nowrap;
  font-weight: 300;

  &::after {
    content: ' ';
    white-space: pre;
  }
}
.recipes {
  display: grid;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1em;
}
.recipe {
  background: $color-background;
  padding: .25em;
  position: relative;
}
.promoted {
  background: $color-highlight-background;
  color: $color-highlight;
}
.demoted {
  background: $color-dim-background;
}
.low-stock {
  font-weight: 900;
}
.out-of-stock {
  text-decoration: line-through solid $color-highlight-background;
}
.expires-soon {
  .ingredient__amount::before {
    content: '➔ ';
  }
}
</style>
