import type { Task } from '@/types/tasks'

const API_URL = '/api/tasks'

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const createTask = async (title: string, description: string): Promise<Task> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, description })
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const deleteTask = async (id: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const changeTaskStatus = async (id: number, completed: boolean): Promise<Task> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed })
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}
