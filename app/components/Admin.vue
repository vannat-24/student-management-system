<!-- components/Admin.vue -->
<script setup lang="ts">
import type { RawStudent } from '~/types'

const {
  classInfo,
  students,
  computedStudents,
  classStats,
  isLocked,
  addStudent,
  removeStudent,
  toggleLock,
  updateClassInfo,
  resetToDefault
} = useScore()

const { rolePasswords, updateRolePasswords } = useAuth()

// Modals and state
const showAddModal = ref(false)
const showEditClassModal = ref(false)
const showPasswordModal = ref(false)
const showResetConfirmModal = ref(false)
const deleteTargetId = ref<string | null>(null)
const passwordSaveToast = ref(false)

// Form for adding new student
const newStudentForm = reactive({
  name: '',
  gender: 'M' as 'M' | 'F',
  dob: '2008-01-01',
  remarks: '',
  scores: {
    math: 75,
    physics: 75,
    chemistry: 75,
    biology: 75,
    khmer: 75,
    english: 75
  }
})

// Form for editing class metadata
const classForm = reactive({
  className: '',
  academicYear: '',
  homeroomTeacher: '',
  month: ''
})

// Form for managing role passwords
const passwordForm = reactive({
  admin: '',
  teacher: '',
  student: ''
})

const openEditClassModal = () => {
  classForm.className = classInfo.value.className
  classForm.academicYear = classInfo.value.academicYear
  classForm.homeroomTeacher = classInfo.value.homeroomTeacher
  classForm.month = classInfo.value.month
  showEditClassModal.value = true
}

const openPasswordModal = () => {
  passwordForm.admin = rolePasswords.value.admin
  passwordForm.teacher = rolePasswords.value.teacher
  passwordForm.student = rolePasswords.value.student
  showPasswordModal.value = true
}

const handleSavePasswords = () => {
  updateRolePasswords({
    admin: passwordForm.admin.trim(),
    teacher: passwordForm.teacher.trim(),
    student: passwordForm.student.trim()
  })
  showPasswordModal.value = false
  passwordSaveToast.value = true
  setTimeout(() => {
    passwordSaveToast.value = false
  }, 3000)
}

const handleSaveClassInfo = () => {
  updateClassInfo(classForm)
  showEditClassModal.value = false
}

const handleToggleLock = () => {
  toggleLock()
}

const handleAddStudent = () => {
  if (!newStudentForm.name.trim()) return

  addStudent({
    name: newStudentForm.name.trim(),
    gender: newStudentForm.gender,
    dob: newStudentForm.dob,
    remarks: newStudentForm.remarks.trim() || 'សិស្សទើបចូលថ្មី',
    scores: { ...newStudentForm.scores }
  })

  // Reset form
  newStudentForm.name = ''
  newStudentForm.remarks = ''
  showAddModal.value = false
}

const confirmDeleteStudent = (id: string) => {
  deleteTargetId.value = id
}

const executeDeleteStudent = () => {
  if (deleteTargetId.value) {
    removeStudent(deleteTargetId.value)
    deleteTargetId.value = null
  }
}

