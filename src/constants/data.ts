import type { TFinance } from '@/models'
import { currentDate } from './date'

export const defaultFinance: TFinance = {
  id: '0',
  type: '-',
  description: '',
  category: 'Outros',
  value: 0,
  date: currentDate,
  createdAt: currentDate,
  updatedAt: currentDate
}
