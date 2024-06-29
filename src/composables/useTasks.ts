import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue3-toastify'
import * as tasksApi from '@/api/tasks'
import type { Task } from '@/types/tasks'

export function useTasks() {
  const queryClient = useQueryClient()
  const newTaskTitle = ref('')
  const newTaskDescription = ref('')
  const isAddingTask = ref(false)

  const {
    data: tasks,
    isLoading,
    isPending,
    isError,
    error
  } = useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: tasksApi.fetchTasks
  })

  const createMutation = useMutation({
    mutationFn: ({ title, description }: { title: string; description: string }) =>
      tasksApi.createTask(title, description),
    onMutate: async ({ title, description }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      queryClient.setQueryData<Task[]>(['tasks'], (old) => [
        { id: Date.now(), title, description, completed: false },
        ...(old || [])
      ])
      return { previousTasks }
    },
    onError: (error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], context.previousTasks)
      }
      toast.error(`Failed to create task: ${error.message}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: tasksApi.deleteTask,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old ? old.filter((task) => task.id !== deletedId) : []
      )
      return { previousTasks }
    },
    onError: (error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], context.previousTasks)
      }
      toast.error(`Failed to delete task: ${error.message}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      tasksApi.changeTaskStatus(id, completed),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old ? old.map((task) => (task.id === id ? { ...task, completed } : task)) : []
      )
      return { previousTasks }
    },
    onError: (error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], context.previousTasks)
      }
      toast.error(`Failed to update task status: ${error.message}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const addTask = async () => {
    if (newTaskTitle.value.trim() && newTaskDescription.value.trim()) {
      isAddingTask.value = true
      try {
        await createMutation.mutateAsync({
          title: newTaskTitle.value,
          description: newTaskDescription.value
        })
        newTaskTitle.value = ''
        newTaskDescription.value = ''
      } finally {
        isAddingTask.value = false
      }
    }
  }

  const handleTaskStatusChange = (id: number, completed: boolean) => {
    changeStatusMutation.mutate({ id, completed })
  }

  const handleDeleteTask = (id: number) => {
    deleteMutation.mutate(id)
  }

  return {
    tasks,
    isLoading,
    isPending,
    isError,
    error,
    newTaskTitle,
    newTaskDescription,
    isAddingTask,
    addTask,
    handleTaskStatusChange,
    handleDeleteTask
  }
}
