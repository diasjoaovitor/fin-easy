<script setup lang="ts">
import { currentMonth, currentYear, months } from '@/constants'

const month = ref(months[currentMonth - 1])
const year = ref(currentYear)
const years = ref([currentYear - 1, currentYear, currentYear + 1])

const handleMonthChange = (value: string) => {
  month.value = value
}

const handleYearChange = (value: number) => {
  year.value = value
}
</script>

<template>
  <Period
    :month="month"
    :year="year"
    :years="years"
    :handle-month-change="handleMonthChange"
    :handle-year-change="handleYearChange"
  />
  wallet
  {{ `${month} - ${year}` }}
</template>
