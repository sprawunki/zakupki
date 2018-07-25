import Vuex from 'vuex'

export default () => {
  return new Vuex.Store({
    state: {
      shoppinglist: []
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
      }
    },
    actions: {
      addItem (context, payload) {
        context.commit('addItem', payload)
      },
      removeItem (context, payload) {
        context.commit('removeItem', payload)
      }
    }
  })
}
