<script setup lang="ts">
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
// Types
import type { PropType } from 'vue'
import type { Task } from '@/types/tasks'

const props = defineProps({
  tasks: {
    type: Array as PropType<Task[]>,
    required: true,
    default: () => []
  }
})

const emit = defineEmits<{
  (e: 'filter', filteredTasks: Task[]): void
}>()

const filterStatus = ref('all')
const searchQuery = ref('')
const sortBy = ref('')

const fuse = computed(
  () =>
    new Fuse(props.tasks, {
      keys: ['title', 'description'],
      threshold: 0.4
    })
)

const filteredAndSortedTasks = computed(() => {
  let result = [...props.tasks]

  // Filter by status
  if (filterStatus.value !== 'all') {
    result = result.filter((task) =>
      filterStatus.value === 'completed' ? task.completed : !task.completed
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    result = fuse.value.search(searchQuery.value).map((res) => res.item)
  }

  // Sort tasks
  if (!sortBy.value) {
    return result
  } else if (sortBy.value === 'name') {
    return result.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    return result.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
  }
})

const applyFilter = () => {
  emit('filter', filteredAndSortedTasks.value)
}
</script>

<template>
  <div class="task-filter" :data-filtered-tasks="JSON.stringify(filteredAndSortedTasks)">
    <div class="filter-group">
      <label for="filter-status">Stato:</label>
      <select id="filter-status" v-model="filterStatus" @change="applyFilter">
        <option value="all">Tutti</option>
        <option value="completed">Completati</option>
        <option value="active">Non completati</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="search-query">Cerca:</label>
      <input
        id="search-query"
        v-model="searchQuery"
        @input="applyFilter"
        placeholder="Cerca nei task..."
      />
    </div>

    <div class="filter-group">
      <label for="sort-by">Ordina per:</label>
      <select id="sort-by" v-model="sortBy" @change="applyFilter">
        <option value="">Nessuno</option>
        <option value="name">Nome</option>
        <option value="status">Stato</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.task-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}
</style>
