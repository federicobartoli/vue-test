<script setup lang="ts"></script>

<template>
  <div class="skeleton-item">
    <div class="skeleton-checkbox"></div>
    <div class="skeleton-content">
      <div class="skeleton-title"></div>
      <div class="skeleton-description"></div>
    </div>
    <div class="skeleton-button"></div>
  </div>
</template>

<style scoped>
.skeleton-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  animation: skeleton-loading 1s linear infinite alternate;
  padding: 12px;
}

.skeleton-checkbox {
  width: 20px;
  height: 20px;
  background-color: #e0e0e0;
  margin-right: 10px;
}

.skeleton-content {
  flex-grow: 1;
}

.skeleton-title {
  height: 20px;
  background-color: #e0e0e0;
  margin-bottom: 5px;
  width: 70%;
}

.skeleton-description {
  height: 15px;
  background-color: #e0e0e0;
  width: 90%;
}

.skeleton-button {
  width: 60px;
  height: 30px;
  background-color: #e0e0e0;
}

@keyframes skeleton-loading {
  0% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
