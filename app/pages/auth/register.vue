<!-- pages/auth/register.vue -->
<script setup lang="ts">
import type { UserRole } from '~/types'

definePageMeta({
  layout: 'auth',
  middleware: 'auth'
})

const { setRole } = useAuth()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'teacher' as UserRole
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleRegister = () => {
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'លេខសម្ងាត់ទាំងពីរមិនដូចគ្នាទេ!'
    return
  }

  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    setRole(form.role, 'STU-NEW', form.name)
    if (form.role === 'admin') router.push('/admin')
    else if (form.role === 'teacher') router.push('/gradebook')
    else router.push('/student')
  }, 400)
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-xl font-bold text-slate-800">ចុះឈ្មោះគណនីថ្មី (Register)</h2>
      <p class="text-xs text-slate-500 mt-1">បង្កើតគណនីដើម្បីចូលរួមប្រើប្រាស់ប្រព័ន្ធ</p>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMessage" class="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
      {{ errorMessage }}
    </div>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">គោត្តនាម និង នាម *</label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="ឧ. ហេង វីរៈ"
          class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">អ៊ីមែល ឬ អត្តលេខ *</label>
        <input
          v-model="form.email"
          type="text"
          required
          placeholder="name@school.edu"
          class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">តួនាទី (Role)</label>
        <select
          v-model="form.role"
          class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="student">សិស្ស (Student)</option>
          <option value="teacher">គ្រូបង្រៀន (Teacher)</option>
          <option value="admin">រដ្ឋបាល (Admin)</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">លេខសម្ងាត់ *</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">បញ្ជាក់លេខសម្ងាត់ *</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-200 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span v-if="isLoading">កំពុងបង្កើតគណនី...</span>
        <span v-else>ចុះឈ្មោះ (Sign Up)</span>
      </button>
    </form>

    <div class="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
      មានគណនីរួចហើយ?
      <NuxtLink to="/auth/login" class="text-indigo-600 font-semibold hover:underline">
        ចូលប្រព័ន្ធនៅទីនេះ
      </NuxtLink>
    </div>
  </div>
</template>