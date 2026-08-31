<!-- pages/admin.vue -->
<script setup lang="ts">
import Admin from '~/components/Admin.vue'

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    <Admin />
  </div>
</template>