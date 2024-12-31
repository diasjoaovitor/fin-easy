import { type AuthError } from 'firebase/auth'

export const getAuthErrorMessage = (error: AuthError) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Email já em uso'
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Verifique suas credenciais'
    case 'auth/invalid-email':
      return 'Email inválido'
    case 'auth/user-not-found':
      return 'Usuário não existe'
    case 'auth/internal-error':
      return 'Erro interno'
    default:
      return 'Erro desconhecido'
  }
}
