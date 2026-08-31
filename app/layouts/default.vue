<!-- layouts/default.vue -->
<script setup lang="ts">
import Navbar from '~/components/Navbar.vue'

const { classInfo } = useScore()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <!-- Main Top Navigation -->
    <Navbar />

    <!-- Page Main Content Area -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Global Footer -->
    <footer class="no-print border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{{ classInfo.className }} • {{ classInfo.academicYear }}</span>
        </div>
        <div>
          ប្រព័ន្ធគ្រប់គ្រងពិន្ទុថ្នាក់រៀន (Single Class Management System) © {{ new Date().getFullYear() }}
        </div>
        <div class="text-slate-400">
          Nuxt 3 • TypeScript • Tailwind CSS
        </div>
      </div>
    </footer>
  </div>
</template>