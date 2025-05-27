import { z } from 'zod'

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: '名前を入力してください' })
      .max(50, { message: '名前は50文字以下で入力してください' }),
    email: z
      .string()
      .min(1, { message: 'メールアドレスを入力してください' })
      .max(100, { message: 'メールアドレスは100文字以下で入力してください' })
      .email({ message: 'メールアドレスの形式が正しくありません' }),
    password: z
      .string()
      .min(8, { message: 'パスワードは8文字以上で入力してください' })
      .max(100, { message: 'パスワードは100文字以下で入力してください' }),
    confirmPassword: z
      .string()
      .min(8, { message: '確認用パスワードは8文字以上で入力してください' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードと確認用パスワードが一致しません',
    path: ['confirmPassword'],
  })

export type SignUpInput = z.infer<typeof signUpSchema>
