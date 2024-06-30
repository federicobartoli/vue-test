import { test, expect } from '@playwright/test'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const mockTasks = [
  { id: 1, title: 'Mock Task 1', description: 'Description 1', completed: false },
  { id: 2, title: 'Mock Task 2', description: 'Description 2', completed: true },
  { id: 3, title: 'Mock Task 3', description: 'Description 3', completed: false }
]

const server = setupServer(
  http.get('/api/tasks', () => {
    return HttpResponse.json(mockTasks)
  }),
  http.post('/api/tasks', () => {
    return HttpResponse.json({ message: 'Task added successfully' }, { status: 201 })
  }),
  http.put('/api/tasks/:id', ({ params }) => {
    const id = Number(params.id)
    const task = mockTasks.find((t) => t.id === id)
    if (task) {
      task.completed = !task.completed
      return HttpResponse.json(task)
    }
    return HttpResponse.json({ message: 'Task not found' }, { status: 404 })
  })
)

test.describe('TaskFilter Component', () => {
  test.beforeAll(() => {
    server.listen({ onUnhandledRequest: 'bypass' })
  })
  test.afterAll(() => {
    server.close()
  })
  test.afterEach(() => server.resetHandlers())

  test.beforeEach(async ({ page }) => {
    await page.route('/api/tasks', async (route) => {
      await route.fulfill({ json: mockTasks })
    })
    await page.goto('/')

    await expect(page.locator('.task-list ul')).toBeVisible()
  })

  test('should add a new task', async ({ page }) => {
    const newTaskTitle = 'Nuovo Task E2E'
    const newTaskDescription = 'Descrizione del nuovo task E2E'

    await page.fill('input[placeholder="Titolo del nuovo task"]', newTaskTitle)
    await page.fill('input[placeholder="Descrizione del nuovo task"]', newTaskDescription)
    await page.click('button:has-text("Aggiungi")')

    await expect(page.locator('.task-list ul li:first-child h3')).toHaveText(newTaskTitle)
    await expect(page.locator('.task-list ul li:first-child p')).toHaveText(newTaskDescription)
  })

  test('should mark a task as completed', async ({ page }) => {
    await page.locator('ul li:first-child').getByRole('checkbox').check()
    await expect(page.locator('.task-list ul li:first-child')).toHaveClass(/completed/)
  })
  test('should open modal when clicking on a task', async ({ page }) => {
    await page.click('.task-list ul li:first-child')
    await expect(page.locator('.modal-content')).toBeVisible()
    await expect(page.locator('.modal-content h2')).toHaveText('Dettagli Task')
  })

  test('should close modal when clicking close button', async ({ page }) => {
    await page.click('.task-list ul li:first-child')
    await page.click('.modal-content button:has-text("Chiudi")')
    await expect(page.locator('.modal-content')).toBeHidden()
  })

  test('should change task status from modal', async ({ page }) => {
    await expect(page.locator('.task-list ul li:first-child')).not.toHaveClass(/completed/)

    await page.click('.task-list ul li:first-child')
    await page.click('.modal-content button:has-text("Segna come completato")')

    await page.waitForResponse(
      (response) => response.url().includes('/api/tasks/') && response.request().method() === 'PUT'
    )

    await expect(page.locator('.modal-content')).toBeHidden()
    await expect(page.locator('.task-list ul li:first-child')).toHaveClass(/completed/)
  })

  test('should filter tasks by status', async ({ page }) => {
    await page.selectOption('#filter-status', 'completed')
    await expect(page.locator('.task-list ul li')).toHaveCount(1)
    await expect(page.locator('.task-list ul li')).toHaveClass(/completed/)

    await page.selectOption('#filter-status', 'active')
    await expect(page.locator('.task-list ul li')).toHaveCount(2)
    await expect(page.locator('.task-list ul li.completed')).toHaveCount(0)
  })

  test('should filter tasks by search query', async ({ page }) => {
    await page.fill('#search-query', 'Task 3')
    await expect(page.locator('.task-list ul li')).toHaveCount(3)
    await expect(page.locator('.task-list ul li:first-child h3')).toHaveText('Mock Task 3')

    await page.fill('#search-query', 'nonexistent12345')
    await expect(page.locator('.task-list ul li')).toHaveCount(0)

    await page.fill('#search-query', 'Task')
    const taskTitles = await page.locator('.task-list ul li h3').allInnerTexts()
    expect(taskTitles).toEqual(['Mock Task 1', 'Mock Task 2', 'Mock Task 3'])
  })

  test('should sort tasks by name', async ({ page }) => {
    await page.selectOption('#sort-by', 'name')
    const taskTitles = await page.locator('.task-list ul li h3').allInnerTexts()
    expect(taskTitles).toEqual(['Mock Task 1', 'Mock Task 2', 'Mock Task 3'])
  })

  test('should sort tasks by status', async ({ page }) => {
    await page.selectOption('#sort-by', 'status')
    const taskStatuses = await page
      .locator('.task-list ul li')
      .evaluateAll((elements) => elements.map((el) => el.classList.contains('completed')))
    expect(taskStatuses).toEqual([false, false, true])
  })
})
