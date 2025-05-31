export function createExpandedTodoIds({
  previousIds,
  todoId,
}: { previousIds: string[]; todoId: string }): string[] {
  const newTodoIds = previousIds.includes(todoId)
    ? previousIds.filter((id) => id !== todoId) // IDが存在する場合は削除
    : [...previousIds, todoId] // 存在しない場合は追加

  return newTodoIds
}
