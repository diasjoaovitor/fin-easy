import dayjs from 'dayjs'
import { Rule } from '@/config'
import type { TFinanceModel, TFrequencyType } from '@/models'
import type { TArgsCreate } from '@/types'
import type { IRRuleOptions } from '@rschedule/core/rules/ICAL_RULES'

export const transformToRecurringFinance = (
  finance: TArgsCreate<TFinanceModel>
): TArgsCreate<TFinanceModel>[] => {
  const { frequency: recurringType, numberOfRepeats, date } = finance

  const rule = new Rule({
    frequency: recurringType,
    start: dayjs(date)
  } as IRRuleOptions & { frequency: TFrequencyType })

  const finances = rule
    .occurrences({ take: numberOfRepeats })
    .toArray()
    .map((date, index) => ({
      ...finance,
      date: dayjs(date.toISOString()).format('YYYY-MM-DD'),
      numberOfRepeat: finance.numberOfRepeat + index
    }))

  return finances
}
