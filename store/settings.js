export const state = () => ({
  tokens: {
    grocy: ''
  }
})

export const mutations = {
  setGrocyToken (state, payload) {
    state.tokens.grocy = payload
    return state
  }
}

export const actions = {
  setGrocyToken (context, payload) {
    context.commit('setGrocyToken', payload)
  }
}
