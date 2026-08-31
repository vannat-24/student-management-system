<!-- pages/index.vue -->
<script setup lang="ts">
import { getGradeBadgeColor } from '~/utils/gradeCalculation'

const { classInfo, computedStudents, classStats, isLocked } = useScore()
const { user, isAdmin, isTeacher, isStudent } = useAuth()

// Top 3 ranked students
const topStudents = computed(() => {
  return computedStudents.value.slice(0, 3)
})

const gradeKeys: ('A' | 'B' | 'C' | 'D' | 'E' | 'F')[] = ['A', 'B', 'C', 'D', 'E', 'F']
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Banner Card -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-10 shadow-xl">
      <!-- Background decorative circle -->
      <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
            <span>🏫</span>
            <span>ប្រព័ន្ធគ្រប់គ្រងពិន្ទុថ្នាក់រៀន (Single Class System)</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight">
            {{ classInfo.className }}
          </h1>
          <p class="text-xs sm:text-sm text-indigo-200 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>ឆ្នាំសិក្សា: <strong>{{ classInfo.academicYear }}</strong></span>
            <span>ខែវាយតម្លៃ: <strong>{{ classInfo.month }}</strong></span>
            <span>គ្រូបន្ទុកថ្នាក់: <strong>{{ classInfo.homeroomTeacher }}</strong></span>
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink
            to="/gradebook"
            class="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <span>📝 បញ្ចូលពិន្ទុ (Gradebook)</span>
          </NuxtLink>
          <NuxtLink
            to="/student"
            class="px-5 py-2.5 bg-indigo-700/60 hover:bg-indigo-700 text-white border border-white/20 text-xs font-bold rounded-xl backdrop-blur-md transition flex items-center gap-2"
          >
            <span>🎓 លទ្ធផលសិស្ស (Portal)</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 4 KPI Performance Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
          👥
        </div>
        <div>
          <div class="text-xs text-slate-500 font-medium">ចំនួនសិស្សសរុប</div>
          <div class="text-2xl font-black text-slate-800 font-mono">{{ classStats.totalStudents }} <span class="text-xs text-slate-400 font-normal">នាក់</span></div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
          📈
        </div>
        <div>
          <div class="text-xs text-slate-500 font-medium">មធ្យមភាគប្រចាំថ្នាក់</div>
          <div class="text-2xl font-black text-indigo-600 font-mono">{{ classStats.classAverage }} <span class="text-xs text-slate-400 font-normal">/ 100</span></div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
          🎯
        </div>
        <div>
          <div class="text-xs text-slate-500 font-medium">អត្រាជាប់ (Pass Rate)</div>
          <div class="text-2xl font-black text-emerald-600 font-mono">{{ classStats.passRate }}%</div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
          🏆
        </div>
        <div>
          <div class="text-xs text-slate-500 font-medium">ពិន្ទុខ្ពស់បំផុត</div>
          <div class="text-2xl font-black text-amber-500 font-mono">{{ classStats.highestScore }}</div>
        </div>
      </div>
    </div>

    <!-- Role Portals Shortcut Cards -->
    <div>
      <h2 class="text-lg font-bold text-slate-800 mb-4">ច្រកចូលតាមតួនាទី (System Role Modules)</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 1. Admin Portal -->
        <NuxtLink
          to="/admin"
          class="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              ⚙️
            </div>
            <h3 class="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition">
              ផ្ទាំងរដ្ឋបាល (Admin Dashboard)
            </h3>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
              គ្រប់គ្រងបញ្ជីឈ្មោះសិស្ស បន្ថែម/លុបឈ្មោះសិស្ស កែប្រែព័ត៌មានថ្នាក់ និងបិទ/បើកសោពិន្ទុ។
            </p>
          </div>
          <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
            <span>ចូលកាន់រដ្ឋបាល</span>
            <span class="group-hover:translate-x-1 transition">→</span>
          </div>
        </NuxtLink>

        <!-- 2. Teacher Gradebook -->
        <NuxtLink
          to="/gradebook"
          class="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              📝
            </div>
            <h3 class="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition">
              សៀវភៅពិន្ទុគ្រូ (Teacher Gradebook)
            </h3>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
              តារាងបញ្ចូលពិន្ទុមុខវិជ្ជាទាំង ៦ គណនាពិន្ទុសរុប មធ្យមភាគ និទ្ទេស និងចំណាត់ថ្នាក់ស្វ័យប្រវត្តិ។
            </p>
          </div>
          <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
            <span>បញ្ចូល និងកែប្រែពិន្ទុ</span>
            <span class="group-hover:translate-x-1 transition">→</span>
          </div>
        </NuxtLink>

        <!-- 3. Student Portal -->
        <NuxtLink
          to="/student"
          class="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              🎓
            </div>
            <h3 class="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition">
              លទ្ធផលសិស្ស (Student Portal)
            </h3>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
              ផ្ទាំងកាតលទ្ធផលផ្ទាល់ខ្លួន បង្ហាញពិន្ទុតាមមុខវិជ្ជា មតិយោបល់គ្រូ និងបោះពុម្ពព្រឹត្តិបត្រ A4។
            </p>
          </div>
          <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
            <span>ពិនិត្យលទ្ធផល</span>
            <span class="group-hover:translate-x-1 transition">→</span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Leaderboard and Grade Distribution Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top 3 Honor Roll -->
      <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>🏆</span>
          <span>តារាងកិត្តិយស - សិស្សឆ្នើមប្រចាំថ្នាក់ (Top Performers)</span>
        </h3>

        <div class="space-y-3">
          <div
            v-for="stu in topStudents"
            :key="stu.id"
            class="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition"
          >
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                  stu.rank === 1 ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300' :
                  stu.rank === 2 ? 'bg-slate-200 text-slate-700' : 'bg-orange-100 text-orange-800'
                ]"
              >
                {{ stu.rank === 1 ? '🥇' : stu.rank === 2 ? '🥈' : '🥉' }}
              </span>
              <div>
                <div class="text-xs font-bold text-slate-800">{{ stu.name }}</div>
                <div class="text-[10px] text-slate-400 font-mono">{{ stu.id }} • {{ stu.gender === 'F' ? 'ស្រី' : 'ប្រុស' }}</div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="text-right">
                <div class="text-xs font-black font-mono text-indigo-600">{{ stu.average.toFixed(2) }}</div>
                <div class="text-[10px] text-slate-400">មធ្យមភាគ</div>
              </div>
              <span
                :class="[
                  'px-2 py-0.5 text-xs font-black rounded border',
                  getGradeBadgeColor(stu.grade)
                ]"
              >
                {{ stu.grade }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Grade Distribution Breakdown -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📊</span>
          <span>ការបែងចែកនិទ្ទេស (Grade Breakdown)</span>
        </h3>

        <div class="space-y-2.5">
          <div
            v-for="g in gradeKeys"
            :key="g"
            class="flex items-center justify-between text-xs"
          >
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'w-6 h-6 rounded flex items-center justify-center font-bold text-[11px] border',
                  getGradeBadgeColor(g)
                ]"
              >
                {{ g }}
              </span>
              <span class="text-slate-600 font-medium">និទ្ទេស {{ g }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  class="bg-indigo-600 h-full rounded-full"
                  :style="{ width: `${classStats.totalStudents ? ((classStats.gradeCounts[g] || 0) / classStats.totalStudents) * 100 : 0}%` }"
                ></div>
              </div>
              <span class="font-bold text-slate-800 w-8 text-right">
                {{ classStats.gradeCounts[g] || 0 }} នាក់
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>