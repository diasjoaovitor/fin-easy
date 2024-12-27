<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const overlay = ref(appStore.isLoading)

watchEffect(() => {
  overlay.value = appStore.isLoading
})
</script>

<template>
  <v-overlay v-model="overlay" class="align-center justify-center">
    <v-progress-circular indeterminate size="64" color="primary" />
  </v-overlay>
</template>
