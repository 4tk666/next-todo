// タブ値の定数定義
export const TODO_TABS_VALUES = {
  UPCOMING: 'upcoming',
  OVERDUE: 'overdue',
  COMPLETED: 'completed',
} as const

export const TODO_TABS = [
  { value: TODO_TABS_VALUES.UPCOMING, label: '今後' },
  { value: TODO_TABS_VALUES.OVERDUE, label: '期限超過' },
  { value: TODO_TABS_VALUES.COMPLETED, label: '完了' },
]
