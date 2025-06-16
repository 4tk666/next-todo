import { TODO_TABS_VALUES } from '@/constants/todo-tabs'
import { getDateOnly } from '@/lib/utils/date-utils';

export function createExpandedTodoIds({
  previousIds,
  todoId,
}: { previousIds: string[]; todoId: string }): string[] {
  const newTodoIds = previousIds.includes(todoId)
    ? previousIds.filter((id) => id !== todoId) // IDが存在する場合は削除
    : [...previousIds, todoId] // 存在しない場合は追加

  return newTodoIds
}


type FilterCondition = {
  isComplete?: boolean
  dueDate?: {
    gte?: Date
    lt?: Date
  } | null
  OR?: Array<{
    dueDate?: Date | null | { gte?: Date; lt?: Date }
  }>
}

/**
 * フィルタタイプに基づいてTODOの検索条件を生成する純粋関数
 * @param filterType フィルタタイプ
 * @returns Prismaのwhere条件オブジェクト
 */
export function createTodoFilterCondition(
  filterType?: string,
): FilterCondition {
  if (filterType === TODO_TABS_VALUES.COMPLETED) {
    return { isComplete: true }
  }

  if (filterType === TODO_TABS_VALUES.UPCOMING) {
    const today = getDateOnly(new Date())
    return {
      isComplete: false,
      OR: [
        { dueDate: null }, // 期限が設定されていないTODO
        { dueDate: { gte: today } }, // 今日以降のTODO
      ],
    }
  }

  if (filterType === TODO_TABS_VALUES.OVERDUE) {
    const today = getDateOnly(new Date())
    return {
      isComplete: false,
      dueDate: {
        lt: today, // 今日を含まない過去の日付
      },
    }
  }

  // TODO_TABS_VALUES.ALLの場合やfilterがundefinedの場合は空のオブジェクトを返す（すべて表示）
  return {}
}
