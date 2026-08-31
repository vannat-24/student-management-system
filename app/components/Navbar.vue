<!-- components/Navbar.vue -->
<script setup lang="ts">
import type { UserRole } from '~/types'

const { user, isAuthenticated, currentRole, isAdmin, isTeacher, isStudent, setRole, logout } = useAuth()
const { classInfo, isLocked } = useScore()
const router = useRouter()
const route = useRoute()

const isMobileMenuOpen = ref(false)

const handleRoleSwitch = (newRole: UserRole) => {
  setRole(newRole)
  // Redirect accordingly
  if (newRole === 'admin') {
    router.push('/admin')
  } else if (newRole === 'teacher') {
    router.push('/gradebook')
  } else {
    router.push('/student')
  }
}

const handleLogout = () => {
  logout()
  router.push('/auth/login')
}
</script>

<template>
  <nav class="no-print sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand & Logo -->
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-200 group-hover:scale-105 transition">
              🎓
            </div>
            <div>
              <div class="font-extrabold text-slate-800 text-sm sm:text-base leading-tight">
                SMS • {{ classInfo.className }}
              </div>
              <div class="text-[10px] text-slate-400 font-medium">Single Class Management System</div>
            </div>
          </NuxtLink>

          <!-- Desktop Navigation Links -->
          <div class="hidden md:flex items-center space-x-1">
            <NuxtLink
              to="/"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition"
              :class="route.path === '/' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
            >
              ទិដ្ឋភាពទូទៅ (Overview)
            </NuxtLink>

            <!-- Admin Link (Only for Admin) -->
            <NuxtLink
              v-if="isAdmin"
              to="/admin"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition"
              :class="route.path.startsWith('/admin') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
            >
              រដ្ឋបាល (Admin)
            </NuxtLink>

            <!-- Gradebook Link (For Admin & Teacher) -->
            <NuxtLink
              v-if="isAdmin || isTeacher"
              to="/gradebook"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition"
              :class="route.path.startsWith('/gradebook') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
            >
              សៀវភៅពិន្ទុ (Gradebook)
            </NuxtLink>

            <!-- Student Portal Link (For All) -->
            <NuxtLink
              to="/student"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition"
              :class="route.path.startsWith('/student') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
            >
              លទ្ធផលសិស្ស (Student)
            </NuxtLink>
          </div>
        </div>

        <!-- Right Side: Lock State & Role Switcher & User Profile -->
        <div class="hidden sm:flex items-center gap-3">
          <!-- Gradebook Lock Pill -->
          <div
            :class="[
              'px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border',
              isLocked
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            ]"
            :title="isLocked ? 'ពិន្ទុត្រូវបានចាក់សោ' : 'ពិន្ទុកំពុងបើកកែប្រែ'"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="isLocked ? 'bg-rose-500' : 'bg-emerald-500'"></span>
            {{ isLocked ? 'Locked' : 'Unlocked' }}
          </div>

          <!-- Role Selector Dropdown -->
          <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span class="text-[11px] font-semibold text-slate-500 pl-1.5 hidden lg:inline">Role:</span>
            <button
              v-for="role in (['student', 'teacher', 'admin'] as UserRole[])"
              :key="role"
              type="button"
              @click="handleRoleSwitch(role)"
              :class="[
                'px-2.5 py-1 text-xs font-bold rounded-lg transition capitalize',
                currentRole === role
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              ]"
            >
              {{ role }}
            </button>
          </div>

          <!-- Current User Profile & Logout -->
          <div v-if="isAuthenticated && user" class="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div class="text-right hidden lg:block">
              <div class="text-xs font-bold text-slate-800 truncate max-w-[140px]">{{ user.name }}</div>
              <div class="text-[10px] text-slate-400 uppercase font-mono">{{ user.role }}</div>
            </div>

            <button
              @click="handleLogout"
              type="button"
              title="ចាកចេញ (Sign Out)"
              class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          <NuxtLink
            v-else
            to="/auth/login"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            ចូលប្រើ (Login)
          </NuxtLink>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <div class="flex items-center sm:hidden">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            type="button"
            class="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div v-if="isMobileMenuOpen" class="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
      <div class="flex flex-col space-y-1">
        <NuxtLink
          to="/"
          @click="isMobileMenuOpen = false"
          class="px-3 py-2 rounded-lg text-xs font-semibold"
          :class="route.path === '/' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'"
        >
          ទិដ្ឋភាពទូទៅ (Overview)
        </NuxtLink>

        <NuxtLink
          v-if="isAdmin"
          to="/admin"
          @click="isMobileMenuOpen = false"
          class="px-3 py-2 rounded-lg text-xs font-semibold"
          :class="route.path.startsWith('/admin') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'"
        >
          រដ្ឋបាល (Admin)
        </NuxtLink>

        <NuxtLink
          v-if="isAdmin || isTeacher"
          to="/gradebook"
          @click="isMobileMenuOpen = false"
          class="px-3 py-2 rounded-lg text-xs font-semibold"
          :class="route.path.startsWith('/gradebook') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'"
        >
          សៀវភៅពិន្ទុ (Gradebook)
        </NuxtLink>

        <NuxtLink
          to="/student"
          @click="isMobileMenuOpen = false"
          class="px-3 py-2 rounded-lg text-xs font-semibold"
          :class="route.path.startsWith('/student') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'"
        >
          លទ្ធផលសិស្ស (Student)
        </NuxtLink>
      </div>

      <!-- Role switcher in mobile -->
      <div class="pt-3 border-t border-slate-100">
        <div class="text-[11px] font-semibold text-slate-500 mb-2">ប្តូរតួនាទី (Switch Role):</div>
        <div class="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            v-for="role in (['student', 'teacher', 'admin'] as UserRole[])"
            :key="role"
            @click="handleRoleSwitch(role); isMobileMenuOpen = false"
            :class="[
              'py-1.5 text-xs font-bold rounded-lg capitalize',
              currentRole === role ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
            ]"
          >
            {{ role }}
          </button>
        </div>
      </div>

      <!-- Mobile User & Logout -->
      <div v-if="user" class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          <div class="font-bold text-slate-800">{{ user.name }}</div>
          <div class="text-[10px] text-slate-400 uppercase font-mono">{{ user.role }}</div>
        </div>
        <button
          @click="handleLogout(); isMobileMenuOpen = false"
          class="px-3 py-1.5 text-xs text-rose-600 bg-rose-50 font-semibold rounded-lg"
        >
          ចាកចេញ (Sign Out)
        </button>
      </div>
    </div>
  </nav>
</template>