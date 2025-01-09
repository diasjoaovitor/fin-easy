import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { type AuthError, type User } from 'firebase/auth'
import type { TFinanceModel, TYearModel } from '@/models'
import type { TAlertProps, TArgsCreate } from '@/types'
import { AuthService, FinanceService, YearService } from '@/services'
import { getAuthErrorMessage, getCurrentPeriod, getCurrentYear } from '@/utils'
import { authConfig } from '@/config'

const authService = new AuthService()
const financeService = new FinanceService()
const yearService = new YearService()

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
    period: getCurrentPeriod(),
    years: { years: [getCurrentYear()] } as TYearModel,
    finances: [] as TFinanceModel[],
    isLoading: true,
    alert: { open: false, type: 'success', title: '' } as TAlertProps
  }),
  actions: {
    async signUp({ email, password }: { email: string; password: string }) {
      await handler(
        async () => {
          const userRef = await authService.signUp(email, password)
          await yearService.create({ userRef, years: [getCurrentYear()] })
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
    async fetchYears() {
      await handler(
        async () => {
          const user = authConfig.currentUser
          this.years = await yearService.find(user!.uid)
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao buscar os anos',
              type: 'error'
            }
          }
        }
      )
    },
    async fetchFinances(period: string) {
      await handler(
        async () => {
          const user = authConfig.currentUser
          this.finances = await financeService.findByPeriod(period, user!.uid)
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
    async createFinance(data: TArgsCreate<TFinanceModel>) {
      await handler(
        async () => {
          await financeService.create(data)
          const y = {
            ...this.years,
            years: Array.from(
              new Set([
                ...this.years.years,
                Number(dayjs(data.date).format('YYYY'))
              ])
            )
          }
          await yearService.update(y)
          this.years = y
          const p = dayjs(data.date).format('YYYY-MM')
          await this.fetchFinances(p)
          this.period = p
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
    async createRecurringFinance(data: TArgsCreate<TFinanceModel>[]) {
      await handler(
        async () => {
          await financeService.createRecurring(data)
          const y = {
            ...this.years,
            years: Array.from(
              new Set([
                ...this.years.years,
                Number(dayjs(data[data.length - 1].date).format('YYYY'))
              ])
            )
          }
          await yearService.update(y)
          this.years = y
          const p = dayjs(data[0].date).format('YYYY-MM')
          await this.fetchFinances(p)
          this.period = p
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao criar a finança recorrente',
              type: 'error'
            },
            success: {
              open: true,
              title: 'Finança recorrente criada com sucesso!',
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
          const y = {
            ...this.years,
            years: Array.from(
              new Set([
                ...this.years.years,
                Number(dayjs(data.date).format('YYYY'))
              ])
            )
          }
          await yearService.update(y)
          this.years = y
          const p = dayjs(data.date).format('YYYY-MM')
          await this.fetchFinances(p)
          this.period = p
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
    async updateRecurringFinance(data: TFinanceModel) {
      await handler(
        async () => {
          const { financeRef, category, description, value, type } = data
          const finances = await financeService.findRecurring(financeRef)
          const updatedFinances = finances.map((finance) => ({
            ...finance,
            category,
            description,
            value,
            type
          }))
          await financeService.updateRecurring(updatedFinances)
          await this.fetchFinances(this.period)
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
          await this.fetchFinances(this.period)
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
    },
    async deleteRecurringFinance(financeRef: string) {
      await handler(
        async () => {
          const finances = await financeService.findRecurring(financeRef)
          const ids = finances.map(({ id }) => id)
          await financeService.deleteRecurring(ids)
          await this.fetchFinances(this.period)
        },
        {
          context: this,
          alert: {
            error: {
              open: true,
              title: 'Erro ao excluir a finança recorrente',
              type: 'error'
            },
            success: {
              open: true,
              title: 'Finança recorrente excluída com sucesso!',
              type: 'success'
            }
          }
        }
      )
    }
  }
})
