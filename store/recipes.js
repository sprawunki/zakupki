import axios from 'axios'
import moment from 'moment'

export const state = () => ({
  items: []
})

export const mutations = {
  set (state, payload) {
    let newState = state

    newState.items = payload

    newState.items.map((recipe) => {
      let bestBeforeThreshold = moment().add(5, 'days')

      recipe.score = 0

      recipe.ingredients.map((ingredient) => {
        ingredient.priority = 0

        if (ingredient.product) {
          if (ingredient.product.stockLevel < ingredient.amount) {
            recipe.score -= 2
            ingredient.priority += 2
          }

          if (ingredient.product.stockLevel === 0) {
            recipe.score -= 2
            ingredient.priority += 2
          }

          if (moment(ingredient.product.bestBefore).isBefore(bestBeforeThreshold)) {
            recipe.score += 1
            ingredient.priority += 1
            ingredient.product.expiresSoon = true
          }
        }

        return ingredient
      })

      recipe.ingredients.sort((a, b) => {
        if (a.priority > b.priority) {
          return -1
        }

        if (a.priority < b.priority) {
          return 1
        }

        if (a.name < b.name) {
          return -1
        }

        if (a.name > b.name) {
          return 1
        }

        return 0
      })

      return recipe
    })

    newState.items.sort((a, b) => {
      if (a.score > b.score) {
        return -1
      }

      if (a.score < b.score) {
        return 1
      }

      if (a.name < b.name) {
        return -1
      }

      if (a.name > b.name) {
        return 1
      }

      return 0
    })

    Object.assign(state, newState)
  }
}

export const actions = {
  async get ({commit, rootState}) {
    let apiUrl = process.env.apiUrl
    if (this.$env.API_URL) {
      apiUrl = this.$env.API_URL
    }

    let tokens = rootState.settings.tokens
    let query = '{recipes {name ingredients {amount product {name stockUnit {name} stockLevel bestBefore}}}}'
    let q = JSON.stringify(
      {
        query: query,
        tokens: tokens
      }
    )

    await axios
      .get(apiUrl + '?q=' + encodeURIComponent(q))
      .then(
        response => {
          if (response.data.errors) {
            throw response.data.errors[0].message
          }

          commit('set', response.data.data.recipes)
        }
      ).catch(
        (error) => {
          this.loading = false
          this.error = true
          this.errorMessage = error
        }
      )
  }
}
