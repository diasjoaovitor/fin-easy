<script setup lang="ts">
import dayjs from 'dayjs'
import type { TFinance } from '@/models'
import { formatCurrency } from '@/utils'

defineProps<{ items: TFinance[] }>()

const emit = defineEmits(['select:finance'])
</script>

<template>
  <v-list class="pa-4 rounded d-flex flex-column ga-2">
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
        <div v-if="item.description">
          <v-list-item-subtitle class="text-caption">
            {{ item.category }}
          </v-list-item-subtitle>
          <v-list-item-title class="text-h6">
            {{ item.description }}
          </v-list-item-title>
        </div>
        <div v-else>
          <v-list-item-title class="text-h6">
            {{ item.category }}
          </v-list-item-title>
        </div>
        <div>
          <v-list-item-subtitle class="text-caption text-right">
            {{ dayjs(item.date).format('DD/MM/YYYY') }}
          </v-list-item-subtitle>
          <v-list-item-title class="text-h6">
            {{ formatCurrency(item.value) }}
          </v-list-item-title>
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
