<template>
  <div class="top-bar">
    <md-toolbar :md-elevation="1">
      <span class="md-title">Zakupki</span>

      <div class="md-toolbar-section-end">
        <md-button class="md-icon-button" to="/settings">
          <md-icon>settings</md-icon>
        </md-button>
      </div>
    </md-toolbar>
  </div>
</template>

<script>
export default {
  name: 'toolbar'
}
</script>
