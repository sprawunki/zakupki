<template>
  <div class="main-content">
    <div class="recipes">
      <div
        v-for="recipe in $store.state.recipes.items"
        :key="recipe.id"
        class="recipe"
        :class="{
          promoted: recipe.score > 0,
          demoted: recipe.score < 0
        }"
      >
        <h2 class="title">{{ recipe.name }}</h2>
        <ul class="ingredients">
          <ingredient-list-item
            v-for="item in recipe.ingredients"
            :key="item.id"
            :ingredient="item"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import IngredientListItem from '~/components/IngredientListItem.vue'

export default {
  name: 'Recipes',
  components: {
    IngredientListItem
  },
  data: function() {
    return {
      loading: false,
      error: false,
      alertDuration: 10000,
      errorMessage: ''
    }
  },
  computed: mapState({
    recipes: state => this.$store.state.recipes
  }),
  async fetch({ store }) {
    await store.dispatch('recipes/get')
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/theme.scss';

.title {
  line-height: 2rem;
  font-size: 1.6rem;
  font-weight: 900;
  margin: 0.5em;
  padding: 0;
}
.ingredients {
  display: block;
  list-style: none;
  margin: 0 0 1.25em;
  padding: 0;
  position: relative;
}
.recipes {
  display: grid;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1em;
}
.recipe {
  background: $color-background;
  padding: 0.25em;
  position: relative;
}
.promoted {
  background: $color-base;
  color: $color-background;
}
.demoted {
  color: $color-dim;
}
</style>
