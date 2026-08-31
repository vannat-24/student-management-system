<!-- pages/student.vue -->
<script setup lang="ts">
import Student from '~/components/Student.vue'

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    <Student />
  </div>
</template>