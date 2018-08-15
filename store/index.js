import Vuex from 'vuex'
import moment from 'moment'

export default () => {
  return new Vuex.Store({
    state: {
      loading: false,
      refresh: false,
      shoppinglist: [],
      stock: [],
      recipes: [],
      token: {
        grocy: ''
      }
    },
    mutations: {
      updateShoppingList (state, payload) {
        let newState = state
        newState.shoppinglist = payload.item.sort(
          (a, b) => {
            var x = a.product.name.toLowerCase()
            var y = b.product.name.toLowerCase()
            return x < y ? -1 : x > y ? 1 : 0
          }
        )

        Object.assign(state, newState)
      },
      updateStockList (state, payload) {
        let newState = state
        newState.stock = payload.item.sort(
          (a, b) => {
            var x = a.location.name.toLowerCase()
            var y = b.location.name.toLowerCase()
            return x < y ? -1 : x > y ? 1 : 0
          }
        )

        newState.stock.map((location) => {
          return location.products.map((item) => {
            let bestBeforeThreshold = moment().add(5, 'days')

            item.priority = 0
            if (item.minStockAmount > 0) {
              item.priority += 2
            }
            if (item.stockLevel === 0) {
              item.priority += 3
            }
            if (item.stockLevel < item.minStockAmount) {
              item.priority += 5
              item.lowStock = true
            }
            if (moment(item.bestBefore).isBefore(bestBeforeThreshold)) {
              item.priority += 1
              item.expiresSoon = true
            }
            return item
          })
        })

        Object.assign(state, newState)
      },
      updateRecipeList (state, payload) {
        let newState = state

        newState.recipes = payload.item

        newState.recipes.map((recipe) => {
          let bestBeforeThreshold = moment().add(5, 'days')

          recipe.score = 0
          recipe.ingredients.map((ingredient) => {
            ingredient.product.priority = 0

            if (ingredient.product.stockLevel < ingredient.amount) {
              recipe.score -= 2
              ingredient.product.priority += 2
            }

            if (moment(ingredient.product.bestBefore).isBefore(bestBeforeThreshold)) {
              recipe.score += 1
              ingredient.product.expiresSoon = true
              ingredient.product.priority += 1
            }

            return ingredient
          })

          return recipe
        })

        newState.recipes.sort((a, b) => {
          if (a.score === b.score) {
            return a.name > b.name
          }

          return a.score < b.score
        })

        Object.assign(state, newState)
      },
      setGrocyToken (state, payload) {
        state.token.grocy = payload
        return state
      }
    },
    actions: {
      updateShoppingList (context, payload) {
        context.commit('updateShoppingList', payload)
      },
      updateRecipeList (context, payload) {
        context.commit('updateRecipeList', payload)
      },
      updateStockList (context, payload) {
        context.commit('updateStockList', payload)
      },
      setGrocyToken (context, payload) {
        context.commit('setGrocyToken', payload)
      }
    }
  })
}
