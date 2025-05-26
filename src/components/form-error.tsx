type FormErrorProps = {
  errors?: string[]
  id?: string // フォーム要素との関連付けに使用するID
}

export function FormError({ errors, id }: FormErrorProps) {
  if (!errors || errors.length === 0) return null

  return (
    <div className="mt-1 text-sm text-red-600" role="alert" id={id}>
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  )
}
