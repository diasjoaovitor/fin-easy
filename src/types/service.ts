export type TArgsCreate<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export type TArgsUpdate<T> = Omit<T, 'updatedAt'> & { id: string }
