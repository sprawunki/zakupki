import Vuex from 'vuex'

export default () => {
  return new Vuex.Store({
    state: {
      shoppinglist: [],
      token: {
        grocy: ''
      }
    },
    mutations: {
      addItem (state, payload) {
        console.debug('addItem', payload)
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
        console.debug('removeItem', payload)
        state.shoppinglist = state.shoppinglist.filter((thing, index, self) =>
          index !== self.findIndex(() => (
            payload.item.product.name === thing.product.name
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
      addItem (context, payload) {
        context.commit('addItem', payload)
      },
      removeItem (context, payload) {
        context.commit('removeItem', payload)
      },
      setGrocyToken (context, payload) {
        context.commit('setGrocyToken', payload)
      }
    }
  })
}
