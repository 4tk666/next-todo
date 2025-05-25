// フォームエラーの型定義
export type FormError = {
  [key: string]: string[]
}

// Server Actionの戻り値の型定義
export type ActionState = {
  error?: string
  success?: boolean
  formError?: FormError
  values?: {
    [key: string]: string
  }
}
