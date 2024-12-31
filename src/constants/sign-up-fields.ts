import type { TAuthFormField } from '@/types'

export const signUpFields: TAuthFormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email'
  },
  {
    name: 'password',
    label: 'Senha',
    type: 'password'
  },
  {
    name: 'confirmPassword',
    label: 'Confirme a senha',
    type: 'password'
  }
]
