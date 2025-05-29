import { describe, expect, it } from 'vitest'
import { cn } from '../class-utils'

describe('cn (class-utils)', () => {
  it('基本的な文字列を連結できる', () => {
    const result = cn('px-2 py-1', 'bg-blue-500', 'text-white')
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
    expect(result).toContain('bg-blue-500')
    expect(result).toContain('text-white')
  })

  it('条件付きクラスを処理できる', () => {
    const isActive = true
    const result = cn('px-2 py-1', {
      'bg-blue-500': isActive,
      'bg-gray-300': !isActive,
    })
    expect(result).toContain('bg-blue-500')
    expect(result).not.toContain('bg-gray-300')
  })

  it('falseな条件のクラスを除外する', () => {
    const isActive = false
    const result = cn('px-2 py-1', {
      'bg-blue-500': isActive,
      'bg-gray-300': !isActive,
    })
    expect(result).toContain('bg-gray-300')
    expect(result).not.toContain('bg-blue-500')
  })

  it('競合するTailwindクラスを適切にマージする', () => {
    // 同じプロパティのクラスは後のものが優先される
    const result = cn('px-2 px-4', 'py-1 py-2')
    expect(result).toContain('px-4')
    expect(result).toContain('py-2')
    expect(result).not.toContain('px-2')
    expect(result).not.toContain('py-1')
  })

  it('undefinedやnullを適切に処理する', () => {
    const result = cn('px-2', undefined, null, 'py-1')
    expect(result).toBe('px-2 py-1')
  })

  it('空の配列や空文字列を処理する', () => {
    const result = cn('', 'px-2', [], 'py-1')
    expect(result).toBe('px-2 py-1')
  })

  it('複雑なクラスの組み合わせをマージする', () => {
    const result = cn(
      'rounded-md border',
      'px-4 py-2',
      'text-sm font-medium',
      'focus:outline-none focus:ring-2',
      {
        'bg-blue-600 text-white': true,
        'hover:bg-blue-700': true,
        'disabled:opacity-50': false,
      }
    )
    
    expect(result).toContain('rounded-md')
    expect(result).toContain('border')
    expect(result).toContain('px-4')
    expect(result).toContain('py-2')
    expect(result).toContain('bg-blue-600')
    expect(result).toContain('text-white')
    expect(result).toContain('hover:bg-blue-700')
    expect(result).not.toContain('disabled:opacity-50')
  })
})
