import type { TFinanceArgsCreate, TFinanceModel } from '@/models'
import { currentDate } from './date'

export const defaultFinance: Omit<
  TFinanceArgsCreate<TFinanceModel>,
  'userRef'
> = {
  type: '-',
  description: '',
  category: 'Outros',
  value: 0,
  date: currentDate
}
