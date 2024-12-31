export type TFinanceType = '+' | '-'

export type TFinanceModel = {
  id: string
  userRef: string
  type: TFinanceType
  value: number
  description?: string
  category: string
  date: string
  createdAt: string
  updatedAt: string
}

export type TFinanceArgsCreate<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export type TFinanceArgsUpdate<T> = Omit<T, 'updatedAt'> & { id: string }
