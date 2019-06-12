import moment from 'moment'

export const state = () => ({
  items: []
})

export const mutations = {
  SET_STOCK(state, payload) {
    const newState = state

    newState.items = payload.sort((a, b) => {
      const x = a.name.toLowerCase()
      const y = b.name.toLowerCase()
      return x < y ? -1 : x > y ? 1 : 0
    })

    newState.items.map(location => {
      location.products.map(item => {
        const bestBeforeThreshold = moment().add(5, 'days')

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
  }
}

export const actions = {
  async get({ commit, rootState }) {
    let apiUrl = process.env.apiUrl
    if (this.$env.API_URL) {
      apiUrl = this.$env.API_URL
    }

    const tokens = rootState.settings.tokens
    const query =
      '{locations {name products {name bestBefore stockLevel minStockAmount stockUnit {name}}}}'
    const q = JSON.stringify({
      query: query,
      tokens: tokens
    })

    const data = await this.$axios.$get(apiUrl + '?q=' + encodeURIComponent(q))
    commit('SET_STOCK', data.data.locations)
  }
}
