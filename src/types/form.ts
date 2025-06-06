// フォームエラーの型定義
export type FormError = {
  [key: string]: string[]
}

// Server Actionの戻り値の型定義
export type ActionState<T = void> = {
  success: boolean
  data?: T
  error?: {
    message: string
    fields?: FormError
  }
  values?: {
    [key: string]: string
  }
}

// Server Actionの戻り値の型定義
export type UpdateActionState<TData = void, TValues = undefined> = {
  success: boolean
  data?: TData
  error?: {
    message: string
    fields?: FormError
  }
  values?: TValues
}
