<!-- components/Teacher.vue -->
<script setup lang="ts">
import type { RawStudent, ComputedStudent, SubjectKey } from '~/types'
import {
  computeStudentsGrades,
  calculateTotalScore,
  calculateAverageScore,
  calculateGradeLetter,
  getGradeBadgeColor
} from '~/utils/gradeCalculation'

const {
  classInfo,
  students,
  isLocked,
  isLoading,
  lastSavedTime,
  batchUpdateScores,
  fetchInitialData
} = useScore()

// Local editable buffer for the student roster
const editableStudents = ref<RawStudent[]>([])
const searchQuery = ref('')
const hasUnsavedChanges = ref(false)
const saveSuccessToast = ref(false)
let toastTimer: any = null

// Initialize local buffer from global state
const syncFromGlobal = () => {
  editableStudents.value = JSON.parse(JSON.stringify(students.value))
  hasUnsavedChanges.value = false
}

// Watch for global changes (like initial hydration)
watch(
  () => students.value,
  (newList) => {
    if (!hasUnsavedChanges.value) {
      syncFromGlobal()
    }
  },
  { immediate: true, deep: true }
)

// Subject list definitions for column iteration
const subjects: { key: SubjectKey; labelKm: string; labelEn: string; icon: string }[] = [
  { key: 'math', labelKm: 'គណិត', labelEn: 'Math', icon: '📐' },
  { key: 'physics', labelKm: 'រូបវិទ្យា', labelEn: 'Physics', icon: '⚡' },
  { key: 'chemistry', labelKm: 'គីមី', labelEn: 'Chemistry', icon: '🧪' },
  { key: 'biology', labelKm: 'ជីវវិទ្យា', labelEn: 'Biology', icon: '🧬' },
  { key: 'khmer', labelKm: 'ខ្មែរ', labelEn: 'Khmer', icon: '🇰🇭' },
  { key: 'english', labelKm: 'អង់គ្លេស', labelEn: 'English', icon: '🌐' }
]

// Handle score input with boundary validation (0 to 100)
const onScoreChange = (studentId: string, subject: SubjectKey, val: string | number) => {
  if (isLocked.value) return

  let num = Number(val)
  if (isNaN(num)) num = 0
  if (num < 0) num = 0
  if (num > 100) num = 100

  const target = editableStudents.value.find((s) => s.id === studentId)
  if (target) {
    target.scores[subject] = num
    hasUnsavedChanges.value = true
  }
}

// Handle remarks input
const onRemarksChange = (studentId: string, text: string) => {
  if (isLocked.value) return
  const target = editableStudents.value.find((s) => s.id === studentId)
  if (target) {
    target.remarks = text
    hasUnsavedChanges.value = true
  }
}

// Real-time computed list with dynamic Rank, Total, Average, Grade
const liveComputedStudents = computed<ComputedStudent[]>(() => {
  return computeStudentsGrades(editableStudents.value)
})

// Filtered list based on search term
const filteredStudents = computed(() => {
  if (!searchQuery.value.trim()) {
    return liveComputedStudents.value
  }
  const q = searchQuery.value.toLowerCase().trim()
  return liveComputedStudents.value.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.remarks && s.remarks.toLowerCase().includes(q))
  )
})

// Calculate subject-level averages across current roster
const subjectAverages = computed(() => {
  const list = editableStudents.value
  if (list.length === 0) return {} as Record<SubjectKey, number>

  const avgs: Partial<Record<SubjectKey, number>> = {}
  for (const sub of subjects) {
    const total = list.reduce((sum, s) => sum + (Number(s.scores[sub.key]) || 0), 0)
    avgs[sub.key] = Number((total / list.length).toFixed(1))
  }
  return avgs as Record<SubjectKey, number>
})

// Save changes to global state and localStorage
const handleSave = () => {
  if (isLocked.value) return

  const success = batchUpdateScores(editableStudents.value)
  if (success) {
    hasUnsavedChanges.value = false
    saveSuccessToast.value = true

    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      saveSuccessToast.value = false
    }, 3000)
  }
}

