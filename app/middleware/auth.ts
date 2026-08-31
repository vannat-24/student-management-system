// middleware/auth.ts
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isAuthenticated, isAdmin, isTeacher, isStudent, initAuth } = useAuth()

  // Ensure auth is initialized from storage on client side
  if (process.client) {
    initAuth()
  }

  const isAuthRoute = to.path.startsWith('/auth')

  // 1. Unauthenticated users handling
  if (!isAuthenticated.value) {
    // If not logged in and trying to access protected routes, redirect to login
    if (!isAuthRoute) {
      return navigateTo('/auth/login')
    }
    return
  }

  // 2. If authenticated user tries to access /auth/login or /auth/register, redirect to their home dashboard
  if (isAuthRoute) {
    if (isAdmin.value) {
      return navigateTo('/admin')
    }
    if (isTeacher.value) {
      return navigateTo('/gradebook')
    }
    if (isStudent.value) {
      return navigateTo('/student')
    }
    return navigateTo('/')
  }

  // 3. Role-Based Route Guarding
  // Student role restrictions: cannot access /admin or /gradebook
  if (isStudent.value) {
    if (to.path.startsWith('/admin') || to.path.startsWith('/gradebook')) {
      return navigateTo('/student')
    }
  }

  // Teacher role restrictions: cannot access /admin
  if (isTeacher.value) {
    if (to.path.startsWith('/admin')) {
      return navigateTo('/gradebook')
    }
  }
})
