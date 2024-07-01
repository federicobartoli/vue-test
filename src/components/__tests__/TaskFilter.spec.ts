import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TaskFilter from '../TaskFilter.vue'
import type { Task } from '@/types/tasks'

describe('TaskFilter', () => {
  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
    { id: 2, title: 'Task 2', description: 'Description 2', completed: true },
    { id: 3, title: 'Task 3', description: 'Description 3', completed: false }
  ]

  it('renders correctly', () => {
    const wrapper = mount(TaskFilter, {
      props: { tasks: mockTasks }
    })
    expect(wrapper.find('.task-filter').exists()).toBe(true)
    expect(wrapper.find('#filter-status').exists()).toBe(true)
    expect(wrapper.find('#search-query').exists()).toBe(true)
    expect(wrapper.find('#sort-by').exists()).toBe(true)
  })

  it('filters tasks by status', async () => {
    const wrapper = mount(TaskFilter, {
      props: { tasks: mockTasks }
    })
    const filterSelect = wrapper.find('#filter-status')
    await filterSelect.setValue('completed')
    await flushPromises()

    expect(wrapper.emitted('filter')).toBeTruthy()
    const filteredTasks = wrapper.emitted('filter')![
      wrapper.emitted('filter')!.length - 1
    ][0] as Task[]
    expect(filteredTasks).toHaveLength(1)
    expect(filteredTasks[0].id).toBe(2)
    expect(filteredTasks[0].completed).toBe(true)
  })

  it('filters tasks using fuzzy search with high threshold', async () => {
    const wrapper = mount(TaskFilter, {
      props: { tasks: mockTasks }
    })
    const searchInput = wrapper.find('#search-query')
    await searchInput.setValue('Task 3')
    await flushPromises()

    expect(wrapper.emitted('filter')).toBeTruthy()
    const filterEvents = wrapper.emitted('filter')
    expect(filterEvents).toBeTruthy()
    const filteredTasks = filterEvents![filterEvents!.length - 1][0] as Task[]

    expect(filteredTasks).toHaveLength(3) // this is correct cause we have .4 threshold
    expect(filteredTasks[0].title).toBe('Task 3')
    expect(filteredTasks.every((task) => task.title.includes('Task'))).toBe(true)
  })

  it('sorts tasks by name', async () => {
    const wrapper = mount(TaskFilter, {
      props: { tasks: mockTasks }
    })
    const sortSelect = wrapper.find('#sort-by')
    await sortSelect.setValue('name')
    await flushPromises()

    expect(wrapper.emitted('filter')).toBeTruthy()
    const sortedTasks = wrapper.emitted('filter')![
      wrapper.emitted('filter')!.length - 1
    ][0] as Task[]
    expect(sortedTasks[0].title).toBe('Task 1')
    expect(sortedTasks[1].title).toBe('Task 2')
    expect(sortedTasks[2].title).toBe('Task 3')
  })

  it('sorts tasks by status', async () => {
    const wrapper = mount(TaskFilter, {
      props: { tasks: mockTasks }
    })
    const sortSelect = wrapper.find('#sort-by')
    await sortSelect.setValue('status')
    await flushPromises()

    expect(wrapper.emitted('filter')).toBeTruthy()
    const sortedTasks = wrapper.emitted('filter')![
      wrapper.emitted('filter')!.length - 1
    ][0] as Task[]
    expect(sortedTasks[0].completed).toBe(false)
    expect(sortedTasks[1].completed).toBe(false)
    expect(sortedTasks[2].completed).toBe(true)
  })
})
