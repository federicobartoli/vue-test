import { test, expect } from '@playwright/test'

test.describe('TaskList', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display task list', async ({ page }) => {
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
    await page.click('.task-list ul li:first-child')
    await page.click('.modal-content button:has-text("Segna come non completato")')
    await expect(page.locator('.modal-content')).toBeHidden()
    await expect(page.locator('.task-list ul li:first-child')).not.toHaveClass(/completed/)
  })
})
