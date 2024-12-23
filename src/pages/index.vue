<script setup lang="ts">
import { currentMonth, currentYear, defaultFinance, months } from '@/constants'
import type { TFinance } from '@/models'
import type { TFormMode } from '@/types'

const month = ref(months[currentMonth - 1])
const year = ref(currentYear)
const years = ref([currentYear - 1, currentYear, currentYear + 1])

const overlay = ref(false)
const mode = ref<TFormMode>('create')

const finance = ref<TFinance>(defaultFinance)
const data = computed(() => ({
  balance: 100,
  expenses: 200,
  incomes: 300,
  finances: [
    {
      id: '1',
      type: '+',
      category: 'Salário',
      date: '2024-12-21',
      value: 100,
      createdAt: '2024-12-21T00:00:00.000Z',
      updatedAt: '2024-12-21T00:00:00.000Z'
    },
    {
      id: '2',
      type: '-',
      category: 'Alimentação',
      description: 'Mercado',
      date: '2024-12-21',
      value: 200,
      createdAt: '2024-12-21T00:00:00.000Z',
      updatedAt: '2024-12-21T00:00:00.000Z'
    },
    {
      id: '3',
      type: '+',
      category: 'Bônus',
      description: 'Bônus de natal',
      date: '2024-12-21',
      value: 200,
      createdAt: '2024-12-21T00:00:00.000Z',
      updatedAt: '2024-12-21T00:00:00.000Z'
    },
    {
      id: '4',
      type: '-',
      category: 'Transporte',
      description: 'Gasolina',
      date: '2024-12-21',
      value: 100,
      createdAt: '2024-12-21T00:00:00.000Z',
      updatedAt: '2024-12-21T00:00:00.000Z'
    }
  ] as TFinance[]
}))

const handleMonthChange = (value: string) => {
  month.value = value
}

const handleYearChange = (value: number) => {
  year.value = value
}

const updateOverlay = (value: boolean) => {
  overlay.value = value
  if (!value) {
    finance.value = defaultFinance
    mode.value = 'create'
  }
}

const selectFinance = (value: TFinance) => {
  finance.value = value
  mode.value = 'update'
  overlay.value = true
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
        :value="data.balance"
        icon="mdi-currency-usd"
        :color="data.balance >= 0 ? 'success' : 'warning'"
      />
      <WalletItem
        label="Entradas"
        :value="data.incomes"
        icon="mdi-arrow-up"
        color="primary"
      />
      <WalletItem
        label="Saídas"
        :value="data.expenses"
        icon="mdi-arrow-down"
        color="error"
      />
    </div>
  </section>
  <section>
    <h2 class="mt-6 mb-4">Lançamentos no mês</h2>
    <FinanceList :items="data.finances" @select:finance="selectFinance" />
  </section>
  <div class="position-sticky bottom-0 text-right">
    <v-btn icon="mdi-plus" color="primary" @click="overlay = !overlay">
      <v-icon class="text-h4">mdi-plus</v-icon>
    </v-btn>
  </div>
  <Form
    :finance="finance"
    :mode="mode"
    :overlay="overlay"
    @update:overlay="updateOverlay"
  />
</template>
