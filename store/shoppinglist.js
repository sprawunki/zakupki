import axios from 'axios'

export const state = () => ({
  items: [],
  cart: []
})

export const mutations = {
  set (state, payload) {
    let newState = state
    newState.items = payload.filter((item) => {
      if (item.product) {
        return item
      }
    })

    newState.cart = newState.cart.filter((item) => {
      return state
        .list
        .filter(
          (listItem) => {
            return listItem.product.name === item
          }
        ).length > 0
    })

    Object.assign(state, newState)
  },
  toggleCartItem (state, payload) {
    if (state.cart.includes(payload)) {
      state.cart = state.cart.filter((item) => item !== payload)
    } else {
      state.cart.push(payload)
    }
  }
}

export const actions = {
  toggleItem (context, payload) {
    context.commit('toggleCartItem', payload)
  },
  async get ({commit, rootState}) {
    let apiUrl = process.env.apiUrl
    if (this.$env.API_URL) {
      apiUrl = this.$env.API_URL
    }

    let tokens = rootState.settings.tokens
    let query = '{items {amount product {name purchaseUnit {name}}}}'
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

          commit('set', response.data.data.items)
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

export const getters = {
  listItems: state => {
    let listItems = JSON.parse(JSON.stringify(state.items))
    let cart = JSON.parse(JSON.stringify(state.cart))

    listItems.forEach((item) => {
      item.id = item.product.name
      item.inCart = false

      if (cart.includes(item.product.name)) {
        item.inCart = true
      }
    })

    listItems.sort(
      (a, b) => {
        if (a.inCart && !b.inCart) {
          return 1
        }

        if (!a.inCart && b.inCart) {
          return -1
        }

        var x = a.product.name.toLowerCase()
        var y = b.product.name.toLowerCase()
        return x < y ? -1 : x > y ? 1 : 0
      }
    )

    return listItems
  }
}
