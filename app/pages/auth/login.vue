<!-- pages/auth/login.vue -->
<script setup lang="ts">
import type { UserRole } from '~/types'

definePageMeta({
  layout: 'auth',
  middleware: 'auth'
})

const { rolePasswords, loginWithPassword } = useAuth()
const { students } = useScore()
const router = useRouter()

const passwordInput = ref('')
const selectedStudentId = ref('STU-001')
const showStudentIdField = ref(false)
const showPasswordGuide = ref(true)

const isLoading = ref(false)
const errorMessage = ref('')
const successRoleMessage = ref<string | null>(null)

// Quick fill for testing
const quickFillPassword = (role: UserRole) => {
  errorMessage.value = ''
  if (role === 'admin') {
    passwordInput.value = rolePasswords.value.admin
    showStudentIdField.value = false
  } else if (role === 'teacher') {
    passwordInput.value = rolePasswords.value.teacher
    showStudentIdField.value = false
  } else {
    passwordInput.value = rolePasswords.value.student
    showStudentIdField.value = true
  }
}

const handleSmartLogin = () => {
  errorMessage.value = ''
  successRoleMessage.value = null

  if (!passwordInput.value.trim()) {
    errorMessage.value = 'សូមបញ្ចូលលេខសម្ងាត់ (Please enter a password)'
    return
  }

  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
    const stu = students.value.find((s) => s.id === selectedStudentId.value)
    const result = loginWithPassword(
      passwordInput.value,
      selectedStudentId.value,
      stu ? stu.name : undefined
    )

    if (result.success && result.redirect) {
      successRoleMessage.value = `ស្គាល់តួនាទីជា៖ ${result.role?.toUpperCase()}! កំពុងបញ្ជូនទៅកាន់ទំព័រ...`
      setTimeout(() => {
        router.push(result.redirect!)
      }, 350)
    } else {
      errorMessage.value = result.message || 'លេខសម្ងាត់មិនត្រឹមត្រូវ!'
    }
  }, 300)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header title -->
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 text-2xl mb-2">
        🔑
      </div>
      <h2 class="text-xl font-extrabold text-slate-800">ផ្ទៀងផ្ទាត់លេខសម្ងាត់ (Smart Login)</h2>
      <p class="text-xs text-slate-500 mt-1">
        បញ្ចូលលេខសម្ងាត់របស់អ្នក ប្រព័ន្ធនឹងបញ្ជូនទៅកាន់ផ្នែកផ្ទាល់ខ្លួនដោយស្វ័យប្រវត្តិ
      </p>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMessage" class="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
      <span>⚠️</span>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Success Role Identified Alert -->
    <div v-if="successRoleMessage" class="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 font-semibold animate-pulse">
      <span>✅</span>
      <span>{{ successRoleMessage }}</span>
    </div>

    <!-- Smart Password Form -->
    <form class="space-y-4" @submit.prevent="handleSmartLogin">
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
          <span>លេខសម្ងាត់ប្រព័ន្ធ (Password / Access Key) *</span>
          <span class="text-[10px] text-slate-400 font-normal">សម្គាល់ Role ដោយស្វ័យប្រវត្តិ</span>
        </label>
        <div class="relative">
          <input
            v-model="passwordInput"
            type="password"
            required
            autofocus
            placeholder="បញ្ចូល password (ឧ. admin123, teacher123, student123)"
            class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono tracking-wider transition bg-slate-50 focus:bg-white"
          />
          <svg class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      <!-- Optional Student ID selector if logging in as student -->
      <div class="pt-1">
        <button
          type="button"
          @click="showStudentIdField = !showStudentIdField"
          class="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>{{ showStudentIdField ? '▼' : '▶' }} ជ្រើសរើសអត្តលេខសិស្សជាក់លាក់ (Optional for Student)</span>
        </button>

        <div v-if="showStudentIdField" class="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
          <label class="block text-[11px] font-semibold text-slate-600">អត្តលេខសិស្ស (Student ID):</label>
          <select
            v-model="selectedStudentId"
            class="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option v-for="s in students" :key="s.id" :value="s.id">
              {{ s.id }} - {{ s.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-200 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span v-if="isLoading">កំពុងផ្ទៀងផ្ទាត់...</span>
        <span v-else class="flex items-center gap-2">
          <span>ចូលប្រព័ន្ធ (Direct Sign In)</span>
          <span>→</span>
        </span>
      </button>
    </form>

    <!-- Quick 1-Click Role Testing Badges -->
    <div class="pt-4 border-t border-slate-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">សាកល្បងចុចបំពេញ Password ភ្លាមៗ:</span>
        <button
          type="button"
          @click="showPasswordGuide = !showPasswordGuide"
          class="text-[10px] text-indigo-600 font-semibold"
        >
          {{ showPasswordGuide ? 'លាក់' : 'បង្ហាញ' }}
        </button>
      </div>

      <div v-if="showPasswordGuide" class="grid grid-cols-3 gap-2">
        <button
          type="button"
          @click="quickFillPassword('admin')"
          class="p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl border border-purple-200 text-center transition cursor-pointer"
        >
          <div class="text-xs font-extrabold">⚙️ Admin</div>
          <div class="text-[10px] font-mono mt-0.5 text-purple-600">{{ rolePasswords.admin }}</div>
        </button>

        <button
          type="button"
          @click="quickFillPassword('teacher')"
          class="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 text-center transition cursor-pointer"
        >
          <div class="text-xs font-extrabold">📝 Teacher</div>
          <div class="text-[10px] font-mono mt-0.5 text-indigo-600">{{ rolePasswords.teacher }}</div>
        </button>

        <button
          type="button"
          @click="quickFillPassword('student')"
          class="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 text-center transition cursor-pointer"
        >
          <div class="text-xs font-extrabold">🎓 Student</div>
          <div class="text-[10px] font-mono mt-0.5 text-blue-600">{{ rolePasswords.student }}</div>
        </button>
      </div>
    </div>
  </div>
</template>