import { ref, watch } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

    isDark.value = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  const applyTheme = () => {
    document.documentElement.classList.toggle('dark-theme', isDark.value)
  }

  loadTheme()
  applyTheme()

  watch(isDark, applyTheme)

  return {
    isDark,
    toggleTheme
  }
}
