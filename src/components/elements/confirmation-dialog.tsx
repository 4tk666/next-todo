'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { IoClose } from 'react-icons/io5'

type ConfirmationDialogProps = {
  /** ダイアログのタイトル */
  title: string
  /** 確認メッセージ */
  message: string
  /** 確認ボタンのテキスト（デフォルト: "確認"） */
  confirmText?: string
  /** キャンセルボタンのテキスト（デフォルト: "キャンセル"） */
  cancelText?: string
  /** 確認時の処理 */
  onConfirm: () => void | Promise<void>
  /** ダイアログが開いているかどうか */
  isOpen: boolean
  /** ダイアログを閉じる処理 */
  onClose: () => void
  /** 確認処理中の状態 */
  isLoading?: boolean
}

/**
 * 確認用のダイアログコンポーネント
 * 削除やその他の重要なアクションの確認に使用
 */
export function ConfirmationDialog({
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  onConfirm,
  isOpen,
  onClose,
  isLoading = false,
}: ConfirmationDialogProps) {

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* オーバーレイ */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* ダイアログコンテンツ */}
        <Dialog.Content
          className="
            fixed left-[50%] top-[50%] z-50 
            w-full max-w-md
            translate-x-[-50%] translate-y-[-50%] 
            bg-white rounded-lg border shadow-lg 
            duration-200 
            data-[state=open]:animate-in 
            data-[state=closed]:animate-out 
            data-[state=closed]:fade-out-0 
            data-[state=open]:fade-in-0 
            data-[state=closed]:zoom-out-95 
            data-[state=open]:zoom-in-95 
            data-[state=closed]:slide-out-to-left-1/2 
            data-[state=closed]:slide-out-to-top-[48%] 
            data-[state=open]:slide-in-from-left-1/2 
            data-[state=open]:slide-in-from-top-[48%]
            focus:outline-none
          "
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {title}
              </Dialog.Title>
            </div>

            {/* 閉じるボタン */}
            <Dialog.Close asChild>
              <button
                type="button"
                className="
                  rounded-sm opacity-70 ring-offset-white transition-opacity 
                  hover:opacity-100 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:ring-offset-2 
                  disabled:pointer-events-none
                  p-1
                "
                aria-label="ダイアログを閉じる"
                disabled={isLoading}
              >
                <IoClose size={24} className="text-gray-600" />
              </button>
            </Dialog.Close>
          </div>

          {/* メッセージエリア */}
          <div className="p-6">
            <Dialog.Description className="text-gray-600 mb-6 whitespace-pre-line">
              {message}
            </Dialog.Description>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {cancelText}
                </button>
              </Dialog.Close>

              <button
                type="button"
                className="px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                disabled={isLoading}
                onClick={onConfirm}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>処理中...</span>
                  </div>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