// Discard changes
const handleDiscard = () => {
  syncFromGlobal()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header & Meta Information Card -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
              📚
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-800">សៀវភៅបញ្ជីពិន្ទុសិស្ស (Gradebook)</h1>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ classInfo.className }} • ឆ្នាំសិក្សា {{ classInfo.academicYear }} • ខែ {{ classInfo.month }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Class Lock Status Badge -->
          <div
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
              isLocked
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            ]"
          >
            <span class="w-2 h-2 rounded-full" :class="isLocked ? 'bg-rose-500' : 'bg-emerald-500'"></span>
            {{ isLocked ? '🔒 បានបិទសោពិន្ទុ (Locked)' : '🔓 កំពុងបើកកែប្រែ (Editable)' }}
          </div>

          <!-- Discard button -->
          <button
            v-if="hasUnsavedChanges && !isLocked"
            @click="handleDiscard"
            type="button"
            class="px-3.5 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            ត្រឡប់ដើម (Discard)
          </button>

          <!-- Save Button -->
          <button
            @click="handleSave"
            :disabled="isLocked || !hasUnsavedChanges"
            type="button"
            :class="[
              'px-4 py-2 text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-2',
              isLocked || !hasUnsavedChanges
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 cursor-pointer'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            រក្សាទុកពិន្ទុ (Save Marks)
          </button>
        </div>
      </div>

      <!-- Lock Alert Banner if isLocked is True -->
      <div
        v-if="isLocked"
        class="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-3"
      >
        <span class="text-base">🔒</span>
        <div>
          <strong class="font-bold">ការកែប្រែពិន្ទុត្រូវបានចាក់សោ (Score Editing is Locked):</strong>
          គណៈគ្រប់គ្រងថ្នាក់ (Admin) បានបិទសិទ្ធិកែប្រែពិន្ទុជាបណ្តោះអាសន្ន។ ប្រសិនបើលោកគ្រូ/អ្នកគ្រូមានបំណងកែប្រែ សូមទាក់ទង Admin ដើម្បីដោះសោ។
        </div>
      </div>

      <!-- Unsaved Changes Warning Banner -->
      <div
        v-else-if="hasUnsavedChanges"
        class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <span>⚠️</span>
          <span>លោកអ្នកមានការផ្លាស់ប្តូរពិន្ទុដែលមិនទាន់រក្សាទុក។ សូមចុច <strong>រក្សាទុកពិន្ទុ (Save Marks)</strong>។</span>
        </div>
        <span class="text-[11px] text-amber-700 font-medium">មិនទាន់ Save</span>
      </div>
    </div>

    <!-- Search and Controls Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ស្វែងរកតាមឈ្មោះ ឬ អត្តលេខសិស្ស..."
          class="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 focus:bg-white transition"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span>ចំនួនសិស្ស: <strong class="text-slate-800">{{ filteredStudents.length }}</strong> នាក់</span>
        <span v-if="lastSavedTime" class="hidden sm:inline">• រក្សាទុកចុងក្រោយ: {{ lastSavedTime }}</span>
      </div>
    </div>

    <!-- Main Gradebook Data Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr class="bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <th class="py-3.5 px-4 font-bold text-center w-14">Rank</th>
              <th class="py-3.5 px-4 font-bold min-w-[170px]">ព័ត៌មានសិស្ស (Student)</th>
              <th
                v-for="sub in subjects"
                :key="sub.key"
                class="py-3.5 px-3 font-bold text-center w-24"
              >
                <div class="flex flex-col items-center">
                  <span>{{ sub.icon }} {{ sub.labelKm }}</span>
                  <span class="text-[10px] text-slate-400 font-normal lowercase">{{ sub.labelEn }}</span>
                </div>
              </th>
              <th class="py-3.5 px-3 font-bold text-center w-20 bg-indigo-50/50 text-indigo-900">សរុប</th>
              <th class="py-3.5 px-3 font-bold text-center w-20 bg-indigo-50/50 text-indigo-900">មធ្យមភាគ</th>
              <th class="py-3.5 px-3 font-bold text-center w-16 bg-indigo-50/50 text-indigo-900">និទ្ទេស</th>
              <th class="py-3.5 px-4 font-bold min-w-[180px]">ចំណាំ (Remarks)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr
              v-for="student in filteredStudents"
              :key="student.id"
              class="hover:bg-slate-50/70 transition"
            >
              <!-- Rank -->
              <td class="py-3 px-4 text-center">
                <span
                  :class="[
                    'inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs',
                    student.rank === 1 ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300' :
                    student.rank === 2 ? 'bg-slate-200 text-slate-700' :
                    student.rank === 3 ? 'bg-orange-100 text-orange-800' :
                    'text-slate-500'
                  ]"
                >
                  {{ student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : student.rank }}
                </span>
              </td>

              <!-- Student Info -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white',
                      student.gender === 'F' ? 'bg-pink-500' : 'bg-blue-600'
                    ]"
                  >
                    {{ student.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-800 text-sm">{{ student.name }}</div>
                    <div class="text-[11px] text-slate-400 font-mono">
                      {{ student.id }} • {{ student.gender === 'F' ? 'ស្រី (F)' : 'ប្រុស (M)' }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- 6 Subject Score Inputs -->
              <td
                v-for="sub in subjects"
                :key="sub.key"
                class="py-2.5 px-2 text-center"
              >
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  :disabled="isLocked"
                  :value="student.scores[sub.key]"
                  @input="onScoreChange(student.id, sub.key, ($event.target as HTMLInputElement).value)"
                  :class="[
                    'w-16 px-2 py-1.5 text-center font-semibold text-xs rounded-lg border transition',
                    isLocked
                      ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-slate-800 hover:border-slate-400',
                    Number(student.scores[sub.key]) < 50 ? 'text-rose-600 bg-rose-50/50' : ''
                  ]"
                />
              </td>

              <!-- Total Score (Calculated Live) -->
              <td class="py-3 px-3 text-center font-bold text-indigo-950 bg-indigo-50/30">
                {{ student.total }}
              </td>

              <!-- Average (Calculated Live) -->
              <td class="py-3 px-3 text-center font-mono font-bold bg-indigo-50/30 text-indigo-600">
                {{ student.average.toFixed(2) }}
              </td>

              <!-- Grade Badge -->
              <td class="py-3 px-3 text-center bg-indigo-50/30">
                <span
                  :class="[
                    'inline-block px-2.5 py-1 text-xs font-extrabold rounded-md border',
                    getGradeBadgeColor(student.grade)
                  ]"
                >
                  {{ student.grade }}
                </span>
              </td>

              <!-- Remarks Input -->
              <td class="py-2.5 px-4">
                <input
                  type="text"
                  :disabled="isLocked"
                  :value="student.remarks || ''"
                  @input="onRemarksChange(student.id, ($event.target as HTMLInputElement).value)"
                  placeholder="ចំណាំ..."
                  :class="[
                    'w-full px-2.5 py-1.5 text-xs rounded-lg border transition',
                    isLocked
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700'
                  ]"
                />
              </td>
            </tr>

            <tr v-if="filteredStudents.length === 0">
              <td colspan="12" class="py-8 text-center text-slate-400">
                មិនមានទិន្នន័យសិស្សត្រូវនឹងពាក្យស្វែងរក "{{ searchQuery }}" ឡើយ។
              </td>
            </tr>
          </tbody>

          <!-- Table Footer: Subject Averages -->
          <tfoot class="bg-slate-50 border-t-2 border-slate-200 text-xs font-semibold text-slate-700">
            <tr>
              <td colspan="2" class="py-3.5 px-4 font-bold text-slate-800">
                📊 មធ្យមភាគប្រចាំថ្នាក់ (Class Average)
              </td>
              <td
                v-for="sub in subjects"
                :key="sub.key"
                class="py-3.5 px-2 text-center font-mono text-indigo-700"
              >
                {{ subjectAverages[sub.key] || 0 }}
              </td>
              <td colspan="4" class="py-3.5 px-4 text-slate-500 text-right">
                ផ្អែកលើទិន្នន័យសិស្សសរុប {{ editableStudents.length }} នាក់
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Success Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="saveSuccessToast"
        class="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>ពិន្ទុត្រូវបានរក្សាទុកដោយជោគជ័យ! (Grades saved successfully!)</span>
      </div>
    </Transition>
  </div>
</template>