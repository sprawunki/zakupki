<template>
  <md-content class="main-content">
    <md-empty-state
      v-if="showNotice"
      md-label="Hey there!"
      md-description="This is a demo, using the official Grocy demo as backend.">
      <p>Click on the gear icon in the top right corner of the screen to set the token and see the real data.</p>
    </md-empty-state>
  </md-content>
</template>

<script>
export default {
  name: 'index',
  data: function () {
    return {
      showNotice: false
    }
  },
  methods: {
    updateNotice () {
      this.showNotice = !this.$store.state.token.grocy

      if (!this.showNotice) {
        this.$router.push({path: 'list'})
      }
    }
  },
  watch: {
    'this.$store.state.token.grocy': (value) => {
      this.updateNotice()
    }
  },
  mounted () {
    this.updateNotice()
  }
}
</script>
