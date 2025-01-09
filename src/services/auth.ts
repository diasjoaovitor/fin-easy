import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  type User
} from 'firebase/auth'
import { authConfig } from '@/config'
import type { IAuthService } from '@/interfaces'

export class AuthService implements IAuthService {
  signUp = async (email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(
      authConfig,
      email,
      password
    )
    await sendEmailVerification(user)
    return user.uid
  }

  signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(authConfig, email, password)
  }

  signOut = async () => {
    await authConfig.signOut()
  }

  resendEmailVerification = async (user: User) => {
    await sendEmailVerification(user)
  }

  resetPassword = async (email: string) => {
    await sendPasswordResetEmail(authConfig, email)
  }
}