const handleResetAll = async () => {
  await resetToDefault()
  showResetConfirmModal.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Admin Header & Control Center -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">
            ⚙️
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-800">ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល (Admin Center)</h1>
            <p class="text-xs text-slate-500 mt-0.5">
              គ្រប់គ្រងបញ្ជីឈ្មោះសិស្ស ការចាក់សោពិន្ទុ លេខសម្ងាត់ និងព័ត៌មានទូទៅនៃថ្នាក់
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Manage Passwords Button -->
          <button
            @click="openPasswordModal"
            type="button"
            class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🔑 កំណត់ Password តួនាទី</span>
          </button>

          <!-- Class Lock Toggle Button -->
          <button
            @click="handleToggleLock"
            type="button"
            :class="[
              'px-4 py-2 text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer',
              isLocked
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
            ]"
          >
            <span>{{ isLocked ? '🔒 ដោះសោពិន្ទុ (Unlock)' : '🔓 ចាក់សោពិន្ទុ (Lock Gradebook)' }}</span>
          </button>

          <!-- Add Student Button -->
          <button
            @click="showAddModal = true"
            type="button"
            class="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 transition flex items-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>បន្ថែមសិស្សថ្មី (Add Student)</span>
          </button>
        </div>
      </div>

      <!-- System Role Passwords Banner Card -->
      <div class="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">
            🔐
          </div>
          <div>
            <div class="text-xs font-bold">លេខសម្ងាត់សម្រាប់ចូលប្រើ (Active Role Passwords)</div>
            <div class="text-[11px] text-slate-300">អ្នកប្រើប្រាស់គ្រាន់តែវាយ password នេះដើម្បីចូលផ្នែកផ្ទាល់ខ្លួនភ្លាមៗ</div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-xs">
          <div class="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
            <span class="text-purple-300 font-semibold">Admin:</span>
            <span class="font-mono font-bold">{{ rolePasswords.admin }}</span>
          </div>

          <div class="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
            <span class="text-indigo-300 font-semibold">Teacher:</span>
            <span class="font-mono font-bold">{{ rolePasswords.teacher }}</span>
          </div>

          <div class="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
            <span class="text-blue-300 font-semibold">Student:</span>
            <span class="font-mono font-bold">{{ rolePasswords.student }}</span>
          </div>

          <button
            @click="openPasswordModal"
            class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold transition text-[11px] cursor-pointer"
          >
            កែប្រែ
          </button>
        </div>
      </div>

      <!-- Quick Class Metadata Display -->
      <div class="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-600">
          <div>ថ្នាក់រៀន: <strong class="text-slate-800">{{ classInfo.className }}</strong></div>
          <div>ឆ្នាំសិក្សា: <strong class="text-slate-800">{{ classInfo.academicYear }}</strong></div>
          <div>ខែ: <strong class="text-slate-800">{{ classInfo.month }}</strong></div>
          <div>គ្រូបន្ទុកថ្នាក់: <strong class="text-slate-800">{{ classInfo.homeroomTeacher }}</strong></div>
          <div>
            ស្ថានភាព:
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full font-bold text-[11px]',
                isLocked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              ]"
            >
              {{ isLocked ? 'ចាក់សោ (Locked)' : 'បើកកែប្រែ (Unlocked)' }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="openEditClassModal"
            class="px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 font-semibold rounded-lg transition cursor-pointer"
          >
            ✏️ កែប្រែព័ត៌មានថ្នាក់
          </button>
          <button
            @click="showResetConfirmModal = true"
            class="px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
          >
            🔄 កំណត់ឡើងវិញ (Reset)
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="text-xs text-slate-500">ចំនួនសិស្សសរុប (Total Students)</div>
        <div class="text-2xl font-extrabold text-slate-800 mt-1 font-mono">
          {{ classStats.totalStudents }} <span class="text-xs font-normal text-slate-400">នាក់</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="text-xs text-slate-500">មធ្យមភាគថ្នាក់ (Class Average)</div>
        <div class="text-2xl font-extrabold text-indigo-600 mt-1 font-mono">
          {{ classStats.classAverage }} <span class="text-xs font-normal text-slate-400">/ 100</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="text-xs text-slate-500">អត្រាជាប់ (Pass Rate)</div>
        <div class="text-2xl font-extrabold text-emerald-600 mt-1 font-mono">
          {{ classStats.passRate }}%
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="text-xs text-slate-500">ពិន្ទុខ្ពស់បំផុត (Highest Avg)</div>
        <div class="text-2xl font-extrabold text-amber-500 mt-1 font-mono">
          {{ classStats.highestScore }}
        </div>
      </div>
    </div>

    <!-- Student Roster Management Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-800">បញ្ជីរាយនាមសិស្ស (Class Roster)</h2>
          <p class="text-xs text-slate-400 mt-0.5">គ្រប់គ្រង និងកែសម្រួលព័ត៌មានផ្ទាល់ខ្លួនរបស់សិស្សក្នុងថ្នាក់</p>
        </div>
        <span class="text-xs text-slate-500 font-medium">សរុប {{ computedStudents.length }} នាក់</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <th class="py-3.5 px-4 font-bold text-center w-14">#</th>
              <th class="py-3.5 px-4 font-bold">អត្តលេខ & ឈ្មោះសិស្ស</th>
              <th class="py-3.5 px-3 font-bold text-center">ភេទ</th>
              <th class="py-3.5 px-3 font-bold text-center">ថ្ងៃខែឆ្នាំកំណើត</th>
              <th class="py-3.5 px-3 font-bold text-center">មធ្យមភាគ</th>
              <th class="py-3.5 px-3 font-bold text-center">និទ្ទេស</th>
              <th class="py-3.5 px-3 font-bold text-center">ចំណាត់ថ្នាក់</th>
              <th class="py-3.5 px-4 font-bold text-right">សកម្មភាព (Actions)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr
              v-for="(student, index) in computedStudents"
              :key="student.id"
              class="hover:bg-slate-50 transition"
            >
              <td class="py-3.5 px-4 text-center font-mono text-slate-400">
                {{ index + 1 }}
              </td>

              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white',
                      student.gender === 'F' ? 'bg-pink-500' : 'bg-blue-600'
                    ]"
                  >
                    {{ student.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-800">{{ student.name }}</div>
                    <div class="text-[11px] font-mono text-slate-400">{{ student.id }}</div>
                  </div>
                </div>
              </td>

              <td class="py-3.5 px-3 text-center">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[11px] font-semibold',
                    student.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                  ]"
                >
                  {{ student.gender === 'F' ? 'ស្រី (F)' : 'ប្រុស (M)' }}
                </span>
              </td>

              <td class="py-3.5 px-3 text-center text-slate-600 font-mono">
                {{ student.dob }}
              </td>

              <td class="py-3.5 px-3 text-center font-mono font-bold text-indigo-600">
                {{ student.average.toFixed(2) }}
              </td>

              <td class="py-3.5 px-3 text-center">
                <span
                  :class="[
                    'px-2 py-0.5 rounded font-extrabold text-[11px] border',
                    student.grade === 'A' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                    student.grade === 'B' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                    student.grade === 'C' ? 'bg-cyan-100 text-cyan-700 border-cyan-300' :
                    student.grade === 'D' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                    student.grade === 'E' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                    'bg-rose-100 text-rose-700 border-rose-300'
                  ]"
                >
                  {{ student.grade }}
                </span>
              </td>

              <td class="py-3.5 px-3 text-center font-bold text-amber-600">
                #{{ student.rank }}
              </td>

              <td class="py-3.5 px-4 text-right">
                <button
                  @click="confirmDeleteStudent(student.id)"
                  type="button"
                  class="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition font-medium cursor-pointer"
                >
                  លុប (Delete)
                </button>
              </td>
            </tr>

            <tr v-if="computedStudents.length === 0">
              <td colspan="8" class="py-8 text-center text-slate-400">
                មិនទាន់មានសិស្សក្នុងថ្នាក់នៅឡើយទេ។ សូមចុច "បន្ថែមសិស្សថ្មី"។
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: Manage Role Passwords -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">🔐</span>
            <h3 class="text-base font-bold text-slate-800">កំណត់លេខសម្ងាត់សម្រាប់ Role នីមួយៗ</h3>
          </div>
          <button @click="showPasswordModal = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <p class="text-xs text-slate-500">
          អ្នកប្រើប្រាស់អាចវាយ password ទាំងនេះលើផ្ទាំង Login ដើម្បីចូលទៅកាន់ Module រៀងៗខ្លួនដោយស្វ័យប្រវត្តិ។
        </p>

        <form class="space-y-4" @submit.prevent="handleSavePasswords">
          <div>
            <label class="block text-xs font-bold text-purple-700 mb-1 flex items-center gap-1.5">
              <span>⚙️ លេខសម្ងាត់ Admin Password:</span>
            </label>
            <input
              v-model="passwordForm.admin"
              type="text"
              required
              class="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-purple-200 bg-purple-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <span class="text-[10px] text-slate-400">ផ្ដល់សិទ្ធិចូលទំព័រ /admin និងគ្រប់គ្រងទិន្នន័យទាំងអស់</span>
          </div>

          <div>
            <label class="block text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
              <span>📝 លេខសម្ងាត់គ្រូបង្រៀន Teacher Password:</span>
            </label>
            <input
              v-model="passwordForm.teacher"
              type="text"
              required
              class="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-indigo-200 bg-indigo-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span class="text-[10px] text-slate-400">ផ្ដល់សិទ្ធិចូលទំព័រ /gradebook ដើម្បីបញ្ចូល និងកែប្រែពិន្ទុ</span>
          </div>

          <div>
            <label class="block text-xs font-bold text-blue-700 mb-1 flex items-center gap-1.5">
              <span>🎓 លេខសម្ងាត់សិស្ស Student Passcode:</span>
            </label>
            <input
              v-model="passwordForm.student"
              type="text"
              required
              class="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-blue-200 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span class="text-[10px] text-slate-400">ផ្ដល់សិទ្ធិចូលទំព័រ /student ដើម្បីមើលលទ្ធផល និងបោះពុម្ព A4</span>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="showPasswordModal = false"
              class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              class="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition"
            >
              រក្សាទុក Password ថ្មី
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Add New Student -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-lg font-bold text-slate-800">បន្ថែមសិស្សថ្មីចូលក្នុងថ្នាក់</h3>
          <button
            @click="showAddModal = false"
            class="text-slate-400 hover:text-slate-600 text-lg"
          >
            ✕
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="handleAddStudent">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">គោត្តនាម និង នាមសិស្ស *</label>
            <input
              v-model="newStudentForm.name"
              type="text"
              required
              placeholder="ឧ. ហេង វីរៈ"
              class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">ភេទ (Gender)</label>
              <select
                v-model="newStudentForm.gender"
                class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="M">ប្រុស (Male)</option>
                <option value="F">ស្រី (Female)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">ថ្ងៃខែឆ្នាំកំណើត</label>
              <input
                v-model="newStudentForm.dob"
                type="date"
                class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">ចំណាំ (Remarks)</label>
            <input
              v-model="newStudentForm.remarks"
              type="text"
              placeholder="ឧ. សិស្សផ្ទេរមកពីសាលាផ្សេង"
              class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <!-- Initial Scores -->
          <div class="border-t border-slate-100 pt-3">
            <label class="block text-xs font-semibold text-slate-700 mb-2">ពិន្ទុដំបូង (០-១០០)</label>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="text-[10px] text-slate-500">គណិត</label>
                <input
                  v-model.number="newStudentForm.scores.math"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full p-1.5 text-xs text-center border rounded-lg"
                />
              </div>
              <div>
                <label class="text-[10px] text-slate-500">រូបវិទ្យា</label>
                <input
                  v-model.number="newStudentForm.scores.physics"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full p-1.5 text-xs text-center border rounded-lg"
                />
              </div>
              <div>
                <label class="text-[10px] text-slate-500">គីមី</label>
                <input
                  v-model.number="newStudentForm.scores.chemistry"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full p-1.5 text-xs text-center border rounded-lg"
                />
              </div>
              <div>
                <label class="text-[10px] text-slate-500">ជីវវិទ្យា</label>
                <input
                  v-model.number="newStudentForm.scores.biology"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full p-1.5 text-xs text-center border rounded-lg"
                />
              </div>
              <div>
                <label class="text-[10px] text-slate-500">ខ្មែរ</label>
                <input
                  v-model.number="newStudentForm.scores.khmer"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full p-1.5 text-xs text-center border rounded-lg"
                />
              </div>
              <div>
                <label class="text-[10px] text-slate-500">អង់គ្លេស</label>
                <input
                  v-model.number="newStudentForm.scores.english"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full p-1.5 text-xs text-center border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              បោះបង់ (Cancel)
            </button>
            <button
              type="submit"
              class="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition"
            >
              រក្សាទុក (Add Student)
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Edit Class Info -->
    <div
      v-if="showEditClassModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-lg font-bold text-slate-800">កែប្រែព័ត៌មានទូទៅនៃថ្នាក់</h3>
          <button @click="showEditClassModal = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <form class="space-y-3" @submit.prevent="handleSaveClassInfo">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">ឈ្មោះថ្នាក់រៀន</label>
            <input
              v-model="classForm.className"
              type="text"
              required
              class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">ឆ្នាំសិក្សា</label>
            <input
              v-model="classForm.academicYear"
              type="text"
              required
              class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">ខែវាយតម្លៃ</label>
            <input
              v-model="classForm.month"
              type="text"
              required
              class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">គ្រូបន្ទុកថ្នាក់</label>
            <input
              v-model="classForm.homeroomTeacher"
              type="text"
              required
              class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="showEditClassModal = false"
              class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              class="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition"
            >
              រក្សាទុក (Save)
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Confirm Delete Student -->
    <div
      v-if="deleteTargetId"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
        <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
          ⚠️
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-800">តើអ្នកពិតជាចង់លុបសិស្សនេះមែនទេ?</h3>
          <p class="text-xs text-slate-500 mt-1">
            ទិន្នន័យពិន្ទុទាំងអស់របស់សិស្សអត្តលេខ <strong class="text-slate-800">{{ deleteTargetId }}</strong> នឹងត្រូវលុបចេញពីប្រព័ន្ធ។
          </p>
        </div>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button
            @click="deleteTargetId = null"
            class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            ទេ (Cancel)
          </button>
          <button
            @click="executeDeleteStudent"
            class="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm transition"
          >
            យល់ព្រមលុប (Yes, Delete)
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Reset Seed Data Confirmation -->
    <div
      v-if="showResetConfirmModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
        <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
          🔄
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-800">កំណត់ទិន្នន័យឡើងវិញ?</h3>
          <p class="text-xs text-slate-500 mt-1">
            ទិន្នន័យទាំងអស់ដែលបានកែប្រែក្នុង browser នឹងត្រូវកំណត់មកដូចទិន្នន័យដំបូងពី Server (/api/students)។
          </p>
        </div>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button
            @click="showResetConfirmModal = false"
            class="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            បោះបង់
          </button>
          <button
            @click="handleResetAll"
            class="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition"
          >
            កំណត់ឡើងវិញ (Reset)
          </button>
        </div>
      </div>
    </div>

    <!-- Toast: Password Updated Successfully -->
    <Transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="passwordSaveToast"
        class="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold"
      >
        <span>🔐</span>
        <span>លេខសម្ងាត់សម្រាប់ Role ត្រូវបានរក្សាទុកដោយជោគជ័យ!</span>
      </div>
    </Transition>
  </div>
</template>
