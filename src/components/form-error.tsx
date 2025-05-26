type FormErrorProps = {
  errors?: string[]
}

export function FormError({ errors }: FormErrorProps) {
  if (!errors || errors.length === 0) return

  return (
    <div className="mt-1 text-sm text-red-600">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  )
}
