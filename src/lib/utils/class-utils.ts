import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSSのクラス名を適切にマージするユーティリティ関数
 * 
 * この関数は clsx と tailwind-merge を組み合わせて、
 * Tailwind CSSのクラス名を競合なくマージします。
 * 
 * @param inputs - マージするクラス名の配列、オブジェクト、または文字列
 * @returns マージされたクラス名の文字列
 * 
 * @example
 * ```typescript
 * // 基本的な使用法
 * cn('px-2 py-1', 'bg-blue-500', 'text-white')
 * // => 'px-2 py-1 bg-blue-500 text-white'
 * 
 * // 条件付きクラス
 * cn('px-2 py-1', {
 *   'bg-blue-500': isActive,
 *   'bg-gray-300': !isActive
 * })
 * 
 * // 競合するクラスの解決（後のクラスが優先される）
 * cn('px-2 px-4', 'py-1 py-2')
 * // => 'px-4 py-2'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
