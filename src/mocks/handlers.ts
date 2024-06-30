import { http, HttpResponse } from 'msw'
import { LiveStorage } from '@mswjs/storage'

import type { Task, CreateTaskPayload, UpdateTaskStatusPayload } from '@/types/tasks'

const initialData: Task[] = [
  {
    id: 1,
    title: 'Completare il progetto Vue',
    description: 'Finire di implementare tutte le funzionalità',
    completed: true
  },
  {
    id: 2,
    title: 'Imparare Pinia',
    description: 'Studiare la documentazione e fare esercizi',
    completed: false
  },
  {
    id: 3,
    title: 'Scrivere test unitari',
    description: "Coprire almeno l'80% del codice con test",
    completed: false
  }
]

const tasks = new LiveStorage('tasks', initialData)

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const handlers = [
  http.get('/api/tasks', async () => {
    // await delay(500)
    return HttpResponse.json(tasks.getValue())
  }),

  http.post<never, CreateTaskPayload>('/api/tasks', async ({ request }) => {
    const { title, description } = await request.json()
    const newTask: Task = { id: Date.now(), title, description, completed: false }
    // await delay(500)
    tasks.update((data) => [newTask, ...data])
    return HttpResponse.json(newTask, { status: 201 })
  }),

  http.put<{ id: string }, UpdateTaskStatusPayload>(
    '/api/tasks/:id',
    async ({ params, request }) => {
      const { id } = params
      const { completed } = await request.json()
      const taskIndex = tasks.getValue().findIndex((task) => task.id === Number(id))
      // await delay(500)
      if (taskIndex !== -1) {
        tasks.update((data) => {
          data[taskIndex].completed = completed
          return data
        })
        return HttpResponse.json(tasks.getValue()[taskIndex])
      } else {
        return HttpResponse.json({ message: 'Task not found' }, { status: 404 })
      }
    }
  ),

  http.delete<{ id: string }>('/api/tasks/:id', async ({ params }) => {
    const { id } = params
    const taskIndex = tasks.getValue().findIndex((task) => task.id === Number(id))
    // await delay(500)
    if (taskIndex !== -1) {
      tasks.update((data) => {
        data.splice(taskIndex, 1)
        return data
      })
      return HttpResponse.json({ message: `Task with id ${id} deleted successfully` })
    } else {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 })
    }
  })
]
