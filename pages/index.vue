<template>
  <div class="main-content">
    <div class="intro">
      <h2>You're in the demo mode, you know?</h2>
      <p>Go ahead and have a look around!</p>
      <p>
        Go to <nuxt-link to="/settings">settings</nuxt-link> and set the token
        and see the real data.
      </p>
      <p>
        Learn more about Grocy at
        <a href="https://grocy.info/" target="_blank" rel="”noopener”"
          >https://grocy.info/</a
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data: function() {
    return {
      showNotice: false
    }
  },
  watch: {
    'this.$store.state.token.grocy': value => {
      this.updateNotice()
    }
  },
  mounted() {
    this.updateNotice()
  },
  methods: {
    updateNotice() {
      this.showNotice = !this.$store.state.settings.tokens.grocy

      if (!this.showNotice) {
        this.$router.push({ path: 'list' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/theme.scss';

.intro {
  @include card;
}
</style>
