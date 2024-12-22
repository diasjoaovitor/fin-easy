<script setup lang="ts">
import { currentMonth, currentYear, months } from '@/constants'

const month = ref(months[currentMonth - 1])
const year = ref(currentYear)
const years = ref([currentYear - 1, currentYear, currentYear + 1])

const data = computed(() => ({
  balance: 100,
  expenses: 200,
  incomes: 300
}))

const handleMonthChange = (value: string) => {
  month.value = value
}

const handleYearChange = (value: number) => {
  year.value = value
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
  <h2 class="mb-4">Dados no mês</h2>
  <div class="d-flex flex-column flex-sm-row ga-4">
    <WalletItem
      label="Saldo"
      :value="1000"
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
  {{ `${month} - ${year}` }}
</template>
