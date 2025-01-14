<script setup lang="ts">
import dayjs from 'dayjs'
import type { TFinanceModel } from '@/models'
import { formatCurrency } from '@/utils'
import { expenseCategories, incomeCategories } from '@/constants'

defineProps<{ items: TFinanceModel[] }>()

const emit = defineEmits(['select:finance'])
</script>

<template>
  <v-list class="pa-2 rounded d-flex flex-column ga-2">
    <v-list-item v-if="items.length === 0">
      <v-list-item-title> Nenhum lançamento encontrado </v-list-item-title>
    </v-list-item>
    <v-list-item
      v-for="item in items"
      :key="item.id"
      class="border-lg rounded"
      :style="`border-color: rgb(var(--v-theme-${item.type === '-' ? 'error' : 'primary'})) !important`"
      @click="emit('select:finance', item)"
    >
      <div class="d-flex flex-row justify-space-between align-center ga-2">
        <div class="d-flex flex-row align-center ga-4">
          <v-icon
            :icon="
              [...expenseCategories, ...incomeCategories].find(
                (category) => category.label === item.category
              )?.icon
            "
          />
          <div v-if="item.description">
            <h3 class="text-caption">
              {{ item.category }}
            </h3>
            <p class="text-h6">
              {{ item.description }}
              <span v-if="item.numberOfRepeats > 1">{{
                `${item.numberOfRepeat}/${item.numberOfRepeats}`
              }}</span>
            </p>
          </div>
          <div v-else>
            <p class="text-h6">
              {{ item.category }}
            </p>
          </div>
        </div>
        <div>
          <h3 class="text-caption text-right">
            {{ dayjs(item.date).format('DD/MM/YYYY') }}
          </h3>
          <p class="text-h6">
            {{ formatCurrency(item.value) }}
          </p>
        </div>
      </div>
    </v-list-item>
  </v-list>
</template>

<style scoped lang="scss">
@media screen and (min-width: 800px) {
  .v-list {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
