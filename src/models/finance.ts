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

export type TArgsCreate<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export type TArgsUpdate<T> = Omit<T, 'updatedAt'> & { id: string }
