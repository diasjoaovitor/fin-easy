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
  date: yup.date().required('Data é obrigatória'),
  category: yup.string().required('Categoria é obrigatória')
})
