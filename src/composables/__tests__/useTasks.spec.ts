import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTasks } from '@/composables/useTasks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import type { Task } from '@/types/tasks'

vi.mock('@tanstack/vue-query')
vi.mock('@/api/tasks')
vi.mock('vue3-toastify')

describe('useTasks', () => {
  const mockQueryClient = {
    invalidateQueries: vi.fn(),
    cancelQueries: vi.fn(),
    getQueryData: vi.fn(),
    setQueryData: vi.fn()
  }

  beforeEach(() => {
    vi.resetAllMocks()

    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient as any)

    vi.mocked(useQuery).mockReturnValue({
      data: ref<Task[]>([]),
      isLoading: ref(false),
      isPending: ref(false),
      isError: ref(false),
      error: ref(null)
    } as any)

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn()
    } as any)
  })

  it('should fetch tasks', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Test Task', description: 'Test Description', completed: false }
    ]

    vi.mocked(useQuery).mockReturnValue({
      data: ref(mockTasks),
      isLoading: ref(false),
      isPending: ref(false),
      isError: ref(false),
      error: ref(null)
    } as any)

    const { tasks } = useTasks()

    expect(tasks.value).toEqual(mockTasks)
  })

  it('should add a new task', async () => {
    const mockMutate = vi.fn()
    vi.mocked(useMutation).mockReturnValue({
      mutateAsync: mockMutate
    } as any)

    const { newTaskTitle, newTaskDescription, addTask } = useTasks()

    newTaskTitle.value = 'New Task'
    newTaskDescription.value = 'New Description'

    await addTask()

    expect(mockMutate).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New Description'
    })
  })

  it('should delete a task', () => {
    const mockMutate = vi.fn()
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate
    } as any)

    const { handleDeleteTask } = useTasks()

    handleDeleteTask(1)

    expect(mockMutate).toHaveBeenCalledWith(1)
  })

  it('should change task status', () => {
    const mockMutate = vi.fn()
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate
    } as any)

    const { handleTaskStatusChange } = useTasks()

    handleTaskStatusChange(1, true)

    expect(mockMutate).toHaveBeenCalledWith({ id: 1, completed: true })
  })

  it('should invalidate queries after mutation', () => {
    let onSettled: (() => void) | undefined

    vi.mocked(useMutation).mockImplementation((options: any) => {
      onSettled = options.onSettled
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn()
      } as any
    })

    useTasks() // This will set up the mutations

    if (onSettled) {
      onSettled()
    }

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['tasks'] })
  })
})
