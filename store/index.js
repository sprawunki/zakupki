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
      updateList (state, payload) {
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
      addItem (state, payload) {
        state.shoppinglist.unshift(payload.item)
        state.shoppinglist = state.shoppinglist.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.product.name === thing.product.name
          ))
        )

        state.shoppinglist = state.shoppinglist.sort(
          (a, b) => {
            var x = a.product.name.toLowerCase()
            var y = b.product.name.toLowerCase()
            return x < y ? -1 : x > y ? 1 : 0
          }
        )

        return state
      },
      removeItem (state, payload) {
        state.shoppinglist = state.shoppinglist.filter((thing, index, self) =>
          index !== self.findIndex(() => (
            payload.item.product.name === thing.product.name
          ))
        )
        return state
      },
      addRecipe (state, payload) {
        state.recipes.unshift(payload.item)
        state.recipes = state.recipes.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.name === thing.name
          ))
        )

        state.recipes.map((recipe) => {
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

        return state
      },
      removeRecipe (state, payload) {
        state.recipes = state.recipes.filter((thing, index, self) =>
          index !== self.findIndex(() => (
            payload.item.name === thing.name
          ))
        )
        return state
      },
      addStockItem (state, payload) {
        payload.item.products.map((item) => {
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

        state.stock.unshift(payload.item)
        state.stock = state.stock.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.name === thing.name
          ))
        )

        return state
      },
      removeStockItem (state, payload) {
        state.stock = state.stock.filter((thing, index, self) =>
          index !== self.findIndex(() => (
            payload.item.name === thing.name
          ))
        )
        return state
      },
      setGrocyToken (state, payload) {
        state.token.grocy = payload
        return state
      }
    },
    actions: {
      updateList (context, payload) {
        context.commit('updateList', payload)
      },
      addItem (context, payload) {
        context.commit('addItem', payload)
      },
      removeItem (context, payload) {
        context.commit('removeItem', payload)
      },
      addRecipe (context, payload) {
        context.commit('addRecipe', payload)
      },
      removeRecipe (context, payload) {
        context.commit('removeRecipe', payload)
      },
      addStockItem (context, payload) {
        context.commit('addStockItem', payload)
      },
      removeStockItem (context, payload) {
        context.commit('removeStockItem', payload)
      },
      setGrocyToken (context, payload) {
        context.commit('setGrocyToken', payload)
      }
    }
  })
}
