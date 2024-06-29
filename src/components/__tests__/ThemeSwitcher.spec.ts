import { test, suite, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeSwitcher from '../ThemeSwitcher.vue'
import { ref } from 'vue'

vi.mock('@/composables/useTheme', () => ({
  useTheme: vi.fn()
}))

import { useTheme } from '@/composables/useTheme'

suite('ThemeSwitcher', () => {
  test('renders sun emoji when theme is light', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDark: ref(false),
      toggleTheme: vi.fn()
    })
    const wrapper = mount(ThemeSwitcher)
    expect(wrapper.text()).toBe('☀️')
  })

  test('renders moon emoji when theme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDark: ref(true),
      toggleTheme: vi.fn()
    })
    const wrapper = mount(ThemeSwitcher)
    expect(wrapper.text()).toBe('🌙')
  })

  test('calls toggleTheme when clicked', async () => {
    const mockToggleTheme = vi.fn()
    vi.mocked(useTheme).mockReturnValue({
      isDark: ref(false),
      toggleTheme: mockToggleTheme
    })

    const wrapper = mount(ThemeSwitcher)
    await wrapper.find('button').trigger('click')
    expect(mockToggleTheme).toHaveBeenCalled()
  })
})
