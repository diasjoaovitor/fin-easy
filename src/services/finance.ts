import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import type {
  TFinanceArgsCreate,
  TFinanceArgsUpdate,
  TFinanceModel
} from '@/models'
import { db } from '@/config'
import { getTimestamp } from '@/utils'

interface IFinanceService<T> {
  findByPeriod: (period: string, userRef: string) => Promise<T[]>
  create: (data: TFinanceArgsCreate<T>) => Promise<void>
  update: (data: TFinanceArgsUpdate<T>) => Promise<void>
  delete: (id: string) => Promise<void>
}

export class FinanceService implements IFinanceService<TFinanceModel> {
  private collectionName = 'finances'

  findByPeriod = async (period: string, userRef: string) => {
    const q = query(
      collection(db, this.collectionName),
      where('userRef', '==', userRef),
      where('date', '>=', `${period}-01`),
      where('date', '<=', `${period}-31`),
      orderBy('date', 'desc')
    )
    const { docs } = await getDocs(q)
    const data = docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    return data as TFinanceModel[]
  }

  create = async (data: TFinanceArgsCreate<TFinanceModel>) => {
    const docRef = collection(db, this.collectionName)
    const timestamp = getTimestamp()
    const finance: Omit<TFinanceModel, 'id'> = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    await addDoc(docRef, finance)
  }

  update = async (data: TFinanceArgsUpdate<TFinanceModel>) => {
    const docRef = doc(db, this.collectionName, data.id)
    const timestamp = getTimestamp()
    const finance: TFinanceModel = {
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
