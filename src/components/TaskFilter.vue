<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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

  if (filterStatus.value !== 'all') {
    result = result.filter((task) =>
      filterStatus.value === 'completed' ? task.completed : !task.completed
    )
  }

  if (searchQuery.value) {
    result = fuse.value.search(searchQuery.value).map((res) => res.item)
  }

  if (sortBy.value === 'name') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'status') {
    result.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
  }

  return result
})

watch(
  filteredAndSortedTasks,
  (newTasks) => {
    emit('filter', newTasks)
  },
  { immediate: true }
)

watch(props.tasks, () => {
  // Reset filters when tasks change
  filterStatus.value = 'all'
  searchQuery.value = ''
  sortBy.value = ''
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
