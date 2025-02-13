import type { TFinanceType } from '@/models'
import * as yup from 'yup'

export const financeSchema = yup.object().shape({
  type: yup
    .string()
    .required('Tipo de lançamento é obrigatório')
    .oneOf(
      ['+', '-'] as TFinanceType[],
      'Tipo de lançamento deve ser "+" ou "-"'
    ),
  description: yup.string(),
  value: yup
    .string()
    .required('Valor é obrigatório')
    .test('isPositive', 'Valor deve ser maior que zero', (value) => {
      const number = value.replace(/[^\d]/g, '')
      return parseInt(number) > 0
    }),
  date: yup
    .string()
    .required('Data é obrigatória')
    .test('isDate', 'Data inválida', (value) => {
      return !isNaN(Date.parse(value))
    }),
  category: yup.string().required('Categoria é obrigatória'),
  frequency: yup
    .string()
    .required('Frequência é obrigatória')
    .oneOf(
      ['Anual', 'Mensal', 'Semanal', 'Não repetir'],
      'Frequência inválida'
    ),
  numberOfRepeats: yup
    .number()
    .required('Número de repetições é obrigatório')
    .min(1, 'Número de repetições deve ser maior que zero')
})

export type TFinanceFormData = yup.InferType<typeof financeSchema>
