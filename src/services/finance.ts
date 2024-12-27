import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import type { TArgsCreate, TArgsUpdate, TFinance } from '@/models'
import { db } from '@/config'
import { getTimestamp } from '@/utils'

interface IFinanceService<T> {
  findByPeriod: (period: string) => Promise<T[]>
  create: (data: TArgsCreate<T>) => Promise<void>
  update: (data: TArgsUpdate<T>) => Promise<void>
  delete: (id: string) => Promise<void>
}

export class FinanceService implements IFinanceService<TFinance> {
  private collectionName = 'finance'

  findByPeriod = async (period: string) => {
    const q = query(
      collection(db, this.collectionName),
      where('date', '>=', `${period}-01`),
      where('date', '<=', `${period}-31`),
      orderBy('date', 'desc')
    )
    const { docs } = await getDocs(q)
    const data = docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    return data as TFinance[]
  }

  create = async (data: TArgsCreate<TFinance>) => {
    const docRef = doc(collection(db, this.collectionName))
    const timestamp = getTimestamp()
    const finance: TFinance = {
      ...data,
      id: docRef.id,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    await setDoc(docRef, finance)
  }

  update = async (data: TArgsUpdate<TFinance>) => {
    const docRef = doc(db, this.collectionName, data.id)
    const timestamp = getTimestamp()
    const finance: TFinance = {
      ...data,
      updatedAt: timestamp
    }
    await updateDoc(docRef, finance)
  }

  delete = async (id: string) => {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }
}
