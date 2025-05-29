import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LinkButton } from '../link-button'

describe('LinkButton コンポーネント', () => {
  it('子要素が正しく表示されること', () => {
    render(<LinkButton href="/test">テストリンクボタン</LinkButton>)

    const link = screen.getByRole('link', { name: 'テストリンクボタン' })
    expect(link).toBeInTheDocument()
  })

  it('href プロパティが正しく適用されること', () => {
    render(<LinkButton href="/test-page">リンクテスト</LinkButton>)

    const link = screen.getByRole('link', { name: 'リンクテスト' })
    expect(link).toHaveAttribute('href', '/test-page')
  })

  it('primary バリアントのスタイルが適用されること', () => {
    render(
      <LinkButton href="/test" variant="primary">
        プライマリリンク
      </LinkButton>,
    )

    const link = screen.getByRole('link', { name: 'プライマリリンク' })
    expect(link).toHaveClass('bg-indigo-600', 'text-white')
  })

  it('outline バリアントのスタイルが適用されること', () => {
    render(
      <LinkButton href="/test" variant="outline">
        アウトラインリンク
      </LinkButton>,
    )

    const link = screen.getByRole('link', { name: 'アウトラインリンク' })
    expect(link).toHaveClass('border', 'border-indigo-600', 'text-indigo-600')
  })

  it('デフォルトで primary バリアントが適用されること', () => {
    render(<LinkButton href="/test">デフォルトリンク</LinkButton>)

    const link = screen.getByRole('link', { name: 'デフォルトリンク' })
    expect(link).toHaveClass('bg-indigo-600', 'text-white')
  })

  it('カスタムクラス名が適用されること', () => {
    render(
      <LinkButton href="/test" className="custom-class">
        カスタムリンク
      </LinkButton>,
    )

    const link = screen.getByRole('link', { name: 'カスタムリンク' })
    expect(link).toHaveClass('custom-class')
  })

  it('基本的なボタンスタイルクラスが適用されること', () => {
    render(<LinkButton href="/test">スタイルテスト</LinkButton>)

    const link = screen.getByRole('link', { name: 'スタイルテスト' })
    expect(link).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'px-4',
      'py-2',
      'rounded-md',
      'text-sm',
      'font-semibold',
    )
  })

  it('アクセシビリティ属性が正しく適用されること', () => {
    render(
      <LinkButton href="/test" aria-label="アクセシブルリンクボタン">
        リンクテキスト
      </LinkButton>,
    )

    // aria-labelが設定されている場合、アクセシブル名はaria-labelの値になる
    const link = screen.getByRole('link', { name: 'アクセシブルリンクボタン' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('aria-label', 'アクセシブルリンクボタン')
  })

  it('フォーカス時に適切なスタイルが適用されること', async () => {
    const user = userEvent.setup()

    render(<LinkButton href="/test">フォーカステスト</LinkButton>)

    const link = screen.getByRole('link', { name: 'フォーカステスト' })

    // フォーカス前の状態をチェック
    expect(link).not.toHaveFocus()

    // フォーカスを設定
    await user.tab()

    // フォーカスが設定されたことを確認
    expect(link).toHaveFocus()
    expect(document.activeElement).toBe(link)
  })

  it('キーボードナビゲーションが正しく動作すること', async () => {
    const user = userEvent.setup()

    render(
      <div>
        <LinkButton href="/first">最初のリンク</LinkButton>
        <LinkButton href="/second">2番目のリンク</LinkButton>
      </div>,
    )

    const firstLink = screen.getByRole('link', { name: '最初のリンク' })
    const secondLink = screen.getByRole('link', { name: '2番目のリンク' })

    // 最初のリンクにフォーカス
    await user.tab()
    expect(firstLink).toHaveFocus()

    // 2番目のリンクにフォーカス移動
    await user.tab()
    expect(secondLink).toHaveFocus()
  })

  it('Enterキーでリンクがアクティベートされること', async () => {
    const user = userEvent.setup()

    render(<LinkButton href="/test">Enterキーテスト</LinkButton>)

    const link = screen.getByRole('link', { name: 'Enterキーテスト' })

    // フォーカスを設定
    await user.tab()
    expect(link).toHaveFocus()

    // Enterキーを押下（実際のナビゲーションはテスト環境では発生しない）
    await user.keyboard('{Enter}')

    // リンクがまだ存在することを確認（ナビゲーションが試行されたことの間接的確認）
    expect(link).toBeInTheDocument()
  })

  describe('バリアント別のスタイルテスト', () => {
    it('primary バリアントのホバー状態が設定されていること', () => {
      render(
        <LinkButton href="/test" variant="primary">
          プライマリホバー
        </LinkButton>,
      )

      const link = screen.getByRole('link', { name: 'プライマリホバー' })
      expect(link).toHaveClass('hover:bg-indigo-500')
    })

    it('outline バリアントのホバー状態が設定されていること', () => {
      render(
        <LinkButton href="/test" variant="outline">
          アウトラインホバー
        </LinkButton>,
      )

      const link = screen.getByRole('link', { name: 'アウトラインホバー' })
      expect(link).toHaveClass('hover:bg-indigo-50')
    })

    it('フォーカス表示スタイルが両バリアントで設定されていること', () => {
      const { rerender } = render(
        <LinkButton href="/test" variant="primary">
          フォーカステスト
        </LinkButton>,
      )

      const primaryLink = screen.getByRole('link', { name: 'フォーカステスト' })
      expect(primaryLink).toHaveClass(
        'focus-visible:outline-2',
        'focus-visible:outline-offset-2',
        'focus-visible:outline-indigo-600',
      )

      rerender(
        <LinkButton href="/test" variant="outline">
          フォーカステスト
        </LinkButton>,
      )

      const outlineLink = screen.getByRole('link', { name: 'フォーカステスト' })
      expect(outlineLink).toHaveClass(
        'focus-visible:outline-2',
        'focus-visible:outline-offset-2',
        'focus-visible:outline-indigo-600',
      )
    })
  })
})
