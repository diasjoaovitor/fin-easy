import { defineStore } from 'pinia'
import type { TArgsCreate, TFinance } from '@/models'
import { FinanceService } from '@/services'
import { currentPeriod } from '@/constants'
import type { TAlertProps } from '@/types'

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
    }
  }
) => {
  try {
    context.isLoading = true
    await callback()
    context.isLoading = false
    context.alert = alert.success
  } catch (error) {
    console.error(error)
    context.alert = alert.error
  }
}

export const useAppStore = defineStore('app', {
  state: () => ({
    period: currentPeriod,
    finances: [] as TFinance[],
    isLoading: true,
    alert: { open: false, type: 'success', title: '' } as TAlertProps
  }),
  actions: {
    async fetchFinances() {
      await handler(
        async () => {
          this.finances = await financeService.findByPeriod(this.period)
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
    async createFinance(data: TArgsCreate<TFinance>) {
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
    async updateFinance(data: TFinance) {
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
