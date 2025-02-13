<script setup lang="ts">
import { defaultFinance, months, type TDefaultFinance } from '@/constants'
import type { TFinanceModel } from '@/models'
import { useAppStore } from '@/stores'
import type { TFormMode, TWalletData } from '@/types'
import { getCurrentMonth, getCurrentYear, getPeriod, getWallet } from '@/utils'
import dayjs from 'dayjs'

const appStore = useAppStore()

const currentMonth = getCurrentMonth()
const currentYear = getCurrentYear()

const month = ref(months[currentMonth - 1])
const year = ref(currentYear)
const years = ref([currentYear - 1, currentYear, currentYear + 1])

const formOverlay = ref(false)
const mode = ref<TFormMode>('create')

const finances = ref<TFinanceModel[]>([])
const finance = ref<TFinanceModel | TDefaultFinance>(defaultFinance)
const wallet = ref<TWalletData>({
  balance: 0,
  incomes: 0,
  expenses: 0
})

onMounted(async () => {
  await appStore.fetchYears()
  await appStore.fetchFinances(appStore.period)
})

watch([month, year], async ([newMonth, newYear]) => {
  const period = getPeriod({ month: newMonth, year: newYear, months })
  appStore.period = period
  await appStore.fetchFinances(period)
})

watch(
  () => appStore.finances,
  () => {
    finances.value = appStore.finances
    wallet.value = getWallet(appStore.finances)
  }
)

watch(
  () => appStore.period,
  (newValue) => {
    month.value = months[dayjs(newValue).month()]
    year.value = dayjs(newValue).year()
  }
)

watch(
  () => appStore.years,
  (newValue) => {
    years.value = newValue.years
  }
)

const handleMonthChange = (value: string) => {
  month.value = value
}

const handleYearChange = (value: number) => {
  year.value = value
}

const updateFormOverlay = (value: boolean) => {
  formOverlay.value = value
  if (!value) {
    finance.value = defaultFinance as TFinanceModel
    mode.value = 'create'
  }
}

const selectFinance = (value: TFinanceModel) => {
  finance.value = value
  mode.value = 'update'
  formOverlay.value = true
}
</script>

<template>
  <h1 class="mb-4">Carteira</h1>
  <Period
    :month="month"
    :year="year"
    :years="years"
    :handle-month-change="handleMonthChange"
    :handle-year-change="handleYearChange"
  />
  <section>
    <h2 class="mb-4">Dados no mês</h2>
    <div class="d-flex flex-column flex-sm-row ga-4">
      <WalletItem
        label="Saldo"
        :value="wallet.balance"
        icon="mdi-currency-usd"
        :color="wallet.balance >= 0 ? 'success' : 'warning'"
      />
      <WalletItem
        label="Entradas"
        :value="wallet.incomes"
        icon="mdi-arrow-up"
        color="primary"
      />
      <WalletItem
        label="Saídas"
        :value="wallet.expenses"
        icon="mdi-arrow-down"
        color="error"
      />
    </div>
  </section>
  <section>
    <h2 class="mt-6 mb-4">Lançamentos no mês</h2>
    <FinanceList :items="finances" @select:finance="selectFinance" />
  </section>
  <div class="position-sticky bottom-0 text-right">
    <v-btn icon="mdi-plus" color="primary" @click="formOverlay = !formOverlay">
      <v-icon class="text-h4">mdi-plus</v-icon>
    </v-btn>
  </div>
  <FinanceForm
    :finance="finance"
    :mode="mode"
    :overlay="formOverlay"
    @update:overlay="updateFormOverlay"
  />
</template>

<style scoped lang="scss">
@media screen and (min-width: 800px) {
  .v-list {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
