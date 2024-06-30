<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { Ref } from 'vue'
import { useTasks } from '@/composables/useTasks'
import 'vue3-toastify/dist/index.css'
// Components
import SkeletonList from './UI/SkeletonList.vue'
import TaskItem from './UI/TaskItem.vue'
import Modal from './UI/ModalItem.vue'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
}

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
</script>

<template>
  <div class="task-list">
    <SkeletonList v-if="isLoading || isPending" :count="3" />
    <div v-else-if="isError" class="task-list__error">Errore: {{ error?.message }}</div>
    <div v-else-if="tasks?.length === 0" class="task-list__empty">Nessun task presente</div>
    <ul v-else class="task-list__list">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :onStatusChange="handleTaskStatusChange"
        :onDelete="handleDeleteTask"
      >
        <template #default="{ task }">
          <div @click="openModal(task)">
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
          Segna come {{ selectedTaskCompletedString }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.task-list {
  min-height: 450px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.task-list__list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 300px;
  overflow: scroll;
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.task-list__list::-webkit-scrollbar {
  display: none;
}

.completed .task-list__title,
.completed .task-list__description {
  text-decoration: line-through;
  color: #888;
}

.task-list__error,
.task-list__empty {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: #ff4d4f;
  text-align: center;
}

.task-list__empty {
  color: #666;
}

.task-list__add-task {
  margin-top: auto;
  display: flex;
  flex-direction: column;
}

.task-list__input {
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
</style>
