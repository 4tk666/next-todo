'use client'

import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { ja } from 'date-fns/locale'
import { cn } from '@/lib/utils/class-utils'

export type DateInputProps = {
  /** 日付フォーマット（例：'yyyy/MM/dd HH:mm'） */
  format?: string
  /**  エラー状態の判定 */
  hasError?: boolean
  /** フォーム送信用のname属性 */
  name: string
  /** デフォルト値（ISO文字列形式） */
  defaultValue?: string
  /** 入力フィールドのid属性 */
  id?: string
  /** 追加のCSSクラス名 */
  className?: string
  /** 無効状態かどうか */
  disabled?: boolean
}

/**
 * 日付入力フィールドコンポーネント
 *
 * react-datepickerを使用したカスタマイズ可能な日付選択フィールドです。
 * フォーム送信、エラー表示、日本語対応を含みます。
 *
 * @param props - DateInputのプロパティ
 * @returns 日付入力フィールドコンポーネント
 */
export function DateInput({
  format = 'yyyy/MM/dd',
  className,
  disabled = false,
  hasError,
  id,
  name,
  defaultValue,
}: DateInputProps) {
  // 選択された日付の状態管理
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (!defaultValue) return null

    const parsedDate = new Date(defaultValue)
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
  })

  return (
    <div className="relative w-[200px] text-gray-700">
      <DatePicker
        id={id}
        name={name}
        selected={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        dateFormat={format}
        locale={ja}
        disabled={disabled}
        wrapperClassName="w-full"
        className={cn(
          // レイアウト・サイズ
          'block w-full',
          'px-3 py-2',
          // ボーダー・装飾
          'border rounded-md shadow-sm',
          hasError ? 'border-red-300' : 'border-gray-300',
          // 色・テキスト
          'text-sm placeholder-gray-400',
          'bg-white',
          // 状態・インタラクション
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          hasError
            ? 'focus-visible:outline-red-600'
            : 'focus-visible:outline-indigo-600',
          // 無効状態
          'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200',
          className,
        )}
      />
    </div>
  )
}
