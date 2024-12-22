export type TFinanceType = '+' | '-'

export type TFinance = {
  id: string
  type: TFinanceType
  value: number
  description?: string
  category: string
  date: string
  createdAt: string
  updatedAt: string
}
