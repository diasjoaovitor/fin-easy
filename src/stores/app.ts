import { defineStore } from 'pinia'
import { type AuthError, type User } from 'firebase/auth'
import type { TFinanceArgsCreate, TFinanceModel } from '@/models'
import type { TAlertProps } from '@/types'
import { AuthService, FinanceService } from '@/services'
import { currentPeriod } from '@/constants'
import { getAuthErrorMessage } from '@/utils'
import { authConfig } from '@/config'

const authService = new AuthService()
const financeService = new FinanceService()

const handler = async (
  callback: () => Promise<void>,
  {
    context,
    alert
  }: {
    context: any
    alert: {
      success?: TAlertProps
      error: TAlertProps
      typeError?: 'auth'
    }
  }
) => {
  try {
    context.isLoading = true
    await callback()
    context.alert = alert.success
  } catch (error) {
    console.error(error)
    if (alert.typeError === 'auth') {
      context.alert = {
        ...alert.error,
        text: getAuthErrorMessage(error as AuthError)
      }
    } else context.alert = alert.error
  } finally {
    context.isLoading = false
  }
}

export const useAppStore = defineStore('app', {
  state: () => ({
    period: currentPeriod,
    finances: [] as TFinanceModel[],
    isLoading: true,
    alert: { open: false, type: 'success', title: '' } as TAlertProps
  }),
  actions: {
    async signUp({ email, password }: { email: string; password: string }) {
      await handler(
        async () => {
          await authService.signUp(email, password)
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao fazer sign up',
              type: 'error'
            },
            typeError: 'auth'
          }
        }
      )
    },
    async signIn({ email, password }: { email: string; password: string }) {
      await handler(
        async () => {
          await authService.signIn(email, password)
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao fazer sign in',
              type: 'error'
            },
            typeError: 'auth'
          }
        }
      )
    },
    async signOut() {
      await handler(
        async () => {
          await authService.signOut()
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao fazer sign out',
              type: 'error'
            },
            typeError: 'auth'
          }
        }
      )
    },
    async resetPassword({ email }: { email: string }) {
      await handler(
        async () => {
          await authService.resetPassword(email)
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao recuperar a senha',
              type: 'error'
            },
            typeError: 'auth'
          }
        }
      )
    },
    async resendEmailVerification(user: User) {
      await handler(
        async () => {
          await authService.resendEmailVerification(user)
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao reenviar o email de verificação',
              type: 'error'
            }
          }
        }
      )
    },
    async fetchFinances() {
      await handler(
        async () => {
          const user = authConfig.currentUser
          this.finances = await financeService.findByPeriod(
            this.period,
            user!.uid
          )
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao buscar as finanças',
              type: 'error'
            }
          }
        }
      )
    },
    async createFinance(data: TFinanceArgsCreate<TFinanceModel>) {
      await handler(
        async () => {
          await financeService.create(data)
          await this.fetchFinances()
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao criar as finança',
              type: 'error'
            },
            success: {
              open: true,
              title: 'Finança criada com sucesso!',
              type: 'success'
            }
          }
        }
      )
    },
    async updateFinance(data: TFinanceModel) {
      await handler(
        async () => {
          await financeService.update(data)
          await this.fetchFinances()
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao editar a finança',
              type: 'error'
            },
            success: {
              open: true,
              title: 'Finança editada com sucesso!',
              type: 'success'
            }
          }
        }
      )
    },
    async deleteFinance(id: string) {
      await handler(
        async () => {
          await financeService.delete(id)
          await this.fetchFinances()
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao excluir a finança',
              type: 'error'
            },
            success: {
              open: true,
              title: 'Finança excluída com sucesso!',
              type: 'success'
            }
          }
        }
      )
    }
  }
})
