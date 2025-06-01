export type TodoPriority = (typeof TODO_PRIORITIES)[keyof typeof TODO_PRIORITIES]

export const TODO_PRIORITIES = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const

export const TODO_PRIORITY_LABELS: Record<TodoPriority, string> = {
  [TODO_PRIORITIES.LOW]: '低',
  [TODO_PRIORITIES.MEDIUM]: '中',
  [TODO_PRIORITIES.HIGH]: '高',
}