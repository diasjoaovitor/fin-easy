import { type TFrequencyType } from '@/models'

type TRecurringOption = {
  label: string
  value: TFrequencyType | null
}

export const recurringOptions: TRecurringOption[] = [
  { label: 'Não repetir', value: null },
  { label: 'Semanal', value: 'WEEKLY' },
  { label: 'Mensal', value: 'MONTHLY' },
  { label: 'Anual', value: 'YEARLY' }
]
