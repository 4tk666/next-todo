import { z } from 'zod'
import { emailSchema, nameSchema, passwordSchema, createPasswordConfirmationRefine } from '../common-schemas'

const baseSignUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
})

export const signUpSchema = createPasswordConfirmationRefine(baseSignUpSchema)

export type SignUpFormValues = z.infer<typeof signUpSchema>
