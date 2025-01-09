export type TFinanceType = '+' | '-'

export type TFrequencyType = 'YEARLY' | 'WEEKLY' | 'MONTHLY' | null

export type TFinanceModel = {
  id: string
  userRef: string
  type: TFinanceType
  value: number
  description?: string
  category: string
  date: string
  financeRef: string
  frequency: TFrequencyType
  numberOfRepeats: number
  numberOfRepeat: number
  createdAt: string
  updatedAt: string
}
