import type { RawStudent, ComputedStudent, SubjectScores, GradeLetter } from '~/types'
/**
 * ១. គណនាពិន្ទុសរុបពីមុខវិជ្ជាទាំង ៦
 */
export const calculateTotalScore = (scores: SubjectScores): number => {
  const values = Object.values(scores)
  return values.reduce((sum, score) => sum + (Number(score) || 0), 0)
}
/**
 * ២. គណនាមធ្យមភាគ (ពិន្ទុសរុបចែកនឹងចំនួនមុខវិជ្ជា)
 */
export const calculateAverageScore = (scores: SubjectScores): number => {
  const total = calculateTotalScore(scores)
  const subjectCount = Object.keys(scores).length
  if (subjectCount === 0) return 0

  const average = total / subjectCount
  return Number(average.toFixed(2))
}

/**
 * ៣. កំណត់និទ្ទេស (A - F) តាមស្ដង់ដារមធ្យមភាគ
 * A: >= 85 | B: >= 75 | C: >= 65 | D: >= 55 | E: >= 50 | F: < 50
 */
export const calculateGradeLetter = (average: number): GradeLetter => {
  if (average >= 85) return 'A'
  if (average >= 75) return 'B'
  if (average >= 65) return 'C'
  if (average >= 55) return 'D'
  if (average >= 50) return 'E'
  return 'F'
}

/**
 * ៤. គណនាទិន្នន័យសរុប និងតម្រៀបចំណាត់ថ្នាក់ (Rank) សម្រាប់បញ្ជីសិស្សទាំងអស់
 */
export const computeStudentsGrades = (students: RawStudent[]): ComputedStudent[] => {
  // ជំហានទី ១៖ គណនា Total, Average, Grade សម្រាប់សិស្សម្នាក់ៗ
  const calculatedList = students.map((student) => {
    const total = calculateTotalScore(student.scores)
    const average = calculateAverageScore(student.scores)
    const grade = calculateGradeLetter(average)

    return {
      ...student,
      total,
      average,
      grade,
      rank: 0 // ទុកដាក់ចំណាត់ថ្នាក់នៅជំហានបន្ទាប់
    }
  })

  // ជំហានទី ២៖ តម្រៀបតាមមធ្យមភាគពីខ្ពស់ទៅទាប (Descending Sort)
  const sorted = [...calculatedList].sort((a, b) => b.average - a.average)

  // ជំហានទី ៣៖ ផ្ដល់ចំណាត់ថ្នាក់ (Rank)
  return sorted.map((student, index) => ({
    ...student,
    rank: index + 1
  }))
}

/**
 * ៥. មុខងារជំនួយ៖ ពណ៌សម្គាល់សម្រាប់ Badge និទ្ទេសនីមួយៗ
 */
export const getGradeBadgeColor = (grade: GradeLetter): string => {
  switch (grade) {
    case 'A':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300'
    case 'B':
      return 'bg-blue-100 text-blue-700 border-blue-300'
    case 'C':
      return 'bg-cyan-100 text-cyan-700 border-cyan-300'
    case 'D':
      return 'bg-amber-100 text-amber-700 border-amber-300'
    case 'E':
      return 'bg-orange-100 text-orange-700 border-orange-300'
    case 'F':
      return 'bg-rose-100 text-rose-700 border-rose-300'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300'
  }
}