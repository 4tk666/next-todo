import { describe, it, expect } from 'vitest'
import { createDate, parseStringToDate, parseDateToString } from '../date-utils'

describe('date-utils', () => {
  const testDate = new Date('2025-06-03T10:30:00.000Z')

  describe('createDate', () => {
    it('現在の日時を返す', () => {
      const result = createDate()
      expect(result).toBeInstanceOf(Date)
    })
  })

  describe('parseStringToDate', () => {
    it('yyyy/MM/dd形式の日付文字列をDateオブジェクトに変換する', () => {
      const result = parseStringToDate({ dateString: '2025/06/03' })
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2025)
      expect(result?.getMonth()).toBe(5) // 0ベースなので6月は5
      expect(result?.getDate()).toBe(3)
    })

    it('デフォルトフォーマット以外は変換できない', () => {
      // デフォルトは 'yyyy/MM/dd' なので ISO形式は変換失敗
      const result = parseStringToDate({ dateString: '2025-06-03' })
      expect(result).toBeUndefined()
    })

    it('フォーマット指定時は指定フォーマットで変換する', () => {
      const result = parseStringToDate({
        dateString: '2025/01/05 08:40:05',
        formatType: 'yyyy/MM/dd HH:mm:ss',
      })
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2025)
      expect(result?.getMonth()).toBe(0)
      expect(result?.getDate()).toBe(5)
    })

    it('英語形式は変換できない（フォーマット不一致）', () => {
      const result = parseStringToDate({ dateString: 'June 3, 2025' })
      expect(result).toBeUndefined()
    })

    it('無効な日付文字列の場合はundefinedを返す', () => {
      const result = parseStringToDate({ dateString: 'invalid-date' })
      expect(result).toBeUndefined()
    })

    it('空文字列の場合はundefinedを返す', () => {
      const result = parseStringToDate({ dateString: '' })
      expect(result).toBeUndefined()
    })

    it('存在しない日付の場合はundefinedを返す', () => {
      const result = parseStringToDate({ dateString: '2025/02/30' })
      expect(result).toBeUndefined()
    })
  })

  describe('parseDateToString', () => {
    it('Dateオブジェクトをデフォルト形式（yyyy/MM/dd）でフォーマットする', () => {
      const result = parseDateToString({ date: testDate })
      expect(result).toBe('2025/06/03')
    })

    it('指定したフォーマットでDateをフォーマットする', () => {
      const result = parseDateToString({
        date: testDate,
        formatType: 'yyyy/MM/dd HH:mm:ss',
      })
      // タイムゾーンの影響を考慮して、基本的な構造をチェック
      expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/)
      expect(result).toContain('2025/06/03')
    })

    it('年月のみのフォーマットを適用する', () => {
      const result = parseDateToString({
        date: testDate,
        formatType: 'yyyy/MM',
      })
      expect(result).toBe('2025/06')
    })

    it('無効なDateオブジェクトの場合はエラーメッセージを返す', () => {
      const invalidDate = new Date('invalid-date')
      const result = parseDateToString({ date: invalidDate })
      expect(result).toBe('error: Invalid date')
    })
  })
})
