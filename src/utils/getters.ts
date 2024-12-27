import type { TFinanceType } from '@/models'

export const getButtonColor = (type: TFinanceType) =>
  type === '-' ? 'error' : 'primary'
