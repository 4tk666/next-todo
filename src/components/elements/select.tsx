'use client'

import * as RadSelect from '@radix-ui/react-select'
import { clsx } from 'clsx'
import { FiChevronDown, FiCheck } from 'react-icons/fi'

export type SelectOption = {
  /** オプションの値 */
  value: string
  /** オプションのラベル */
  label: string
  /** オプションが無効かどうか */
  disabled?: boolean
}

export type SelectProps = {
  /** フィールドの一意識別子 */
  id: string
  /** フィールド名（フォーム送信時のキー） */
  name: string
  /** 選択可能なオプション */
  options: SelectOption[]
  /** プレースホルダーテキスト */
  placeholder?: string
  /** デフォルト値 */
  defaultValue?: string
  /** 現在の値 */
  value?: string
  /** 値が変更された時のコールバック */
  onValueChange?: (value: string) => void
  /** 無効状態かどうか */
  disabled?: boolean
  /** 必須フィールドかどうか */
  required?: boolean
}

/**
 * セレクトボックスコンポーネント（Radix UI Select使用）
 * アクセシビリティを考慮した再利用可能なセレクトコンポーネント
 */
export function Select({
  id,
  name,
  options,
  placeholder = "選択してください",
  defaultValue,
  value,
  onValueChange,
  disabled = false,
  required = false,
}: SelectProps) {
  return (
    <RadSelect.Root
      name={name}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
    >
      <RadSelect.Trigger
        id={id}
        className={clsx(
          // レイアウト・配置
          'flex items-center justify-between',
          'w-full',
          // サイズ・間隔
          'px-3 py-2',
          // ボーダー・装飾
          'border rounded-md shadow-sm border-gray-300',
          // 色・テキスト
          'bg-white text-sm text-gray-900',
          'placeholder:text-gray-400',
          // 状態・インタラクション
          'hover:border-gray-400',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          // アニメーション・トランジション
          'transition-colors duration-200',
        )}
      >
        <RadSelect.Value placeholder={placeholder} />
        <RadSelect.Icon asChild>
          <FiChevronDown className="h-4 w-4 text-gray-400" />
        </RadSelect.Icon>
      </RadSelect.Trigger>

      <RadSelect.Portal>
        <RadSelect.Content
          className={clsx(
            // レイアウト・配置
            'relative z-50',
            // サイズ・間隔
            'min-w-32 max-h-96',
            // ボーダー・装飾
            'bg-white border border-gray-200 rounded-md shadow-lg',
            // アニメーション・トランジション
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          )}
          position="popper"
          sideOffset={4}
        >
          <RadSelect.ScrollUpButton className="flex cursor-default items-center justify-center h-[25px] bg-white text-gray-600">
            <FiChevronDown className="rotate-180" />
          </RadSelect.ScrollUpButton>

          <RadSelect.Viewport className="p-1">
            {options.map((option) => (
              <RadSelect.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={clsx(
                  // レイアウト・配置
                  'relative flex items-center',
                  // サイズ・間隔
                  'px-8 py-2',
                  // ボーダー・装飾
                  'rounded-sm',
                  // 色・テキスト
                  'text-sm text-gray-900',
                  'select-none outline-none',
                  // 状態・インタラクション
                  'data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-900',
                  'data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none',
                  // カーソルスタイル
                  'cursor-pointer data-[disabled]:cursor-not-allowed',
                )}
              >
                <RadSelect.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <FiCheck className="h-4 w-4" />
                </RadSelect.ItemIndicator>
                <RadSelect.ItemText>
                  {option.label}
                </RadSelect.ItemText>
              </RadSelect.Item>
            ))}
          </RadSelect.Viewport>

          <RadSelect.ScrollDownButton className="flex cursor-default items-center justify-center h-[25px] bg-white text-gray-600">
            <FiChevronDown />
          </RadSelect.ScrollDownButton>
        </RadSelect.Content>
      </RadSelect.Portal>
    </RadSelect.Root>
  )
}
