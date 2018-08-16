<template>
  <md-content class="main-content md-layout">
    <div class="md-layout-item md-xsmall-size-100 md-small-size-50 md-medium-size-33 md-large-size-25" v-for="recipe in $store.state.recipes" :key="recipe.id">
      <md-card>
        <md-card-header>
          <span class="md-title"><md-icon v-if="recipe.score > 0">priority_high</md-icon>{{ recipe.name }}</span>
        </md-card-header>
        <md-card-content>
          <md-list>
            <md-subheader>Składniki</md-subheader>
            <md-list-item v-for="item in sortByProductPriority(recipe.ingredients)" :key="item.id" :class="{ 'md-inset': !item.product.expiresSoon }">
              <md-icon v-if="item.product.expiresSoon">warning</md-icon>
              <del v-if="item.product.stockLevel < item.amount" class="md-list-item-text ">{{ item.product.name }}</del>
              <span v-if="item.product.stockLevel >= item.amount" class="md-list-item-text ">{{ item.product.name }}</span>
              <span class="md-caption">{{ item.amount }} {{item.product.stockUnit.name }}</span>
            </md-list-item>
          </md-list>
        </md-card-content>
      </md-card>
    </div>

    <md-snackbar md-position="center" :md-duration="alertDuration" :md-active.sync="error" md-persistent>
      <span>{{ errorMessage }}</span>
      <md-button class="md-primary" @click="error = false">Close</md-button>
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
      loading: false,
      error: false,
      alertDuration: 10000,
      errorMessage: ''
    }
  },
  methods: {
    sortByName (data) {
      return data.sort((a, b) => a.name > b.name)
    },
    sortByProductPriority (data) {
      return data.sort((a, b) => {
        if (a.product.priority === b.product.priority) {
          return a.product.name > b.product.name
        }

        return a.product.priority < b.product.priority
      })
    },
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
            // this.loading = false
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
.md-card {
  margin: 4px;
}
</style>
