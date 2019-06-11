import axios from 'axios'
import moment from 'moment'

export const state = () => ({
  items: []
})

export const mutations = {
  set (state, payload) {
    let newState = state

    newState.items = payload.sort(
      (a, b) => {
        var x = a.name.toLowerCase()
        var y = b.name.toLowerCase()
        return x < y ? -1 : x > y ? 1 : 0
      }
    )

    newState.items.map((location) => {
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
  }
}

export const actions = {
  async get ({commit, rootState}) {
    let apiUrl = process.env.apiUrl
    if (this.$env.API_URL) {
      apiUrl = this.$env.API_URL
    }

    let tokens = rootState.settings.tokens
    let query = '{locations {name products {name bestBefore stockLevel minStockAmount stockUnit {name}}}}'
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

          commit('set', response.data.data.locations)
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
