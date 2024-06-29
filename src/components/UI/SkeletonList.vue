<script setup lang="ts">
import SkeletonItem from './SkeletonItem.vue'

interface Props {
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 8
})
</script>

<template>
  <div class="skeleton-list">
    <SkeletonItem v-for="n in props.count" :key="n" />
  </div>
</template>
