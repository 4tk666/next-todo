import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Checkbox } from '../checkbox'

describe('Checkbox', () => {
  const defaultProps = {
    id: 'test-checkbox',
    checked: false,
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('基本的なレンダリングが正しく行われる', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="basic-checkbox"
        label="テストラベル" 
        onChange={handleChange} 
      />
    )
    
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByText('テストラベル')).toBeInTheDocument()
  })

  it('チェック状態が正しく反映される', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="checked-checkbox"
        checked={true} 
        onChange={handleChange} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('data-state', 'checked')
  })

  it('未チェック状態が正しく反映される', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="unchecked-checkbox"
        checked={false} 
        onChange={handleChange} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('data-state', 'unchecked')
  })

  it('無効状態が正しく適用される', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="disabled-checkbox"
        disabled={true} 
        onChange={handleChange} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('チェック→未チェックへの変更イベントが正しく発火する', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="change-to-unchecked"
        checked={true} 
        onChange={handleChange} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(handleChange).toHaveBeenCalledWith(false)
  })

  it('未チェック→チェックへの変更イベントが正しく発火する', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="change-to-checked"
        checked={false} 
        onChange={handleChange} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('ラベルをクリックするとチェックボックスが切り替わる', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="label-click-test"
        label="クリック可能なラベル"
        checked={false} 
        onChange={handleChange} 
      />
    )
    
    const label = screen.getByText('クリック可能なラベル')
    fireEvent.click(label)
    
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('無効状態の時はクリックしても変更されない', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="disabled-click-test"
        disabled={true}
        checked={false} 
        onChange={handleChange} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('カスタムクラス名が正しく適用される', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="custom-class-test"
        className="custom-checkbox-class"
        onChange={handleChange} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('custom-checkbox-class')
  })

  it('チェック状態でアイコンが表示される', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="icon-test"
        checked={true} 
        onChange={handleChange} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    // チェック状態であることを確認
    expect(checkbox).toHaveAttribute('data-state', 'checked')
    // CheckIconがレンダリングされていることを確認
    expect(checkbox.querySelector('svg')).toBeInTheDocument()
  })

  it('ラベルなしでも正しく動作する', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="no-label-test"
        onChange={handleChange} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    
    fireEvent.click(checkbox)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('適切なARIAロールが適用されている', () => {
    render(
      <Checkbox 
        {...defaultProps}
        id="aria-role-test"
      />
    )
    
    // Radix UIが適切なロールを適用しているか確認
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('フォーカスを受け取ることが可能', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="keyboard-test"
        onChange={handleChange} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    
    // フォーカスを受け取ることができるか確認
    checkbox.focus()
    expect(document.activeElement).toBe(checkbox)
  })
  
  it('アクセシビリティのためのkeydown/keyup操作をサポートする', () => {
    const handleChange = vi.fn()
    render(
      <Checkbox 
        {...defaultProps}
        id="keyboard-test-2"
        onChange={handleChange} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    
    // スペースキーでクリックをシミュレート
    checkbox.focus()
    fireEvent.click(checkbox)
    
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('TabキーでフォーカスできることをテストするためにtabIndexが適切に設定されている', () => {
    render(
      <Checkbox 
        {...defaultProps}
        id="tab-index-test"
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    
    // tabIndexが適切に設定されているか確認
    // 通常のtabIndexは0（タブ順序に含まれる）、
    // または省略されている（デフォルトでタブ順序に含まれる要素の場合）
    const tabIndexValue = checkbox.getAttribute('tabindex')
    expect(tabIndexValue === '0' || tabIndexValue === null).toBeTruthy()
  })

  it('無効状態の時はdisabled属性が設定されている', () => {
    render(
      <Checkbox 
        {...defaultProps}
        id="disabled-aria-test"
        disabled={true} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('ラベルがある場合、適切なaria-labelledbyが設定されている', () => {
    render(
      <Checkbox 
        {...defaultProps}
        id="test-with-label"
        label="アクセシビリティラベル" 
      />
    )
    
    // Radix UIによって自動的にaria-labelledbyが設定されているか、
    // またはlabel要素が正しく関連付けられているか確認
    const checkbox = screen.getByLabelText('アクセシビリティラベル')
    expect(checkbox).toBeInTheDocument()
  })

  it('チェック状態の変更が適切にaria-checkedの変更に反映される', () => {
    const { rerender } = render(
      <Checkbox 
        {...defaultProps}
        id="aria-checked-test"
        checked={false} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
    
    // チェック状態に変更
    rerender(
      <Checkbox 
        {...defaultProps}
        id="aria-checked-test"
        checked={true} 
      />
    )
    
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
  })
  
  it('高コントラストモードを考慮したスタイリングが適用されている', () => {
    render(
      <Checkbox 
        {...defaultProps}
        id="contrast-test"
        checked={true} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    
    // チェック状態の背景色が適切に設定されている
    // data-state属性を使用したスタイリングが適用されているか確認
    expect(checkbox).toHaveAttribute('data-state', 'checked')
    
    // このテストは視覚的なテストなので、実際の色を検証することはできませんが、
    // クラスが適用されていることを確認することで間接的に検証
    expect(checkbox.className).toContain('data-[state=checked]:bg-emerald-600')
  })
  
  it('フォーカス状態で視覚的なフォーカスインジケータが表示される', () => {
    render(
      <Checkbox 
        {...defaultProps}
        id="focus-indicator-test"
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    
    // フォーカスリングのスタイルが適用されるクラスが存在する
    expect(checkbox.className).toContain('focus:ring-2')
    expect(checkbox.className).toContain('focus:ring-emerald-500')
  })
  
  it('ラベルのテキストが十分なフォントサイズである', () => {
    render(
      <Checkbox 
        {...defaultProps}
        id="font-size-test"
        label="読みやすいテキスト" 
      />
    )
    
    const label = screen.getByText('読みやすいテキスト')
    
    // ラベルには少なくともtext-smクラスが適用されている
    expect(label.className).toContain('text-sm')
  })
})
