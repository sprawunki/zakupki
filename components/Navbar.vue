<template>
  <div class="navbar">
    <nav
      id="main-navigation"
      class="main-nav"
    >
      <ul class="main-nav__list">
        <li class="main-nav__item">
          <nuxt-link class="main-nav__link" to="/list">list</nuxt-link>
        </li>
        <li class="main-nav__item">
          <nuxt-link class="main-nav__link" to="/stock">stock</nuxt-link>
        </li>
        <li class="main-nav__item">
          <nuxt-link class="main-nav__link" to="/recipes">recipes</nuxt-link>
        </li>
        <li class="main-nav__item">
          <nuxt-link class="main-nav__link" to="/settings">settings</nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss">
@import "assets/theme.scss";

.navbar {
  background: $color-background;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
}
.main-nav {
  display: table;
  margin: 0 auto;
  max-width: 100%;

  &__list {
    display: table-row;
    margin: 0;
    padding: 0;
  }

  &__item {
    display: table-cell;
    padding: 0.5em;
  }

  &__link {
    display: block;
    padding: 0.5em;
  }
}

</style>
