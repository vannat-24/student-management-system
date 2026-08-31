<!-- layouts/auth.vue -->
<template>
  <div class="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Ambient glowing backdrop -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <!-- School Logo & Branding -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white text-3xl font-black shadow-lg shadow-indigo-500/30 mb-3">
          🎓
        </div>
        <h1 class="text-2xl font-black text-white tracking-tight">
          Single Class Management System
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          ប្រព័ន្ធគ្រប់គ្រងពិន្ទុ និងវត្តមានសិស្សប្រចាំថ្នាក់
        </p>
      </div>

      <!-- Auth Card Container -->
      <div class="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100 relative">
        <slot />
      </div>

      <!-- Footer navigation -->
      <div class="text-center mt-6 text-xs text-slate-400">
        <NuxtLink to="/" class="hover:text-white transition">
          ← ត្រឡប់ទៅកាន់ទំព័រដើម (Back to Home)
        </NuxtLink>
      </div>
    </div>
  </div>
</template>