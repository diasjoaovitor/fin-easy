import * as yup from 'yup'

export const signUpSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Senhas não conferem')
})
