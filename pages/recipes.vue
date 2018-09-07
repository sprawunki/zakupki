<template>
  <div class="recipes">
    <div
      class="recipe"
      v-for="recipe in $store.state.recipes"
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

    <md-snackbar md-position="center" :md-duration="alertDuration" :md-active.sync="error" md-persistent>
      <span>{{ errorMessage }}</span>
      <md-button class="md-primary" @click="error = false">Close</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
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
  methods: {
    updateRecipeList (collection) {
      this.$store.dispatch({
        type: 'updateRecipeList',
        item: collection
      })
    },
    load () {
      this.loading = true
      let tokens = this.$store.state.token
      let query = '{recipes {name ingredients {amount product {name stockUnit {name} stockLevel bestBefore}}}}'
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

            this.updateRecipeList(response.data.data.recipes)

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
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  overflow: scroll;
  background: $color-base;
  row-gap: 1px;
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
