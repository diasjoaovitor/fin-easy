<script setup lang="ts">
import { months } from '@/constants'

defineProps<{
  year: number
  years: number[]
  month: string
  handleMonthChange: (e: string) => void
  handleYearChange: (e: number) => void
}>()
</script>

<template>
  <div class="d-flex ga-4 justify-center">
    <v-select
      :model-value="month"
      :items="months"
      variant="outlined"
      max-width="fit-content"
      @update:model-value="handleMonthChange"
    />
    <v-select
      :model-value="year"
      :items="years"
      variant="outlined"
      max-width="fit-content"
      @update:model-value="handleYearChange"
    />
  </div>
</template>
