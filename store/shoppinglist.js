export const state = () => ({
  items: [],
  cart: []
})

export const mutations = {
  SET_SHOPPINGLIST(state, payload) {
    const newState = state
    newState.items = payload.filter(item => {
      if (item.product) {
        return item
      }
    })

    newState.cart = newState.cart.filter(item => {
      return (
        state.items.filter(listItem => {
          return listItem.product.name === item
        }).length > 0
      )
    })

    Object.assign(state, newState)
  },
  toggleCartItem(state, payload) {
    if (state.cart.includes(payload)) {
      state.cart = state.cart.filter(item => item !== payload)
    } else {
      state.cart.push(payload)
    }
  }
}

export const actions = {
  toggleItem(context, payload) {
    context.commit('toggleCartItem', payload)
  },
  async get({ commit, rootState }) {
    let apiUrl = process.env.apiUrl
    if (this.$env.API_URL) {
      apiUrl = this.$env.API_URL
    }

    const tokens = rootState.settings.tokens
    const query = '{items {amount product {name purchaseUnit {name}}}}'
    const q = JSON.stringify({
      query: query,
      tokens: tokens
    })

    const data = await this.$axios.$get(apiUrl + '?q=' + encodeURIComponent(q))
    commit('SET_SHOPPINGLIST', data.data.items)
  }
}

export const getters = {
  listItems: state => {
    const listItems = JSON.parse(JSON.stringify(state.items))
    const cart = JSON.parse(JSON.stringify(state.cart))

    listItems.forEach(item => {
      item.id = item.product.name
      item.inCart = false

      if (cart.includes(item.product.name)) {
        item.inCart = true
      }
    })

    listItems.sort((a, b) => {
      if (a.inCart && !b.inCart) {
        return 1
      }

      if (!a.inCart && b.inCart) {
        return -1
      }

      const x = a.product.name.toLowerCase()
      const y = b.product.name.toLowerCase()
      return x < y ? -1 : x > y ? 1 : 0
    })

    return listItems
  }
}
