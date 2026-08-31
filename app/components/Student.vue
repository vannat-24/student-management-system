<!-- components/Student.vue -->
<script setup lang="ts">
import type { ComputedStudent, SubjectKey } from '~/types'
import { getGradeBadgeColor, calculateGradeLetter } from '~/utils/gradeCalculation'

const { user, isStudent } = useAuth()
const { classInfo, computedStudents, getStudentById } = useScore()

// Selected student ID: defaults to logged in student ID or first student in roster
const selectedStudentId = ref<string>('')

// Initialize or sync selected student
watch(
  [() => user.value, () => computedStudents.value],
  () => {
    if (computedStudents.value.length === 0) return

    if (isStudent.value && user.value?.studentId) {
      // Find matching student
      const exists = computedStudents.value.find((s) => s.id === user.value?.studentId)
      if (exists) {
        selectedStudentId.value = exists.id
        return
      }
    }

    if (!selectedStudentId.value || !computedStudents.value.some((s) => s.id === selectedStudentId.value)) {
      selectedStudentId.value = computedStudents.value[0]?.id || ''
    }
  },
  { immediate: true }
)

// Active computed student object
const currentStudent = computed<ComputedStudent | undefined>(() => {
  if (!selectedStudentId.value) return undefined
  return getStudentById(selectedStudentId.value)
})

// Subjects metadata
const subjects: { key: SubjectKey; labelKm: string; labelEn: string; icon: string }[] = [
  { key: 'math', labelKm: 'គណិតវិទ្យា', labelEn: 'Mathematics', icon: '📐' },
  { key: 'physics', labelKm: 'រូបវិទ្យា', labelEn: 'Physics', icon: '⚡' },
  { key: 'chemistry', labelKm: 'គីមីវិទ្យា', labelEn: 'Chemistry', icon: '🧪' },
  { key: 'biology', labelKm: 'ជីវវិទ្យា', labelEn: 'Biology', icon: '🧬' },
  { key: 'khmer', labelKm: 'ភាសាខ្មែរ', labelEn: 'Khmer Literature', icon: '🇰🇭' },
  { key: 'english', labelKm: 'ភាសាអង់គ្លេស', labelEn: 'English Language', icon: '🌐' }
]

// Progress bar color generator
const getProgressBarColor = (score: number) => {
  if (score >= 85) return 'bg-emerald-500'
  if (score >= 75) return 'bg-blue-500'
  if (score >= 65) return 'bg-cyan-500'
  if (score >= 55) return 'bg-amber-500'
  if (score >= 50) return 'bg-orange-500'
  return 'bg-rose-500'
}

// Grade description text
const getGradeDescription = (grade?: string) => {
  switch (grade) {
    case 'A': return 'ល្អប្រសើរណាស់ (Excellent)'
    case 'B': return 'ល្អណាស់ (Very Good)'
    case 'C': return 'ល្អ (Good)'
    case 'D': return 'ល្អបង្គួរ (Fair)'
    case 'E': return 'មធ្យម / ជាប់ (Pass)'
    case 'F': return 'ធ្លាក់ (Fail)'
    default: return 'មិនទាន់មានលទ្ធផល'
  }
}

