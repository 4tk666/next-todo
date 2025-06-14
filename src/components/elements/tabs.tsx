'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils/class-utils'
import type { ReactNode } from 'react'

type TabItem = {
  value: string
  label: string
  triggerClassName?: string
}

type TabsComponentProps = {
  items: TabItem[]
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
  listClassName?: string
}

/**
 * 汎用的な制御コンポーネントのTabsコンポーネント
 * @param items - タブの配列（value, label, content, triggerClassNameを含む）
 * @param value - 現在選択されているタブの値（制御）
 * @param onValueChange - タブ変更時のコールバック関数
 * @param className - Tabs.Rootに適用されるクラス名
 * @param listClassName - Tabs.Listに適用されるクラス名
 */
export function TabsComponent({
  items,
  value,
  onValueChange,
  className,
  listClassName,
  children,
}: TabsComponentProps) {
  return (
    <Tabs.Root
      value={value}
      onValueChange={onValueChange}
      className={cn('w-full', className)}
    >
      {/* タブトリガー部分 */}
      <Tabs.List
        className={cn('flex border-b border-gray-200 mb-6', listClassName)}
      >
        {items.map((item) => (
          <Tabs.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'px-4 py-2 text-sm font-medium text-gray-600',
              'border-b-2 border-transparent',
              'hover:text-gray-900 hover:border-gray-300',
              'data-[state=active]:text-blue-600 data-[state=active]:border-blue-600',
              'cursor-pointer',
              item.triggerClassName,
            )}
          >
            {item.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {/* タブコンテンツ部分 - childrenをそのまま表示 */}
      <div
        className="outline-none"
        role="tabpanel"
        aria-labelledby={items.find((i) => i.value === value)?.label}
      >
        {children}
      </div>
    </Tabs.Root>
  )
}
