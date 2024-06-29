<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="emit('close')">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <slot name="header">
              <h2>Header di default</h2>
            </slot>
            <button class="modal-close" @click="emit('close')">&times;</button>
          </div>
          <div class="modal-body">
            <slot>Contenuto di default</slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-button" @click="emit('close')">Chiudi</button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
  flex-grow: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: flex-end;
}

.modal-button {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-button:hover {
  background-color: #2980b9;
}

.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
