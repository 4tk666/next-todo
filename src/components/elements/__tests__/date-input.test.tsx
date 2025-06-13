import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DateInput } from '../date-input'

// react-datepicker の CSS インポートをモック化
vi.mock('react-datepicker/dist/react-datepicker.css', () => ({
  default: {},
}))

describe('DateInput コンポーネント', () => {
  const defaultProps = {
    name: 'test-date',
    id: 'test-date-input',
  }

  describe('基本的なレンダリング', () => {
    it('日付入力フィールドが正しく表示されること', () => {
      render(<DateInput {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('id', 'test-date-input')
    })
  })

  describe('初期値の設定', () => {
    it('defaultValueが設定された場合、初期値が正しく表示されること', () => {
      const testDate = '2025-06-01T10:30:00.000Z'
      render(<DateInput {...defaultProps} defaultValue={testDate} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('2025/06/01')
    })

    it('defaultValueが空の場合、フィールドは空で表示されること', () => {
      render(<DateInput {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })

    it('無効なdefaultValueが指定された場合、フィールドは空で表示されること', () => {
      render(<DateInput {...defaultProps} defaultValue="invalid-date" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })
  })

  describe('日付フォーマット', () => {
    it('カスタムフォーマットが正しく適用されること', () => {
      // 日本のタイムゾーンを考慮した日付を使用
      const testDate = '2025-06-01T06:30:00.000Z' // UTC時間で指定してJST 15:30になるように調整
      render(
        <DateInput
          {...defaultProps}
          defaultValue={testDate}
          format="yyyy/MM/dd HH:mm"
        />,
      )

      const input = screen.getByRole('textbox') as HTMLInputElement
      // 実際に表示される値を確認（タイムゾーンの影響を考慮）
      expect(input.value).toMatch(/2025\/06\/01 \d{2}:\d{2}/)
    })

    it('デフォルトフォーマット（yyyy/MM/dd）が適用されること', () => {
      const testDate = '2025-12-25T00:00:00.000Z' // UTCで日付のみを指定
      render(<DateInput {...defaultProps} defaultValue={testDate} />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toMatch(/2025\/12\/25/)
    })
  })

  describe('エラー表示', () => {
    it('エラーがある場合、入力フィールドにエラースタイルが適用されること', () => {
      const errors = ['エラーメッセージ']
      render(
        <DateInput {...defaultProps} hasError={errors && errors.length > 0} />,
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-red-300')
      expect(input).toHaveClass('focus-visible:outline-red-600')
    })

    it('エラーがない場合、通常のスタイルが適用されること', () => {
      render(<DateInput {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-gray-300')
      expect(input).toHaveClass('focus-visible:outline-indigo-600')
    })
  })

  describe('無効状態', () => {
    it('disabled状態が正しく適用されること', () => {
      render(<DateInput {...defaultProps} disabled />)

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('disabled状態で適切なスタイルが適用されること', () => {
      render(<DateInput {...defaultProps} disabled />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('disabled:cursor-not-allowed')
      expect(input).toHaveClass('disabled:bg-gray-50')
      expect(input).toHaveClass('disabled:text-gray-500')
    })
  })

  describe('カスタムクラス', () => {
    it('追加のCSSクラスが正しく適用されること', () => {
      render(<DateInput {...defaultProps} className="custom-class" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-class')
    })
  })

  describe('アクセシビリティ', () => {
    it('フォーカス時に適切なアウトラインが表示されること', () => {
      render(<DateInput {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('focus-visible:outline-2')
      expect(input).toHaveClass('focus-visible:outline-offset-2')
    })
  })
})
