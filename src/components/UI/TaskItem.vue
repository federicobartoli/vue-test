<script setup lang="ts">
defineProps<{
  task: { id: number; title: string; description: string; completed: boolean }
  onStatusChange: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
}>()
</script>

<template>
  <li class="task-list__item" :class="{ completed: task.completed }">
    <input
      type="checkbox"
      :checked="task.completed"
      @change="(event) => onStatusChange(task.id, (event.target as HTMLInputElement).checked)"
      class="task-list__checkbox"
    />
    <div class="task-list__content">
      <slot :task="task">
        <h3 class="task-list__title">{{ task.title }}</h3>
        <p class="task-list__description">{{ task.description }}</p>
      </slot>
    </div>
    <button @click="onDelete(task.id)" class="task-list__delete-btn">Elimina</button>
  </li>
</template>
<style scoped>
.task-list__item {
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 12px;
  background-color: #ffffff;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
.task-list__checkbox {
  margin-right: 12px;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
:deep(.task-list__title) {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

:deep(.task-list__description) {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.task-list__delete-btn {
  padding: 6px 12px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.task-list__delete-btn:hover {
  background-color: #ff7875;
}

:deep(.task-list__content) h3,
:deep(.task-list__content) p {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.task-list__content {
  flex-grow: 1;
  margin-right: 12px;
}
</style>
