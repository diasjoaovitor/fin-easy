import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import type { TYearModel } from '@/models'
import { db } from '@/config'
import { getTimestamp } from '@/utils'
import type { TArgsCreate } from '@/types'
import type { IYearService } from '@/interfaces'

export class YearService implements IYearService<TYearModel> {
  private collectionName = 'years'

  find = async (userRef: string) => {
    const q = query(
      collection(db, this.collectionName),
      where('userRef', '==', userRef)
    )
    const { docs } = await getDocs(q)
    const data = docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    return data[0] as TYearModel
  }

  create = async (data: TArgsCreate<TYearModel>) => {
    const docRef = collection(db, this.collectionName)
    const timestamp = getTimestamp()
    const year: Omit<TYearModel, 'id'> = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    await addDoc(docRef, year)
  }

  update = async (data: TYearModel) => {
    const docRef = doc(db, this.collectionName, data.id)
    const timestamp = getTimestamp()
    const year: TYearModel = {
      ...data,
      updatedAt: timestamp
    }
    await updateDoc(docRef, year)
  }
}
