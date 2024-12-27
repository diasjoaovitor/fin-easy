<script setup lang="ts">
const props = defineProps<{
  dialog: boolean
  title: string
  text?: string
  confirm: () => void
}>()

const dialog = ref(props.dialog)

const emit = defineEmits(['close:dialog'])

watchEffect(() => {
  dialog.value = props.dialog
})

watch(dialog, (value) => {
  emit('close:dialog', value)
})
</script>

<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card
      prepend-icon="mdi-alert-circle-outline"
      :title="title"
      :text="text"
      class="pa-4"
    >
      <div>
        <v-btn color="error" class="mr-2 ml-6" @click="dialog = false">
          Não
        </v-btn>
        <v-btn color="success" @click="confirm">Sim</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
