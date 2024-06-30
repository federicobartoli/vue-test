<script setup lang="ts">
import { RouterView } from 'vue-router'

import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { useTheme } from './composables/useTheme'

const { isDark } = useTheme()
</script>

<template>
  <div :class="{ 'dark-theme': isDark }" class="container">
    <header>
      <div class="wrapper">
        <h1>Task managment</h1>
        <ThemeSwitcher v-model="isDark" />
      </div>
    </header>

    <RouterView />
  </div>
</template>
