type FormLabelProps = {
  /** ラベルが関連付けられるフォーム要素のID */
  id: string
  /** ラベルのテキスト内容 */
  children: React.ReactNode
  /** ラベルが必須項目である場合のフラグ */
  required?: boolean
}

export function FormLabel({ id, children, required = false }: FormLabelProps) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {children}
      {required && (
        <span className="text-red-500 ml-1 text-lg" aria-label="必須項目">
          *
        </span>
      )}
    </label>
  )
}
