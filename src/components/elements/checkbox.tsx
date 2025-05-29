import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { FaCheck } from 'react-icons/fa'
import { clsx } from 'clsx'
import { cn } from '@/lib/utils/class-utils'


type CheckboxProps = {
  id: string
  /** チェックボックスのラベル */
  label?: string
  name?: string
  /** チェック状態 */
  checked: boolean
  /** 無効状態 */
  disabled?: boolean
  /** 変更時のコールバック */
  onChange: (checked: boolean) => void
  /** クラス名 */
  className?: string
}

/**
 * チェックボックスコンポーネント
 * アクセシビリティとユーザビリティを考慮した再利用可能なチェックボックス
 * Radix UIを使用してより良いアクセシビリティを提供
 * キャプチャに合わせた緑色の円形チェックボックス
 */
export function Checkbox({
  id,
  name,
  label,
  checked,
  disabled,
  onChange,
  className,
}: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <CheckboxPrimitive.Root
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(checkedState) => {
          onChange(!!checkedState)
        }}
        className={cn(
          // レイアウト・配置
          'flex items-center justify-center',
          // サイズ・間隔
          'h-5 w-5',
          // ボーダー・装飾
          'border-2 border-gray-300 rounded-full',
          'shadow-sm',
          // 色・テキスト
          'bg-white',
          'data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600',
          // 状態・インタラクション
          'hover:border-emerald-400',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // アニメーション・トランジション
          'transition-colors duration-200',
          className,
        )}
      >
        <CheckboxPrimitive.Indicator
          className={clsx(
            // レイアウト・配置
            'flex items-center justify-center',
            // 色・テキスト
            'text-white',
          )}
        >
          <FaCheck className="h-2.5 w-2.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            // 色・テキスト
            'text-sm font-medium',
            disabled ? 'text-gray-400' : 'text-gray-700',
            // カーソルスタイル
            !disabled && 'cursor-pointer',
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}

Checkbox.displayName = 'Checkbox'
