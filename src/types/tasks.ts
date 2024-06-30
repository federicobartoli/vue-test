export type Task = {
  id: number
  title: string
  description: string
  completed: boolean
}

export type CreateTaskPayload = {
  title: string
  description: string
}

export type UpdateTaskStatusPayload = {
  id: number
  completed: boolean
}

export type NewTask = {
  title: string
  description: string
}
