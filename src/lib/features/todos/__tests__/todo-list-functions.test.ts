import { describe, expect, it } from 'vitest'
import { createExpandedTodoIds } from '../todo-list-functions'

describe('createExpandedTodoIds', () => {
  it('新しいIDを空の配列に追加できる', () => {
    const result = createExpandedTodoIds({
      previousIds: [],
      todoId: 'todo-1',
    })

    expect(result).toEqual(['todo-1'])
  })

  it('新しいIDを既存の配列に追加できる', () => {
    const result = createExpandedTodoIds({
      previousIds: ['todo-1', 'todo-2'],
      todoId: 'todo-3',
    })

    expect(result).toEqual(['todo-1', 'todo-2', 'todo-3'])
  })

  it('既存のIDがある場合は削除する', () => {
    const result = createExpandedTodoIds({
      previousIds: ['todo-1', 'todo-2', 'todo-3'],
      todoId: 'todo-2',
    })

    expect(result).toEqual(['todo-1', 'todo-3'])
  })

  it('配列の最初の要素を削除できる', () => {
    const result = createExpandedTodoIds({
      previousIds: ['todo-1', 'todo-2', 'todo-3'],
      todoId: 'todo-1',
    })

    expect(result).toEqual(['todo-2', 'todo-3'])
  })

  it('配列の最後の要素を削除できる', () => {
    const result = createExpandedTodoIds({
      previousIds: ['todo-1', 'todo-2', 'todo-3'],
      todoId: 'todo-3',
    })

    expect(result).toEqual(['todo-1', 'todo-2'])
  })

  it('単一要素の配列から要素を削除して空配列を返す', () => {
    const result = createExpandedTodoIds({
      previousIds: ['todo-1'],
      todoId: 'todo-1',
    })

    expect(result).toEqual([])
  })

  it('元の配列を変更しない（不変性を保つ）', () => {
    const originalArray = ['todo-1', 'todo-2']
    const result = createExpandedTodoIds({
      previousIds: originalArray,
      todoId: 'todo-3',
    })

    // 元の配列は変更されていない
    expect(originalArray).toEqual(['todo-1', 'todo-2'])
    // 新しい配列が返される
    expect(result).toEqual(['todo-1', 'todo-2', 'todo-3'])
    // 異なるオブジェクト参照である
    expect(result).not.toBe(originalArray)
  })

  it('重複したIDがあっても正しく動作する', () => {
    // 通常は発生しないケースだが、防御的なテスト
    const result = createExpandedTodoIds({
      previousIds: ['todo-1', 'todo-2', 'todo-1'],
      todoId: 'todo-1',
    })

    // filter()は全ての'todo-1'を削除する
    expect(result).toEqual(['todo-2'])
  })

  it('空文字列のIDも正しく処理する', () => {
    const result = createExpandedTodoIds({
      previousIds: ['todo-1', ''],
      todoId: '',
    })

    expect(result).toEqual(['todo-1'])
  })

  it('数値的な文字列IDも正しく処理する', () => {
    const result = createExpandedTodoIds({
      previousIds: ['1', '2', '3'],
      todoId: '2',
    })

    expect(result).toEqual(['1', '3'])
  })
})
