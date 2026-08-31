<!-- app.vue -->
<script setup lang="ts">
const { initAuth } = useAuth()
const { fetchInitialData } = useScore()

onMounted(() => {
  initAuth()
  fetchInitialData()
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
