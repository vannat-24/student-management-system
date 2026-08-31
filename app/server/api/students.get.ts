// app/server/api/students.get.ts
import type { StudentsApiResponse } from '~/types'

export default defineEventHandler(async (event): Promise<StudentsApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 150))

  return {
    success: true,
    classInfo: {
      className: 'ថ្នាក់ទី ១២A (Class 12A)',
      academicYear: '2025-2026',
      homeroomTeacher: 'លោកគ្រូ សុវណ្ណ (Mr. Sovann)',
      isLocked: false,
      month: 'តុលា (October)'
    },
    students: [
      {
        id: 'STU-001',
        name: 'សុខ ហេង',
        gender: 'M',
        dob: '2008-05-12',
        scores: {
          math: 88,
          physics: 82,
          chemistry: 85,
          biology: 80,
          khmer: 92,
          english: 90
        },
        remarks: 'រៀនពូកែ យកចិត្តទុកដាក់ និងមានវិន័យល្អណាស់'
      },
      {
        id: 'STU-002',
        name: 'ចាន់ ធីតា',
        gender: 'F',
        dob: '2008-08-20',
        scores: {
          math: 96,
          physics: 94,
          chemistry: 91,
          biology: 95,
          khmer: 98,
          english: 92
        },
        remarks: 'ឧស្សាហ៍ព្យាយាម លទ្ធផលឆ្នើមទូទាំងថ្នាក់'
      },
      {
        id: 'STU-003',
        name: 'កែវ វិបុល',
        gender: 'M',
        dob: '2008-01-15',
        scores: {
          math: 64,
          physics: 58,
          chemistry: 62,
          biology: 66,
          khmer: 72,
          english: 68
        },
        remarks: 'មានការរីកចម្រើន ប៉ុន្តែត្រូវពង្រឹងមុខវិជ្ជាវិទ្យាសាស្ត្របន្ថែម'
      },
      {
        id: 'STU-004',
        name: 'ឡុង ដានី',
        gender: 'F',
        dob: '2008-11-03',
        scores: {
          math: 75,
          physics: 70,
          chemistry: 78,
          biology: 74,
          khmer: 85,
          english: 82
        },
        remarks: 'ការសិក្សាល្អមធ្យម ចូលរួមសកម្មភាពក្នុងថ្នាក់បានល្អ'
      },
      {
        id: 'STU-005',
        name: 'សេង ពិសិដ្ឋ',
        gender: 'M',
        dob: '2008-03-29',
        scores: {
          math: 48,
          physics: 52,
          chemistry: 49,
          biology: 54,
          khmer: 62,
          english: 56
        },
        remarks: 'ត្រូវខិតខំរំលឹកមេរៀន និងយកចិត្តទុកដាក់ក្នុងម៉ោងរៀនបន្ថែម'
      }
    ]
  }
})
