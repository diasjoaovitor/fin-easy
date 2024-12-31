import type { TAuthFormField } from '@/types'

export const signInFields: TAuthFormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email'
  },
  {
    name: 'password',
    label: 'Senha',
    type: 'password'
  }
]
