import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Button } from '../button'

describe('Button コンポーネント', () => {
  it('子要素が正しく表示されること', () => {
    render(<Button>テストボタン</Button>)

    const button = screen.getByRole('button', { name: 'テストボタン' })
    expect(button).toBeInTheDocument()
  })

  it('disabled プロパティが正しく適用されること', () => {
    render(<Button disabled>無効ボタン</Button>)

    const button = screen.getByRole('button', { name: '無効ボタン' })
    expect(button).toBeDisabled()
  })

  it('type プロパティが正しく適用されること', () => {
    render(<Button type="submit">送信ボタン</Button>)

    const button = screen.getByRole('button', { name: '送信ボタン' })
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('デフォルトで type="button" が設定されること', () => {
    render(<Button>デフォルトボタン</Button>)

    const button = screen.getByRole('button', { name: 'デフォルトボタン' })
    expect(button).toHaveAttribute('type', 'button')
  })

  it('カスタムクラス名が適用されること', () => {
    render(<Button className="custom-class">カスタムボタン</Button>)

    const button = screen.getByRole('button', { name: 'カスタムボタン' })
    expect(button).toHaveClass('custom-class')
  })

  // アクセシビリティテストの追加
  it('aria-label 属性が正しく適用されること', () => {
    render(<Button aria-label="アクセシブルボタン">ボタンテキスト</Button>)

    const button = screen.getByRole('button', { name: 'アクセシブルボタン' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'アクセシブルボタン')
  })

  it('aria-disabled 属性が正しく適用されること', () => {
    render(<Button aria-disabled="true">アクセシビリティテスト</Button>)

    const button = screen.getByRole('button', {
      name: 'アクセシビリティテスト',
    })
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('フォーカス時に適切なスタイルが適用されること', async () => {
    // userEventのセットアップ
    const user = userEvent.setup()

    render(<Button>フォーカステスト</Button>)

    const button = screen.getByRole('button', { name: 'フォーカステスト' })

    // フォーカス前の状態をチェック
    expect(button).not.toHaveFocus()

    // フォーカスを設定
    await user.tab()

    // フォーカスが設定されたことを確認
    expect(button).toHaveFocus()

    // フォーカス時のスタイルをチェック（document.activeElement との比較）
    expect(document.activeElement).toBe(button)
  })
})
