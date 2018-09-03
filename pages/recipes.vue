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
        <div class="title">
          <h2>{{ recipe.name }}</h2>
        </div>
        <ul class="ingredients">
          <li
            v-for="item in recipe.ingredients"
            :key="item.id"
            class="ingredient"
            :class="{
              'expires-soon': item.product.expiresSoon,
              'low-stock': item.product.stockLevel < item.amount
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

<style lang="scss">
.title {
  width: 50%;
  float: left;
  text-align: right;;
  position: sticky;
  top: .25em;

  &::after {
    content: '';
    display: block;
    width: 50%;
    position: absolute;
    top: -.25em;
    left: 100%;
    height: .25em;
    background: black;
  }
}
.ingredients {
  width: 50%;
  float: left;
  display: block;
  list-style: none;
  margin: 0 0 1.25em;
  padding: 0 0 0 25%;
  position: relative;
}
.ingredient {
  position: relative;
  margin: 0 0 .5em;
}
.ingredient__amount {
  position: absolute;
  top: 0;
  right: 100%;
  display: block;
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
}
.recipe {
  background: #fbae17;
  padding: .25em;
  position: relative;
}
.expires-soon {
  // background: #88a0a8;
  font-weight: 900;
}
.low-stock {
  // background: #546a76;
  text-decoration: line-through;
}
.promoted {
  background: #f7772c;
}
.demoted {
  background: #dd6464;
}
</style>
