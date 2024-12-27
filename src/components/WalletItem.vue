<script setup lang="ts">
import { formatCurrency } from '@/utils'

const { color } = defineProps<{
  label: string
  value: number
  icon: string
  color: string
}>()

const style = ref(`border-color: rgb(var(--v-theme-${color})) !important`)

watch(
  () => color,
  (newColor) => {
    style.value = `border-color: rgb(var(--v-theme-${newColor})) !important`
  }
)
</script>

<template>
  <v-card
    class="d-flex justify-space-between align-center border-lg flex-fill"
    :style="style"
  >
    <div>
      <v-card-title
        class="text-subtitle-1 pb-0 text-medium-emphasis font-weight-regular"
      >
        {{ label }}
      </v-card-title>
      <v-card-text class="text-h4">
        {{ formatCurrency(value) }}
      </v-card-text>
    </div>
    <v-icon :icon="icon" class="text-h2 text-medium-emphasis" />
  </v-card>
</template>
