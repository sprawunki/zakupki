<template>
  <div class="main-content">
    <form novalidate class="settings">
      <label>
        <span>Grocy Token</span>
        <input type="text" v-model="grocy" />
      </label>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: function () {
    return {}
  },
  computed: {
    grocy: {
      get () {
        return this.$store.state.token.grocy
      },
      set (token) {
        this.$store.dispatch('setGrocyToken', token)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "assets/theme.scss";

.settings {
  @include card;
}
label {
  display: block;
}

label span {
  display: block;
}

label input {
  display: block;
  width: 100%;
  border: none;
  border-bottom: solid 1px $color-base;
  margin: 1em 0;
  padding: 1em .5em;
}
</style>
