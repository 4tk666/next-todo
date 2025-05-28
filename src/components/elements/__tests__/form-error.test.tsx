import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormError } from '../form-error'

describe('FormError コンポーネント', () => {
  it('エラーがない場合は何も表示されないこと', () => {
    const { container } = render(<FormError />)
    expect(container.firstChild).toBeNull()
  })

  it('空の配列の場合は何も表示されないこと', () => {
    const { container } = render(<FormError errors={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('単一のエラーメッセージが表示されること', () => {
    render(<FormError errors={['エラーメッセージ']} />)

    expect(screen.getByText('エラーメッセージ')).toBeInTheDocument()
  })

  it('複数のエラーメッセージが表示されること', () => {
    const errors = ['エラー1', 'エラー2', 'エラー3']
    render(<FormError errors={errors} />)

    errors.map((error) => {
      expect(screen.getByText(error)).toBeInTheDocument()
    })
  })

  it('各エラーメッセージが個別のp要素に表示されること', () => {
    const errors = ['エラー1', 'エラー2']
    render(<FormError errors={errors} />)

    const errorElements = screen.getAllByText(/エラー\d/)
    expect(errorElements).toHaveLength(2)

    errorElements.map((element) => {
      expect(element.tagName).toBe('P')
    })
  })

  // アクセシビリティテストの追加
  it('エラーメッセージがスクリーンリーダー向けに適切にマークアップされること', () => {
    render(<FormError errors={['入力エラー']} />)

    const errorContainer = screen.getByText('入力エラー').parentElement
    expect(errorContainer).toHaveAttribute('role', 'alert')
  })

  it('エラーメッセージが特定のフォーム要素に関連づけられること', () => {
    const testId = 'test-input-field'
    render(
      <div>
        <input data-testid={testId} aria-describedby="form-error" />
        <FormError errors={['必須項目です']} id="form-error" />
      </div>,
    )

    const errorContainer = screen.getByText('必須項目です').parentElement
    expect(errorContainer).toHaveAttribute('id', 'form-error')

    const inputField = screen.getByTestId(testId)
    expect(inputField).toHaveAttribute('aria-describedby', 'form-error')
  })
})
