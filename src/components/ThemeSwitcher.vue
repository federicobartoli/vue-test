<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <div class="theme-switcher">
    <button @click="toggleTheme" class="theme-switcher__button">
      {{ isDark ? '🌙' : '☀️' }}
    </button>
  </div>
</template>

<style scoped>
.theme-switcher {
  position: fixed;
  top: 0;
  left: 0;
}
.theme-switcher__button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}
</style>
