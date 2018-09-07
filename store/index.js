import Vuex from 'vuex'
import moment from 'moment'

export default () => {
  return new Vuex.Store({
    state: {
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
        newState.shoppinglist = payload.item.filter((item) => {
          if (item.product) {
            return item
          }
        })

        newState.shoppinglist.sort(
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
            var x = a.name.toLowerCase()
            var y = b.name.toLowerCase()
            return x < y ? -1 : x > y ? 1 : 0
          }
        )

        newState.stock.map((location) => {
          location.products.map((item) => {
            let bestBeforeThreshold = moment().add(5, 'days')

            item.priority = 0

            if (item.stockLevel === 0) {
              item.priority += 5
            }

            if (item.stockLevel < item.minStockAmount) {
              item.priority += 3
              item.lowStock = true
            }

            if (moment(item.bestBefore).isBefore(bestBeforeThreshold)) {
              item.priority += 2
              item.expiresSoon = true
            }

            if (item.minStockAmount > 0) {
              item.priority += 1
            }

            return item
          })

          return location.products.sort((a, b) => {
            if (a.priority < b.priority) {
              return 1
            }

            if (a.priority > b.priority) {
              return -1
            }

            if (a.name < b.name) {
              return -1
            }

            if (a.name > b.name) {
              return 1
            }

            return 0
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
            ingredient.priority = 0

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

        newState.recipes.sort((a, b) => {
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
