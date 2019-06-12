<template>
  <div class="main-content">
    <form novalidate class="settings">
      <label>
        <span>Grocy Token</span>
        <input v-model="grocy" type="text" />
      </label>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: function() {
    return {}
  },
  computed: {
    grocy: {
      get() {
        return this.$store.state.settings.tokens.grocy
      },
      set(token) {
        this.$store.dispatch('settings/setGrocyToken', token)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/theme.scss';

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
  padding: 1em 0.5em;
}
</style>
