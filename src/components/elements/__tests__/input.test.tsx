import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from '../input'

describe('Input コンポーネント', () => {
  const testId = 'test-input'
  const testPlaceholder = 'テスト入力欄'

  it('基本的なプロパティが正しく適用されること', () => {
    render(<Input id={testId} placeholder={testPlaceholder} />)

    const input = screen.getByPlaceholderText(testPlaceholder)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', testId)
    expect(input).toHaveAttribute('name', testId)
    expect(input).toHaveAttribute('type', 'text')
  })

  it('タイプ属性が正しく適用されること', () => {
    render(<Input id={testId} type="email" />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('name属性がカスタム設定できること', () => {
    const customName = 'custom-name'
    render(<Input id={testId} name={customName} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', customName)
  })

  it('defaultValueが正しく設定されること', () => {
    const defaultValue = 'デフォルト値'
    render(<Input id={testId} defaultValue={defaultValue} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue(defaultValue)
  })

  it('valueが正しく設定されること', () => {
    const value = '設定値'
    render(<Input id={testId} value={value} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue(value)
  })

  it('onChangeが正しく呼び出されること', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Input id={testId} onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'テスト入力')

    expect(handleChange).toHaveBeenCalled()
  })

  it('disabledが正しく適用されること', () => {
    render(<Input id={testId} disabled />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('エラーがある場合、aria-invalid属性が設定されること', () => {
    render(<Input id={testId} errors={['エラーメッセージ']} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('エラーがない場合、aria-invalid属性が設定されないこと', () => {
    render(<Input id={testId} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('エラーがある場合、aria-describedby属性が設定されること', () => {
    render(<Input id={testId} errors={['エラーメッセージ']} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-describedby', `${testId}-error`)
  })

  it('エラーがない場合、aria-describedby属性が設定されないこと', () => {
    render(<Input id={testId} />)

    const input = screen.getByRole('textbox')
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  it('エラー時にエラースタイルが適用されること', () => {
    render(<Input id={testId} errors={['エラーメッセージ']} />)

    const input = screen.getByRole('textbox')
    expect(input.className).toContain('border-red-500')
  })

  it('追加のクラス名が適用されること', () => {
    const additionalClass = 'custom-class'
    render(<Input id={testId} className={additionalClass} />)

    const input = screen.getByRole('textbox')
    expect(input.className).toContain(additionalClass)
  })
})
