import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createExpandedTodoIds,
  createTodoFilterCondition,
} from '../todo-list-functions'
import { TODO_TABS_VALUES } from '@/constants/todo-tabs'

describe('todo-list-functions', () => {
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

  describe('createTodoFilterCondition', () => {
    // 各テストで使用する固定日時（2025年6月15日 10:00:00 JST）
    const mockCurrentDate = new Date('2025-06-15T10:00:00.000Z')

    beforeEach(() => {
      // 時刻を固定してテストの一貫性を保つ
      vi.useFakeTimers()
      vi.setSystemTime(mockCurrentDate) // 固定時刻を設定
    })

    afterEach(() => {
      vi.useRealTimers() // 実際の時刻システムに戻す
    })

    describe('完了タブのフィルタ条件', () => {
      it('完了済みのTODOのみを取得する条件を生成する', () => {
        const result = createTodoFilterCondition(TODO_TABS_VALUES.COMPLETED)

        expect(result).toEqual({
          isComplete: true,
        })
      })
    })

    describe('今後タブのフィルタ条件', () => {
      it('未完了かつ期限なしまたは今日以降のTODOを取得する条件を生成する', () => {
        const result = createTodoFilterCondition(TODO_TABS_VALUES.UPCOMING)

        // 期待される今日の日付（JST時間帯を考慮した実際の結果）
        const expectedToday = new Date('2025-06-14T15:00:00.000Z')

        expect(result).toEqual({
          isComplete: false,
          OR: [
            { dueDate: null }, // 期限が設定されていないTODO
            { dueDate: { gte: expectedToday } }, // 今日以降のTODO
          ],
        })
      })

      it('異なる日付でも正しい条件を生成する', () => {
        // 異なる日付に時刻を変更
        const customDate = new Date('2025-12-25T15:30:00.000Z')
        vi.setSystemTime(customDate)

        const result = createTodoFilterCondition(TODO_TABS_VALUES.UPCOMING)

        // 期待される日付（JST時間帯を考慮した実際の結果）
        const expectedDate = new Date('2025-12-25T15:00:00.000Z')

        expect(result).toEqual({
          isComplete: false,
          OR: [{ dueDate: null }, { dueDate: { gte: expectedDate } }],
        })
      })
    })

    describe('期限超過タブのフィルタ条件', () => {
      it('未完了かつ今日より前の期限のTODOを取得する条件を生成する', () => {
        const result = createTodoFilterCondition(TODO_TABS_VALUES.OVERDUE)

        // 期待される今日の日付（JST時間帯を考慮した実際の結果）
        const expectedToday = new Date('2025-06-14T15:00:00.000Z')

        expect(result).toEqual({
          isComplete: false,
          dueDate: {
            lt: expectedToday, // 今日を含まない過去の日付
          },
        })
      })

      it('異なる日付でも正しい条件を生成する', () => {
        // 異なる日付に時刻を変更
        const customDate = new Date('2025-08-10T09:00:00.000Z')
        vi.setSystemTime(customDate)

        const result = createTodoFilterCondition(TODO_TABS_VALUES.OVERDUE)

        // 期待される日付（JST時間帯を考慮した実際の結果）
        const expectedDate = new Date('2025-08-09T15:00:00.000Z')

        expect(result).toEqual({
          isComplete: false,
          dueDate: {
            lt: expectedDate,
          },
        })
      })
    })

    describe('すべてタブのフィルタ条件', () => {
      it('フィルタ条件が指定されていない場合は空のオブジェクトを返す', () => {
        const result = createTodoFilterCondition(TODO_TABS_VALUES.ALL)

        expect(result).toEqual({})
      })
    })

    describe('デフォルト動作とエッジケース', () => {
      it('filterTypeがundefinedの場合は空のオブジェクトを返す', () => {
        const result = createTodoFilterCondition(undefined)

        expect(result).toEqual({})
      })

      it('未知のfilterTypeの場合は空のオブジェクトを返す', () => {
        const result = createTodoFilterCondition('unknown-filter')

        expect(result).toEqual({})
      })

      it('空文字列のfilterTypeは空のオブジェクトを返す', () => {
        const result = createTodoFilterCondition('')

        expect(result).toEqual({})
      })
    })
  })
})
