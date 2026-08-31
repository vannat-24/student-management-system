<!-- pages/gradebook.vue -->
<script setup lang="ts">
import Teacher from '~/components/Teacher.vue'

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    <Teacher />
  </div>
</template>