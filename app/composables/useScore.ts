// composables/useScore.ts
import type {
  RawStudent,
  ComputedStudent,
  ClassInfo,
  SubjectScores,
  SubjectKey,
  StudentsApiResponse
} from '~/types'
import {
  computeStudentsGrades,
  calculateTotalScore,
  calculateAverageScore,
  calculateGradeLetter,
  getGradeBadgeColor
} from '~/utils/gradeCalculation'

const STORAGE_KEY = 'sms_class_data_v1'

const DEFAULT_CLASS_INFO: ClassInfo = {
  className: 'ថ្នាក់ទី ១២A (Class 12A)',
  academicYear: '2025-2026',
  homeroomTeacher: 'លោកគ្រូ សុវណ្ណ (Mr. Sovann)',
  isLocked: false,
  month: 'តុលា (October)'
}

export const useScore = () => {
  // Shared global reactive state using Nuxt useState
  const classInfo = useState<ClassInfo>('score_class_info', () => ({ ...DEFAULT_CLASS_INFO }))
  const students = useState<RawStudent[]>('score_raw_students', () => [])
  const isLoading = useState<boolean>('score_loading', () => false)
  const isInitialized = useState<boolean>('score_initialized', () => false)
  const lastSavedTime = useState<string | null>('score_last_saved', () => null)
  const errorMessage = useState<string | null>('score_error_message', () => null)

  /**
   * Save current state into browser localStorage
   */
  const saveToStorage = () => {
    if (process.client) {
      try {
        const payload = {
          classInfo: classInfo.value,
          students: students.value,
          savedAt: new Date().toISOString()
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        lastSavedTime.value = new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      } catch (err) {
        console.error('Error saving scores to localStorage:', err)
      }
    }
  }

  /**
   * Fetch initial roster and scores from /api/students with localStorage fallback
   */
  const fetchInitialData = async (forceRemote: boolean = false) => {
    if (isInitialized.value && !forceRemote) return

    isLoading.value = true
    errorMessage.value = null

    // 1. Try reading from client localStorage first if not forced
    if (process.client && !forceRemote) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.classInfo && Array.isArray(parsed.students) && parsed.students.length > 0) {
            classInfo.value = parsed.classInfo
            students.value = parsed.students
            isInitialized.value = true
            isLoading.value = false
            return
          }
        }
      } catch (err) {
        console.warn('Could not parse cached class data, fetching remote API...', err)
      }
    }

    // 2. Fetch from Nitro Server API endpoint /api/students
    try {
      const response = await $fetch<StudentsApiResponse>('/api/students')
      if (response && response.success) {
        classInfo.value = response.classInfo || { ...DEFAULT_CLASS_INFO }
        students.value = response.students || []
        isInitialized.value = true
        saveToStorage()
      }
    } catch (err: any) {
      console.error('Failed to fetch students from /api/students:', err)
      errorMessage.value = 'មិនអាចទាញទិន្នន័យពី Server បានទេ។ សូមព្យាយាមម្តងទៀត។'
    } finally {
      isLoading.value = false
    }
  }

  // Auto-fetch data on client start
  if (process.client && !isInitialized.value) {
    fetchInitialData()
  }

  /**
   * Computed reactive list of students with calculated Total, Average, Grade, and Rank
   */
  const computedStudents = computed<ComputedStudent[]>(() => {
    return computeStudentsGrades(students.value)
  })

  /**
   * Check if the class is locked from modifications
   */
  const isLocked = computed(() => !!classInfo.value.isLocked)

  /**
   * Overall Class Performance KPI & Statistics
   */
  const classStats = computed(() => {
    const list = computedStudents.value
    const totalStudents = list.length

    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        classAverage: 0,
        highestScore: 0,
        lowestScore: 0,
        passedCount: 0,
        passRate: 0,
        gradeCounts: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }
      }
    }

    const totalAverageSum = list.reduce((sum, s) => sum + s.average, 0)
    const classAverage = Number((totalAverageSum / totalStudents).toFixed(2))

    const averages = list.map((s) => s.average)
    const highestScore = Math.max(...averages)
    const lowestScore = Math.min(...averages)

    // Passing grade is E or above (average >= 50)
    const passedCount = list.filter((s) => s.grade !== 'F').length
    const passRate = Number(((passedCount / totalStudents) * 100).toFixed(1))

    const gradeCounts = {
      A: list.filter((s) => s.grade === 'A').length,
      B: list.filter((s) => s.grade === 'B').length,
      C: list.filter((s) => s.grade === 'C').length,
      D: list.filter((s) => s.grade === 'D').length,
      E: list.filter((s) => s.grade === 'E').length,
      F: list.filter((s) => s.grade === 'F').length
    }

    return {
      totalStudents,
      classAverage,
      highestScore,
      lowestScore,
      passedCount,
      passRate,
      gradeCounts
    }
  })

  /**
   * Update student marks for single or multiple subjects
   */
  const updateStudentScore = (
    studentId: string,
    subject: SubjectKey,
    rawScore: number | string
  ) => {
    if (classInfo.value.isLocked) {
      console.warn('Class scores are locked. Modifications are prohibited.')
      return false
    }

    const num = Math.min(100, Math.max(0, Number(rawScore) || 0))
    const index = students.value.findIndex((s) => s.id === studentId)

    if (index !== -1) {
      students.value[index].scores[subject] = num
      saveToStorage()
      return true
    }
    return false
  }

  /**
   * Update all scores for a student in one operation
   */
  const updateStudent = (updatedStudent: Partial<RawStudent> & { id: string }) => {
    if (classInfo.value.isLocked) {
      console.warn('Class scores are locked. Modifications are prohibited.')
      return false
    }

    const index = students.value.findIndex((s) => s.id === updatedStudent.id)
    if (index !== -1) {
      students.value[index] = {
        ...students.value[index],
        ...updatedStudent,
        scores: {
          ...students.value[index].scores,
          ...(updatedStudent.scores || {})
        }
      }
      saveToStorage()
      return true
    }
    return false
  }

  /**
   * Batch update full roster scores (used by Teacher component Save action)
   */
  const batchUpdateScores = (roster: RawStudent[]) => {
    if (classInfo.value.isLocked) {
      return false
    }

    students.value = roster.map((s) => ({
      ...s,
      scores: {
        math: Math.min(100, Math.max(0, Number(s.scores.math) || 0)),
        physics: Math.min(100, Math.max(0, Number(s.scores.physics) || 0)),
        chemistry: Math.min(100, Math.max(0, Number(s.scores.chemistry) || 0)),
        biology: Math.min(100, Math.max(0, Number(s.scores.biology) || 0)),
        khmer: Math.min(100, Math.max(0, Number(s.scores.khmer) || 0)),
        english: Math.min(100, Math.max(0, Number(s.scores.english) || 0))
      }
    }))

    saveToStorage()
    return true
  }

  /**
   * Add a new student to the class (Admin only)
   */
  const addStudent = (newStudent: Omit<RawStudent, 'id'> & { id?: string }): RawStudent => {
    const nextId =
      newStudent.id ||
      `STU-${String(students.value.length + 1).padStart(3, '0')}`

    const studentToAdd: RawStudent = {
      id: nextId,
      name: newStudent.name.trim(),
      gender: newStudent.gender || 'M',
      dob: newStudent.dob || '2008-01-01',
      scores: {
        math: Number(newStudent.scores?.math) || 0,
        physics: Number(newStudent.scores?.physics) || 0,
        chemistry: Number(newStudent.scores?.chemistry) || 0,
        biology: Number(newStudent.scores?.biology) || 0,
        khmer: Number(newStudent.scores?.khmer) || 0,
        english: Number(newStudent.scores?.english) || 0
      },
      remarks: newStudent.remarks || 'សិស្សទើបចូលថ្មី'
    }

    students.value.push(studentToAdd)
    saveToStorage()
    return studentToAdd
  }

  /**
   * Remove a student from the roster (Admin only)
   */
  const removeStudent = (studentId: string): boolean => {
    const initialLen = students.value.length
    students.value = students.value.filter((s) => s.id !== studentId)
    const removed = students.value.length < initialLen
    if (removed) {
      saveToStorage()
    }
    return removed
  }

  /**
   * Toggle the gradebook lock state (Admin only)
   */
  const toggleLock = (forcedState?: boolean) => {
    classInfo.value.isLocked =
      typeof forcedState === 'boolean'
        ? forcedState
        : !classInfo.value.isLocked
    saveToStorage()
    return classInfo.value.isLocked
  }

  /**
   * Update general class metadata (Admin only)
   */
  const updateClassInfo = (info: Partial<ClassInfo>) => {
    classInfo.value = {
      ...classInfo.value,
      ...info
    }
    saveToStorage()
  }

  /**
   * Reset database back to default seed data from /api/students
   */
  const resetToDefault = async () => {
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
    await fetchInitialData(true)
  }

  /**
   * Get single computed student by ID
   */
  const getStudentById = (id: string): ComputedStudent | undefined => {
    return computedStudents.value.find((s) => s.id === id)
  }

  return {
    classInfo,
    students,
    computedStudents,
    classStats,
    isLocked,
    isLoading,
    isInitialized,
    lastSavedTime,
    errorMessage,
    fetchInitialData,
    saveToStorage,
    updateStudentScore,
    updateStudent,
    batchUpdateScores,
    addStudent,
    removeStudent,
    toggleLock,
    updateClassInfo,
    resetToDefault,
    getStudentById,
    getGradeBadgeColor
  }
}