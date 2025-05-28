'use client'

import type { ReactNode } from 'react'
import { IoClose } from 'react-icons/io5'

type SideOverlayProps = {
  /** オーバーレイのタイトル */
  title: string
  /** オーバーレイの内部コンテンツ */
  children: ReactNode
  /** オーバーレイが表示されているかどうか */
  isOpen: boolean
  /** オーバーレイを閉じるコールバック関数 */
  onClose: () => void
}

/**
 * 画面の右側からスライドインするオーバーレイコンポーネント
 */
export function SideOverlay({
  title,
  children,
  isOpen,
  onClose,
}: SideOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-40 top-[64px] flex justify-end"
      aria-modal="true"
      aria-labelledby="side-overlay-title"
    >
      <div
        className={`
          bg-white w-full max-w-md shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col border-t border-l h-[calc(100vh-64px)]
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="side-overlay-title"
            className="text-lg font-bold text-gray-800"
          >
            {title}
          </h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            onClick={onClose}
            aria-label="閉じる"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* スクロール可能なコンテンツエリア */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
