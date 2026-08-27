// server/api/students.get.ts
export default defineEventHandler(async (event) => {
  // Simulate delay 300ms ឱ្យដូចទាញពី API Backend ពិតប្រាកដ
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    success: true,
    classInfo: {
      className: 'ថ្នាក់ទី ១២A',
      academicYear: '2025-2026',
      homeroomTeacher: 'លោកគ្រូ សុវណ្ណ',
      isLocked: false,
      month: 'តុលា'
    },
    students: [
      {
        id: 'STU-001',
        name: 'សុខ ហេង',
        gender: 'M',
        dob: '2008-05-12',
        scores: {
          math: 85,
          physics: 78,
          chemistry: 80,
          biology: 75,
          khmer: 90,
          english: 88
        },
        remarks: 'រៀនពូកែ និងមានវិន័យល្អ'
      },
      {
        id: 'STU-002',
        name: 'ចាន់ ធីតា',
        gender: 'F',
        dob: '2008-08-20',
        scores: {
          math: 95,
          physics: 92,
          chemistry: 89,
          biology: 94,
          khmer: 96,
          english: 90
        },
        remarks: 'ឧស្សាហ៍ព្យាយាម លទ្ធផលឆ្នើម'
      },
      {
        id: 'STU-003',
        name: 'កែវ វិបុល',
        gender: 'M',
        dob: '2008-01-15',
        scores: {
          math: 60,
          physics: 55,
          chemistry: 58,
          biology: 62,
          khmer: 70,
          english: 65
        },
        remarks: 'ត្រូវពង្រឹងមុខវិជ្ជាវិទ្យាសាស្ត្របន្ថែម'
      },
      {
        id: 'STU-004',
        name: 'ឡុង ដានី',
        gender: 'F',
        dob: '2008-11-03',
        scores: {
          math: 72,
          physics: 68,
          chemistry: 75,
          biology: 70,
          khmer: 82,
          english: 80
        },
        remarks: 'ការសិក្សាល្អមធ្យម ចូលរួមសកម្មភាពច្រើន'
      },
      {
        id: 'STU-005',
        name: 'សេង ពិសិដ្ឋ',
        gender: 'M',
        dob: '2008-03-29',
        scores: {
          math: 45,
          physics: 48,
          chemistry: 50,
          biology: 52,
          khmer: 60,
          english: 55
        },
        remarks: 'ខ្វះការយកចិត្តទុកដាក់លើម៉ោងរៀន'
      }
    ]
  }
})


//how to call data 
// const { data, pending, error } = await useFetch('/api/students')
// ទិន្នន័យដែលទទួលបាន៖
// data.value.classInfo -> ព័ត៌មានថ្នាក់
// data.value.students  -> បញ្ជីឈ្មោះ និងពិន្ទុសិស្សទាំង ៥ នាក់