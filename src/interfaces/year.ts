import type { TArgsCreate } from '@/types'

export interface IYearService<T> {
  find: (userRef: string) => Promise<T>
  create: (data: TArgsCreate<T>) => Promise<void>
  update: (data: T) => Promise<void>
}
