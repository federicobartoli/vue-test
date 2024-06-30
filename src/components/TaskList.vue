<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { useTasks } from '@/composables/useTasks'
import 'vue3-toastify/dist/index.css'
// Components
import SkeletonList from './UI/SkeletonList.vue'
import TaskItem from './UI/TaskItem.vue'
import Modal from './UI/ModalItem.vue'
import TaskFilter from './TaskFilter.vue'
// types
import type { Ref } from 'vue'
import type { Task } from '@/types/tasks'

const {
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
} = useTasks()

const selectedTask: Ref<Task | null> = ref(null)
const isModalOpen = ref(false)

const openModal = (task: Task) => {
  selectedTask.value = { ...task }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedTask.value = null
}
const handleStatusChangeAndCloseModal = (taskId: number, newStatus: boolean) => {
  handleTaskStatusChange(taskId, newStatus)
  closeModal()
}

const selectedTaskCompletedString = computed(() => {
  return selectedTask.value?.completed ? 'Completato' : 'Non completato'
})

const buttonTextCompleted = computed(() => {
  return selectedTask.value?.completed ? 'Non completato' : 'Completato'
})

const filteredTasks: Ref<Task[]> = ref([])

watch(
  tasks,
  (newTasks: Task[] | undefined) => {
    filteredTasks.value = newTasks || []
  },
  { immediate: true }
)

const handleFilterChange = (filtered: Task[]) => {
  filteredTasks.value = filtered
}
</script>

<template>
  <div class="task-list">
    <TaskFilter :tasks="tasks || []" @filter="handleFilterChange" />
    <SkeletonList v-if="isLoading || isPending" :count="3" />
    <div v-else-if="isError" class="task-list__error">Errore: {{ error?.message }}</div>
    <div v-else-if="tasks?.length === 0" class="task-list__empty">Nessun task presente</div>
    <ul v-else class="task-list__list">
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        :onStatusChange="handleTaskStatusChange"
        :onDelete="handleDeleteTask"
      >
        <template #default="{ task }">
          <div @click="openModal(task)" class="task__open-modal">
            <h3 class="task-list__title">{{ task.title }}</h3>
            <p class="task-list__description">{{ task.description }}</p>
          </div>
        </template>
      </TaskItem>
    </ul>
    <div class="task-list__add-task">
      <input
        v-model="newTaskTitle"
        placeholder="Titolo del nuovo task"
        :disabled="isAddingTask"
        class="task-list__input"
      />
      <input
        v-model="newTaskDescription"
        placeholder="Descrizione del nuovo task"
        :disabled="isAddingTask"
        class="task-list__input"
      />
      <button @click="addTask" :disabled="isAddingTask" class="btn">
        {{ isAddingTask ? 'Aggiungendo...' : 'Aggiungi' }}
      </button>
    </div>
    <Modal :isOpen="isModalOpen" @close="closeModal">
      <template #header>
        <h2>Dettagli Task</h2>
      </template>
      <template #default>
        <p><strong>Titolo:</strong> {{ selectedTask?.title }}</p>
        <p><strong>Descrizione:</strong> {{ selectedTask?.description }}</p>
        <p><strong>Stato:</strong> {{ selectedTaskCompletedString }}</p>
      </template>
      <template #footer>
        <button @click="closeModal" class="btn">Chiudi</button>
        <button
          v-if="selectedTask"
          @click="handleStatusChangeAndCloseModal(selectedTask.id!, !selectedTask.completed)"
          class="btn"
        >
          Segna come {{ buttonTextCompleted }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.task-list {
  background-color: var(--color-background-app);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  min-height: 450px;
  padding: 16px;
}

.task-list__list {
  height: 230px;
  list-style-type: none;
  margin: 0;
  overflow: scroll;
  padding: 0;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.task-list__list::-webkit-scrollbar {
  display: none;
}

.completed .task-list__title,
.completed .task-list__description {
  color: #888;
  text-decoration: line-through;
}

.task-list__error,
.task-list__empty {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  padding: 16px;
  text-align: center;
}

.task-list__error {
  color: #ff4d4f;
}

.task-list__empty {
  color: #666;
}

.task-list__add-task {
  display: flex;
  flex-direction: column;
  margin-top: auto;
}

.task-list__input {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 8px;
}

.task__open-modal {
  cursor: pointer;
  border-radius: 4px;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.task__open-modal:hover {
  background-color: var(--task-hover-bg);
  box-shadow: var(--task-hover-shadow);
}
</style>
