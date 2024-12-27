import type { TArgsCreate, TFinance } from '@/models'
import { currentDate } from './date'

export const defaultFinance: TArgsCreate<TFinance> = {
  type: '-',
  description: '',
  category: 'Outros',
  value: 0,
  date: currentDate
}