// Print trigger handler
const handlePrint = () => {
  if (process.client) {
    window.print()
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Top Action & Selection Bar (Hidden in Print) -->
    <div class="no-print bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
          🎓
        </div>
        <div>
          <h1 class="text-2xl font-bold text-slate-800">លទ្ធផលសិក្សាផ្ទាល់ខ្លួន (Student Portal)</h1>
          <p class="text-xs text-slate-500 mt-0.5">
            ពិនិត្យមើលលទ្ធផលប្រចាំខែ មធ្យមភាគ និទ្ទេស និងបោះពុម្ពព្រឹត្តិបត្រពិន្ទុ
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Student Selector for testing or multi-student browsing -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold text-slate-600">ជ្រើសរើសសិស្ស:</label>
          <select
            v-model="selectedStudentId"
            class="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option v-for="stu in computedStudents" :key="stu.id" :value="stu.id">
              {{ stu.name }} ({{ stu.id }})
            </option>
          </select>
        </div>

        <!-- Print Button -->
        <button
          @click="handlePrint"
          type="button"
          class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          បោះពុម្ពព្រឹត្តិបត្រពិន្ទុ (Print A4)
        </button>
      </div>
    </div>

    <!-- Student Scorecard Container (Standard View & Print Friendly) -->
    <div v-if="currentStudent" class="space-y-6 print-area">
      <!-- Printable Official School Header (Visible primarily in print & clean card top) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-indigo-600">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-100 pb-6">
          <div class="flex items-center gap-4">
            <div
              :class="[
                'w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-inner',
                currentStudent.gender === 'F' ? 'bg-gradient-to-tr from-pink-600 to-rose-400' : 'bg-gradient-to-tr from-indigo-600 to-blue-500'
              ]"
            >
              {{ currentStudent.name.charAt(0) }}
            </div>
            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-2xl font-extrabold text-slate-800">{{ currentStudent.name }}</h2>
                <span
                  :class="[
                    'px-2.5 py-0.5 text-xs font-semibold rounded-full',
                    currentStudent.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                  ]"
                >
                  {{ currentStudent.gender === 'F' ? 'ភេទ ស្រី (Female)' : 'ភេទ ប្រុស (Male)' }}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>អត្តលេខ: <strong class="font-mono text-slate-700">{{ currentStudent.id }}</strong></span>
                <span>ថ្ងៃខែឆ្នាំកំណើត: <strong class="text-slate-700">{{ currentStudent.dob }}</strong></span>
                <span>ថ្នាក់រៀន: <strong class="text-slate-700">{{ classInfo.className }}</strong></span>
              </p>
            </div>
          </div>

          <div class="text-left md:text-right text-xs text-slate-500 space-y-1">
            <div>ឆ្នាំសិក្សា: <strong class="text-slate-800">{{ classInfo.academicYear }}</strong></div>
            <div>ការវាយតម្លៃប្រចាំខែ: <strong class="text-indigo-600 font-bold">{{ classInfo.month }}</strong></div>
            <div>គ្រូបន្ទុកថ្នាក់: <strong class="text-slate-800">{{ classInfo.homeroomTeacher }}</strong></div>
          </div>
        </div>

        <!-- 4 KPI Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <!-- 1. Average Score -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div class="text-xs text-slate-500 font-medium">មធ្យមភាគពិន្ទុ (Average)</div>
            <div class="mt-2 flex items-baseline gap-1">
              <span class="text-3xl font-extrabold text-indigo-600 font-mono">
                {{ currentStudent.average.toFixed(2) }}
              </span>
              <span class="text-xs text-slate-400">/ 100</span>
            </div>
            <div class="mt-2 text-[11px] text-slate-500">
              {{ currentStudent.average >= 50 ? '✅ ជាប់ជាស្ថាពរ' : '⚠️ មិនទាន់ជាប់' }}
            </div>
          </div>

          <!-- 2. Grade Letter Badge -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div class="text-xs text-slate-500 font-medium">និទ្ទេសសរុប (Grade)</div>
            <div class="mt-2 flex items-center gap-3">
              <span
                :class="[
                  'w-11 h-11 rounded-xl flex items-center justify-center font-black text-2xl border',
                  getGradeBadgeColor(currentStudent.grade)
                ]"
              >
                {{ currentStudent.grade }}
              </span>
              <div>
                <div class="text-xs font-bold text-slate-800">និទ្ទេស {{ currentStudent.grade }}</div>
                <div class="text-[10px] text-slate-500">{{ getGradeDescription(currentStudent.grade) }}</div>
              </div>
            </div>
          </div>

          <!-- 3. Class Rank -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div class="text-xs text-slate-500 font-medium">ចំណាត់ថ្នាក់ក្នុងថ្នាក់ (Rank)</div>
            <div class="mt-2 flex items-baseline gap-1.5">
              <span class="text-3xl font-extrabold text-amber-500">
                #{{ currentStudent.rank }}
              </span>
              <span class="text-xs text-slate-500">
                ក្នុងចំណោម {{ computedStudents.length }} នាក់
              </span>
            </div>
            <div class="mt-2 text-[11px] text-slate-500">
              {{ currentStudent.rank === 1 ? '🏆 លេខ ១ ប្រចាំថ្នាក់' : `ស្ថិតក្នុងលំដាប់កំពូល ${Math.round((currentStudent.rank / computedStudents.length) * 100)}%` }}
            </div>
          </div>

          <!-- 4. Total Score -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div class="text-xs text-slate-500 font-medium">ពិន្ទុសរុប (Total Points)</div>
            <div class="mt-2 flex items-baseline gap-1">
              <span class="text-3xl font-extrabold text-slate-800 font-mono">
                {{ currentStudent.total }}
              </span>
              <span class="text-xs text-slate-400">/ 600</span>
            </div>
            <div class="mt-2 text-[11px] text-slate-500">
              ស្មើនឹង {{ ((currentStudent.total / 600) * 100).toFixed(1) }}% នៃពិន្ទុអតិបរមា
            </div>
          </div>
        </div>
      </div>

      <!-- Subject Breakdown with Progress Bars -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 page-break-inside-avoid">
        <h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📊</span>
          <span>ពិន្ទុលម្អិតតាមមុខវិជ្ជាទាំង ៦ (Subject Performance Breakdown)</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="sub in subjects"
            :key="sub.key"
            class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">{{ sub.icon }}</span>
                <div>
                  <div class="text-xs font-bold text-slate-800">{{ sub.labelKm }}</div>
                  <div class="text-[10px] text-slate-400 font-medium">{{ sub.labelEn }}</div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-sm font-black font-mono text-slate-800">
                  {{ currentStudent.scores[sub.key] }} <span class="text-[10px] text-slate-400 font-normal">/ 100</span>
                </span>
                <span
                  :class="[
                    'px-2 py-0.5 text-[11px] font-extrabold rounded border',
                    getGradeBadgeColor(calculateGradeLetter(currentStudent.scores[sub.key]))
                  ]"
                >
                  {{ calculateGradeLetter(currentStudent.scores[sub.key]) }}
                </span>
              </div>
            </div>

            <!-- Visual Progress Bar -->
            <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                :class="['h-full rounded-full transition-all duration-500', getProgressBarColor(currentStudent.scores[sub.key])]"
                :style="{ width: `${Math.min(100, Math.max(0, currentStudent.scores[sub.key]))}%` }"
              ></div>
            </div>

            <div class="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>កម្រិតជាប់: 50 ពិន្ទុ</span>
              <span>
                {{ currentStudent.scores[sub.key] >= 85 ? '🌟 ល្អប្រសើរ' :
                   currentStudent.scores[sub.key] >= 75 ? '👍 ល្អណាស់' :
                   currentStudent.scores[sub.key] >= 50 ? '✓ ជាប់' : '⚠️ ត្រូវពង្រឹង' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Remarks & Signatures Section (Formatted for A4 Printing) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 page-break-inside-avoid">
        <!-- Homeroom Remarks Card -->
        <div class="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span>✍️</span>
              <span>មតិយោបល់របស់លោកគ្រូ/អ្នកគ្រូបន្ទុកថ្នាក់ (Homeroom Teacher Remarks)</span>
            </h3>
            <div class="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-950 italic leading-relaxed">
              "{{ currentStudent.remarks || 'សិស្សមានការយកចិត្តទុកដាក់លើការសិក្សា និងមានវិន័យល្អ។ សូមបន្តការខិតខំប្រឹងប្រែងដើម្បីទទួលបានលទ្ធផលកាន់តែប្រសើរ។' }}"
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>គ្រូបន្ទុកថ្នាក់: <strong>{{ classInfo.homeroomTeacher }}</strong></span>
            <span>កាលបរិច្ឆេទ: {{ new Date().toLocaleDateString('km-KH') }}</span>
          </div>
        </div>

        <!-- Official Stamp & Signatures Box -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-between text-center">
          <div class="text-xs font-bold text-slate-700 uppercase tracking-wider">
            ហត្ថលេខា និងត្រា (Approval)
          </div>

          <div class="my-4 py-6 border-2 border-dashed border-slate-200 rounded-xl w-full flex flex-col items-center justify-center">
            <div class="w-14 h-14 rounded-full border-2 border-indigo-200 flex items-center justify-center text-indigo-300 text-2xl font-bold">
              🇰🇭
            </div>
            <span class="text-[10px] text-slate-400 mt-2 font-mono">SEAL & SIGNATURE</span>
          </div>

          <div class="text-xs font-semibold text-slate-800">
            នាយក / នាយិកាសាលា
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
      <div class="text-4xl mb-2">🔍</div>
      <p class="text-sm">មិនមានទិន្នន័យសិស្សដើម្បីបង្ហាញឡើយ។</p>
    </div>
  </div>
</template>