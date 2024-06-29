import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from '../TaskList.vue'
import { useTasks } from '@/composables/useTasks'
import { ref } from 'vue'
import type { Task } from '@/types/tasks'

// Mock composable
vi.mock('@/composables/useTasks', () => ({
  useTasks: vi.fn()
}))

describe('TaskList', () => {
  it('renders task list', () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
      { id: 2, title: 'Task 2', description: 'Description 2', completed: true }
    ]

    vi.mocked(useTasks).mockReturnValue({
      tasks: ref<Task[]>(mockTasks),
      isLoading: ref(false),
      isPending: ref(false),
      isError: ref(false),
      error: ref(null),
      newTaskTitle: ref(''),
      newTaskDescription: ref(''),
      isAddingTask: ref(false),
      addTask: vi.fn(),
      handleTaskStatusChange: vi.fn(),
      handleDeleteTask: vi.fn()
    })

    const wrapper = mount(TaskList)
    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.text()).toContain('Task 1')
    expect(wrapper.text()).toContain('Task 2')
  })

  it('adds a new task', async () => {
    const addTaskMock = vi.fn()
    vi.mocked(useTasks).mockReturnValue({
      tasks: ref<Task[]>([]),
      isLoading: ref(false),
      isPending: ref(false),
      isError: ref(false),
      error: ref(null),
      newTaskTitle: ref(''),
      newTaskDescription: ref(''),
      isAddingTask: ref(false),
      addTask: addTaskMock,
      handleTaskStatusChange: vi.fn(),
      handleDeleteTask: vi.fn()
    })

    const wrapper = mount(TaskList)
    await wrapper.find('input[placeholder="Titolo del nuovo task"]').setValue('New Task')
    await wrapper
      .find('input[placeholder="Descrizione del nuovo task"]')
      .setValue('New Description')
    await wrapper.find('button:not(:disabled)').trigger('click')

    expect(addTaskMock).toHaveBeenCalled()
  })

  it('changes task status', async () => {
    const handleTaskStatusChangeMock = vi.fn()
    const mockTasks = [{ id: 1, title: 'Task 1', description: 'Description 1', completed: false }]

    vi.mocked(useTasks).mockReturnValue({
      tasks: ref<Task[]>(mockTasks),
      isLoading: ref(false),
      isPending: ref(false),
      isError: ref(false),
      error: ref(null),
      newTaskTitle: ref(''),
      newTaskDescription: ref(''),
      isAddingTask: ref(false),
      addTask: vi.fn(),
      handleTaskStatusChange: handleTaskStatusChangeMock,
      handleDeleteTask: vi.fn()
    })

    const wrapper = mount(TaskList)
    await wrapper.find('input[type="checkbox"]').setValue(true)

    expect(handleTaskStatusChangeMock).toHaveBeenCalledWith(1, true)
  })

  it('deletes a task', async () => {
    const handleDeleteTaskMock = vi.fn()
    const mockTasks = [{ id: 1, title: 'Task 1', description: 'Description 1', completed: false }]

    vi.mocked(useTasks).mockReturnValue({
      tasks: ref<Task[]>(mockTasks),
      isLoading: ref(false),
      isPending: ref(false),
      isError: ref(false),
      error: ref(null),
      newTaskTitle: ref(''),
      newTaskDescription: ref(''),
      isAddingTask: ref(false),
      addTask: vi.fn(),
      handleTaskStatusChange: vi.fn(),
      handleDeleteTask: handleDeleteTaskMock
    })

    const wrapper = mount(TaskList)
    await wrapper.find('button:not(:disabled)').trigger('click')

    expect(handleDeleteTaskMock).toHaveBeenCalledWith(1)
  })
})
