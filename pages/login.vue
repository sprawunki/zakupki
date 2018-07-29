<template>

  <md-app>
    <md-app-toolbar class="md-dense">
      <div class="md-toolbar-row">
        <span class="md-title">Zakupki</span>

        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" to="/login">
            <md-icon>more_vert</md-icon>
          </md-button>
        </div>
      </div>
    </md-app-toolbar>

    <md-app-content>
      <form novalidate class="md-layout">
        <md-card class="md-layout-item">
          <md-card-header>
            <div class="md-title">Credentials</div>
          </md-card-header>

          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label for="grocy-token">Grocy Token</label>
                  <md-input name="grocy-token" v-model="grocy" />
                </md-field>
              </div>
            </div>
          </md-card-content>

          <md-card-actions>
            <md-button to="/">OK</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </md-app-content>
  </md-app>
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
