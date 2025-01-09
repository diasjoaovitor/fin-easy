import type { TFinanceModel } from '@/models'
import type { TArgsCreate } from '@/types'
import { getCurrentDate } from '@/utils'

export type TDefaultFinance = Omit<
  TArgsCreate<TFinanceModel>,
  'userRef' | 'financeRef'
>

export const defaultFinance: TDefaultFinance = {
  type: '-',
  description: '',
  category: 'Outros',
  value: 0,
  date: getCurrentDate(),
  frequency: null,
  numberOfRepeats: 1,
  numberOfRepeat: 1
}
