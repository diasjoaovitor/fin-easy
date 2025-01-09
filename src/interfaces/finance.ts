import type { TArgsCreate, TArgsUpdate } from '@/types'

export interface IFinanceService<T> {
  findByPeriod: (period: string, userRef: string) => Promise<T[]>
  findRecurring: (financeRef: string) => Promise<T[]>
  create: (data: TArgsCreate<T>) => Promise<void>
  createRecurring: (data: TArgsCreate<T>[]) => Promise<void>
  update: (data: TArgsUpdate<T>) => Promise<void>
  updateRecurring: (data: TArgsUpdate<T>[]) => Promise<void>
  delete: (id: string) => Promise<void>
  deleteRecurring: (ids: string[]) => Promise<void>
}
