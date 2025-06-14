import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, test, expect, vi } from 'vitest'
import { TabsComponent } from '../tabs'

// テスト用のラッパーコンポーネント
function TestTabsWrapper({ 
  items, 
  initialValue = 'tab1',
  onValueChange,
}: { 
  items: Parameters<typeof TabsComponent>[0]['items']
  initialValue?: string
  onValueChange?: (value: string) => void
}) {
  const [value, setValue] = useState(initialValue)
  
  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    onValueChange?.(newValue)
  }

  // 条件分岐でコンテンツを表示
  function renderContent() {
    switch (value) {
      case 'tab1':
        return <div>タブ1のコンテンツ</div>
      case 'tab2':
        return <div>タブ2のコンテンツ</div>
      case 'tab3':
        return <div>タブ3のコンテンツ</div>
      default:
        return null
    }
  }

  return (
    <TabsComponent
      items={items}
      value={value}
      onValueChange={handleValueChange}
    >
      {renderContent()}
    </TabsComponent>
  )
}

describe('TabsComponent', () => {
  const mockItems = [
    {
      value: 'tab1',
      label: 'タブ1',
    },
    {
      value: 'tab2',
      label: 'タブ2',
      triggerClassName: 'custom-trigger-class',
    },
    {
      value: 'tab3',
      label: 'タブ3',
    },
  ]

  test('タブトリガーが正しく表示される', () => {
    render(<TestTabsWrapper items={mockItems} />)

    expect(screen.getByRole('tab', { name: 'タブ1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'タブ2' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'タブ3' })).toBeInTheDocument()
  })

  test('初期値で指定したタブが選択される', () => {
    render(<TestTabsWrapper items={mockItems} initialValue="tab1" />)

    expect(screen.getByText('タブ1のコンテンツ')).toBeInTheDocument()
    expect(screen.queryByText('タブ2のコンテンツ')).not.toBeInTheDocument()
  })

  test('異なる初期値で指定したタブが選択される', () => {
    render(<TestTabsWrapper items={mockItems} initialValue="tab2" />)

    expect(screen.getByText('タブ2のコンテンツ')).toBeInTheDocument()
    expect(screen.queryByText('タブ1のコンテンツ')).not.toBeInTheDocument()
  })

  test('タブクリックでコンテンツが切り替わる', async () => {
    const user = userEvent.setup()
    render(<TestTabsWrapper items={mockItems} initialValue="tab1" />)

    // 初期状態
    expect(screen.getByText('タブ1のコンテンツ')).toBeInTheDocument()

    // タブ2をクリック
    await user.click(screen.getByRole('tab', { name: 'タブ2' }))
    expect(screen.getByText('タブ2のコンテンツ')).toBeInTheDocument()
    expect(screen.queryByText('タブ1のコンテンツ')).not.toBeInTheDocument()

    // タブ3をクリック
    await user.click(screen.getByRole('tab', { name: 'タブ3' }))
    expect(screen.getByText('タブ3のコンテンツ')).toBeInTheDocument()
    expect(screen.queryByText('タブ2のコンテンツ')).not.toBeInTheDocument()
  })

  test('onValueChangeコールバックが呼ばれる', async () => {
    const user = userEvent.setup()
    const mockOnValueChange = vi.fn()
    render(
      <TestTabsWrapper 
        items={mockItems} 
        initialValue="tab1"
        onValueChange={mockOnValueChange}
      />
    )

    await user.click(screen.getByRole('tab', { name: 'タブ2' }))
    expect(mockOnValueChange).toHaveBeenCalledWith('tab2')
  })

  test('空の配列でnullが返される', () => {
    const mockOnValueChange = vi.fn()
    const { container } = render(
      <TabsComponent 
        items={[]} 
        value="tab1" 
        onValueChange={mockOnValueChange}
      >
        <div>コンテンツ</div>
      </TabsComponent>
    )
    expect(container.firstChild).toBeNull()
  })

  test('カスタムクラスが適用される', () => {
    const mockOnValueChange = vi.fn()
    render(
      <TabsComponent
        items={mockItems}
        value="tab1"
        onValueChange={mockOnValueChange}
        className="custom-root-class"
        listClassName="custom-list-class"
      >
        <div>コンテンツ</div>
      </TabsComponent>
    )

    const tabList = screen.getByRole('tablist')
    expect(tabList).toHaveClass('custom-list-class')
  })

  test('アクセシビリティ属性が正しく設定される', () => {
    render(<TestTabsWrapper items={mockItems} initialValue="tab1" />)

    // tablistの存在確認
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    
    // 各タブの存在確認
    const tab1 = screen.getByRole('tab', { name: 'タブ1' })
    const tab2 = screen.getByRole('tab', { name: 'タブ2' })
    const tab3 = screen.getByRole('tab', { name: 'タブ3' })
    
    expect(tab1).toBeInTheDocument()
    expect(tab2).toBeInTheDocument()
    expect(tab3).toBeInTheDocument()

    // tabpanelの存在確認
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
  })

  test('キーボードナビゲーションが機能する', async () => {
    const user = userEvent.setup()
    render(<TestTabsWrapper items={mockItems} initialValue="tab1" />)

    const tab1 = screen.getByRole('tab', { name: 'タブ1' })
    
    // 最初のタブにフォーカス
    tab1.focus()
    expect(tab1).toHaveFocus()

    // 矢印キーでナビゲーション
    await user.keyboard('{ArrowRight}')
    
    const tab2 = screen.getByRole('tab', { name: 'タブ2' })
    expect(tab2).toHaveFocus()
  })
})
