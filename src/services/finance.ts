import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore'
import { v4 as uuid } from 'uuid'
import type { TFinanceModel } from '@/models'
import { db } from '@/config'
import { getTimestamp } from '@/utils'
import type { TArgsCreate, TArgsUpdate } from '@/types'
import type { IFinanceService } from '@/interfaces'

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

  findRecurring = async (financeRef: string) => {
    const q = query(
      collection(db, this.collectionName),
      where('financeRef', '==', financeRef)
    )
    const { docs } = await getDocs(q)
    const data = docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    return data as TFinanceModel[]
  }

  create = async (data: TArgsCreate<TFinanceModel>) => {
    const docRef = collection(db, this.collectionName)
    const timestamp = getTimestamp()
    const finance: Omit<TFinanceModel, 'id'> = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    await addDoc(docRef, finance)
  }

  createRecurring = async (data: TArgsCreate<TFinanceModel>[]) => {
    const batch = writeBatch(db)
    const timestamp = getTimestamp()
    data.forEach((item) => {
      const docRef = doc(db, this.collectionName, uuid())
      const finance: Omit<TFinanceModel, 'id'> = {
        ...item,
        createdAt: timestamp,
        updatedAt: timestamp
      }
      batch.set(docRef, finance)
    })
    await batch.commit()
  }

  update = async (data: TArgsUpdate<TFinanceModel>) => {
    const docRef = doc(db, this.collectionName, data.id)
    const timestamp = getTimestamp()
    const finance: TFinanceModel = {
      ...data,
      updatedAt: timestamp
    }
    await updateDoc(docRef, finance)
  }

  updateRecurring = async (data: TArgsUpdate<TFinanceModel>[]) => {
    const batch = writeBatch(db)
    const timestamp = getTimestamp()
    data.forEach((item) => {
      const docRef = doc(db, this.collectionName, item.id)
      const finance: TFinanceModel = {
        ...item,
        updatedAt: timestamp
      }
      batch.update(docRef, finance)
    })
    await batch.commit()
  }

  delete = async (id: string) => {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }

  deleteRecurring = async (ids: string[]) => {
    const batch = writeBatch(db)
    ids.forEach((id) => {
      const docRef = doc(db, this.collectionName, id)
      batch.delete(docRef)
    })
    await batch.commit()
  }
}
