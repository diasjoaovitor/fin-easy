import type { User } from 'firebase/auth'

export interface IAuthService {
  signUp: (email: string, password: string) => Promise<string>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resendEmailVerification: (user: User) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}
