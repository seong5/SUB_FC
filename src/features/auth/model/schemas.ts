import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('이메일 형식이 올바르지 않습니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

export const SignupSchema = z
  .object({
    email: z.string().min(1, '이메일을 입력해주세요.').email('이메일이 올바르지 않습니다.'),
    nickname: z
      .string()
      .min(2, '닉네임은 2자 이상 입력해주세요.')
      .max(20, '닉네임을 20자 이하로 입력해주세요.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상 입력해주세요.')
      .regex(/(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s])/, '영문/숫자/특수문자를 포함해야 해요.'),
    confirm: z.string().min(1, '비밀번호를 한 번 더 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirm, {
    path: ['confirm'],
    message: '비밀번호가 일치하지 않습니다.',
  })

export type LoginFormData = z.infer<typeof LoginSchema>
export type SignupFormData = z.infer<typeof SignupSchema>
