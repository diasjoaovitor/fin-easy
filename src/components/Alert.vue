<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const alert = ref(appStore.alert)

watchEffect(() => {
  if (!appStore.alert) return
  alert.value = appStore.alert
  if (appStore.alert.open) {
    setTimeout(
      () => {
        alert.value = { ...appStore.alert, open: false }
      },
      appStore.alert.type === 'success' ? 3000 : 6000
    )
  }
})
</script>

<template>
  <div class="position-fixed top-0 right-0" style="z-index: 10000">
    <v-alert
      v-model="alert.open"
      :type="alert.type"
      :title="alert.title"
      :text="alert.text"
      density="compact"
      min-width="260"
      closable
    />
  </div>
</template>
