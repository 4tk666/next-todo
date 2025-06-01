'use client'

import { clsx } from 'clsx'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { ja } from 'date-fns/locale'
import { FormError } from './form-error'
import { cn } from '@/lib/utils/class-utils'

type DateInputProps = {
  /** 日付フォーマット（例：'yyyy/MM/dd HH:mm'） */
  format?: string
  /** エラーメッセージの配列 */
  errors?: string[]
  /** ラベルテキスト */
  label?: string
  /** プレースホルダーテキスト */
  placeholder?: string
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
  errors,
  label,
  id,
  name,
  defaultValue,
}: DateInputProps) {
  // エラー状態の判定
  const hasError = errors && errors.length > 0

  // 選択された日付の状態管理
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (!defaultValue) return null

    const parsedDate = new Date(defaultValue)
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
  })

  return (
    <div className="w-full">
      {/* ラベル部分 */}
      {label && (
        <div className="mb-2">
          <label
            htmlFor={id}
            className={clsx(
              // レイアウト・配置
              'block',
              // 色・テキスト
              'text-sm font-medium text-gray-700',
            )}
          >
            {label}
          </label>
        </div>
      )}

      {/* 日付選択部分 */}
      <div className="relative w-[200px] text-gray-700">
        <DatePicker
          id={id}
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

        {/* フォーム送信用の隠しinput */}
        <input
          type="hidden"
          name={name}
          value={selectedDate?.toISOString() ?? ''}
        />
      </div>

      {/* エラーメッセージ */}
      <FormError errors={errors} id={id} />
    </div>
  )
}
