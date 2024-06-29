<script setup lang="ts">
import { RouterView } from 'vue-router'

import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { useTheme } from './composables/useTheme'

const { isDark } = useTheme()
</script>

<template>
  <div :class="{ 'dark-theme': isDark }" class="container">
    <header>
      <img alt="Taskmanagment logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />

      <div class="wrapper">
        <h1>Task managment</h1>
        <ThemeSwitcher v-model="isDark" />
      </div>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
