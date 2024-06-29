import { test, suite, expect, vi, beforeEach } from 'vitest'
import { useTheme } from '../useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark-theme')
  vi.resetAllMocks()
})

suite('useTheme', () => {
  test('loads theme from localStorage', () => {
    localStorage.setItem('theme', 'dark')
    const { isDark } = useTheme()
    expect(isDark.value).toBe(true)
  })

  test('toggles theme', () => {
    const { isDark, toggleTheme } = useTheme()
    expect(isDark.value).toBe(undefined)
    toggleTheme()
    expect(isDark.value).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  test('applies theme to document', () => {
    const { toggleTheme } = useTheme()
    toggleTheme()
    expect(document.documentElement.classList.contains('dark-theme')).toBe(true)
  })
})
