// types/index.d.ts

// ១. ប្រភេទសិទ្ធិ និងអ្នកប្រើប្រាស់ (Auth Types)
export type UserRole = 'admin' | 'teacher' | 'student'

export interface User {
  id: string
  name: string
  role: UserRole
  studentId?: string
}

// ២. មុខវិជ្ជាទាំង ៦ និងពិន្ទុ (Subject Scores)
export interface SubjectScores {
  math: number
  physics: number
  chemistry: number
  biology: number
  khmer: number
  english: number
}

export type SubjectKey = keyof SubjectScores

// និទ្ទេស A ដល់ F
export type GradeLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

// ៣. ប្រវត្តិរូប និងពិន្ទុសិស្ស (Student Data)
export interface RawStudent {
  id: string
  name: string
  gender: 'M' | 'F'
  dob: string
  scores: SubjectScores
  remarks?: string
}

// សិស្សដែលមានបន្ថែមទិន្នន័យគណនាស្វ័យប្រវត្តិ
export interface ComputedStudent extends RawStudent {
  total: number
  average: number
  grade: GradeLetter
  rank: number
}

// ៤. ព័ត៌មានទូទៅនៃថ្នាក់រៀន (Class Metadata)
export interface ClassInfo {
  className: string
  academicYear: string
  homeroomTeacher: string
  isLocked: boolean
  month: string
}

// ៥. ទម្រង់ Response ពី Server API (/api/students)
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

export interface StudentsApiResponse {
  success: boolean
  classInfo: ClassInfo
  students: RawStudent[]
}