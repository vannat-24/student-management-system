// composables/useAuth.ts
import type { User, UserRole } from '~/types'

export const DEMO_ACCOUNTS: Record<UserRole, User> = {
  admin: {
    id: 'ADM-001',
    name: 'គណៈគ្រប់គ្រង (Admin)',
    role: 'admin'
  },
  teacher: {
    id: 'TEA-001',
    name: 'លោកគ្រូ សុវណ្ណ (Teacher)',
    role: 'teacher'
  },
  student: {
    id: 'STU-001',
    name: 'សុខ ហេង (Student)',
    role: 'student',
    studentId: 'STU-001'
  }
}

export interface RolePasswords {
  admin: string
  teacher: string
  student: string
}

const DEFAULT_ROLE_PASSWORDS: RolePasswords = {
  admin: 'admin123',
  teacher: 'teacher123',
  student: 'student123'
}

const AUTH_STORAGE_KEY = 'sms_auth_user_v1'
const PASSWORDS_STORAGE_KEY = 'sms_role_passwords_v1'

export const useAuth = () => {
  // Global shared auth state across components & middleware
  const user = useState<User | null>('auth_user', () => null)
  const isInitialized = useState<boolean>('auth_initialized', () => false)
  const rolePasswords = useState<RolePasswords>('role_passwords', () => ({ ...DEFAULT_ROLE_PASSWORDS }))

  // Initialize auth state and passwords from localStorage
  const initAuth = () => {
    if (process.client && !isInitialized.value) {
      try {
        // 1. Load User Session
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
        if (storedUser) {
          user.value = JSON.parse(storedUser)
        } else {
          user.value = DEMO_ACCOUNTS.teacher
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_ACCOUNTS.teacher))
        }

        // 2. Load Role Passwords set by Admin
        const storedPasswords = localStorage.getItem(PASSWORDS_STORAGE_KEY)
        if (storedPasswords) {
          rolePasswords.value = {
            ...DEFAULT_ROLE_PASSWORDS,
            ...JSON.parse(storedPasswords)
          }
        }
      } catch (err) {
        console.error('Failed to parse auth data from localStorage:', err)
        user.value = DEMO_ACCOUNTS.teacher
      } finally {
        isInitialized.value = true
      }
    }
  }

  // Update role passwords (called by Admin in Admin dashboard)
  const updateRolePasswords = (newPasswords: Partial<RolePasswords>) => {
    rolePasswords.value = {
      ...rolePasswords.value,
      ...newPasswords
    }
    if (process.client) {
      localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(rolePasswords.value))
    }
    return true
  }

  // Smart Password-Only Login: detects role automatically from the password entered
  const loginWithPassword = (
    enteredPassword: string,
    optionalStudentId?: string,
    studentName?: string
  ): { success: boolean; role?: UserRole; redirect?: string; message?: string } => {
    const pwd = enteredPassword.trim()
    if (!pwd) {
      return { success: false, message: 'សូមបញ្ចូលលេខសម្ងាត់ (Please enter a password)' }
    }

    // 1. Check Admin Password
    if (pwd === rolePasswords.value.admin.trim()) {
      setRole('admin')
      return { success: true, role: 'admin', redirect: '/admin' }
    }

    // 2. Check Teacher Password
    if (pwd === rolePasswords.value.teacher.trim()) {
      setRole('teacher')
      return { success: true, role: 'teacher', redirect: '/gradebook' }
    }

    // 3. Check Student Password
    if (pwd === rolePasswords.value.student.trim()) {
      const stuId = optionalStudentId?.trim() || 'STU-001'
      setRole('student', stuId, studentName)
      return { success: true, role: 'student', redirect: '/student' }
    }

    return {
      success: false,
      message: 'លេខសម្ងាត់មិនត្រឹមត្រូវ! (Invalid password. Please check your role password).'
    }
  }

  // Direct role assignment
  const setRole = (role: UserRole, studentId: string = 'STU-001', customName?: string) => {
    let newUser: User
    if (role === 'student') {
      newUser = {
        id: studentId,
        name: customName || DEMO_ACCOUNTS.student.name,
        role: 'student',
        studentId: studentId
      }
    } else {
      newUser = {
        ...DEMO_ACCOUNTS[role],
        name: customName || DEMO_ACCOUNTS[role].name
      }
    }

    user.value = newUser
    if (process.client) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser))
    }
  }

  // Switch student profile
  const setStudentProfile = (studentId: string, studentName: string) => {
    const updated: User = {
      id: studentId,
      name: studentName,
      role: 'student',
      studentId: studentId
    }
    user.value = updated
    if (process.client) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated))
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    if (process.client) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  // Auto-init on call
  if (process.client && !isInitialized.value) {
    initAuth()
  }

  const isAuthenticated = computed(() => !!user.value)
  const currentRole = computed<UserRole | null>(() => user.value?.role || null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTeacher = computed(() => user.value?.role === 'teacher')
  const isStudent = computed(() => user.value?.role === 'student')

  return {
    user,
    isAuthenticated,
    currentRole,
    rolePasswords,
    isAdmin,
    isTeacher,
    isStudent,
    initAuth,
    setRole,
    setStudentProfile,
    loginWithPassword,
    updateRolePasswords,
    logout,
    demoAccounts: DEMO_ACCOUNTS
  }
}