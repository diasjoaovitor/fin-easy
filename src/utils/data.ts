import type { TFinanceModel } from '@/models'
import type { TWalletData } from '@/types'

export const getWallet = (finances: TFinanceModel[]): TWalletData => {
  let incomes = 0
  let expenses = 0

  finances.forEach((finance) => {
    if (finance.type === '-') {
      expenses += finance.value
      return
    }
    incomes += finance.value
  })

  const balance = incomes - expenses

  return {
    incomes,
    expenses,
    balance
  }
}
