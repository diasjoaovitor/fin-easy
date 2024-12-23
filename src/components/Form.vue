<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import dayjs from 'dayjs'
import type { TFinance } from '@/models'
import type { TFormMode } from '@/types'
import { financeSchema } from '@/schemas'
import { formatCurrencyMask } from '@/utils'

const props = defineProps<{
  finance: TFinance
  mode: TFormMode
  overlay: boolean
}>()

const overlay = ref(props.overlay)

const { handleReset, handleSubmit, resetForm } = useForm({
  validationSchema: financeSchema,
  initialValues: {
    ...props.finance,
    value: formatCurrencyMask(props.finance.value * 100)
  }
})

const typeField = useField('type')
const categoryField = useField('category')
const descriptionField = useField('description')
const valueField = useField('value')
const dateField = useField('date')

const emit = defineEmits(['update:overlay'])

watch(
  () => props.overlay,
  (newOverlay) => {
    overlay.value = newOverlay
  }
)

watch(overlay, (newOverlay) => {
  emit('update:overlay', newOverlay)
  handleReset()
})

watch(
  () => dateField.value.value,
  (newDate) => {
    dateField.value.value = dayjs(newDate as string).format('YYYY-MM-DD')
  }
)

watch(
  () => props.finance,
  () => {
    resetForm({
      values: {
        ...props.finance,
        value: formatCurrencyMask(props.finance.value * 100)
      }
    })
  },
  { immediate: true }
)

const handleInput = (event: InputEvent) => {
  const input = event.target as HTMLInputElement
  const value = parseInt(input.value.replace(/\D/g, '')) || 0
  valueField.value.value = formatCurrencyMask(value)
}

const setCursorToEnd = (event: FocusEvent) => {
  const input = event.target as HTMLInputElement
  setTimeout(() => {
    input.setSelectionRange(input.value.length, input.value.length)
  }, 0)
}

const submit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2))
})
</script>

<template>
  <v-overlay v-model="overlay" class="align-center justify-center">
    <v-card class="pa-6" width="100vw" max-width="400">
      <v-card-title class="d-flex justify-space-between align-center pa-0">
        {{ mode === 'create' ? 'Novo lançamento' : 'Editar lançamento' }}
        <v-btn
          icon="mdi-arrow-left"
          class="relative"
          @click="overlay = false"
        />
      </v-card-title>
      <v-form novalidate @submit.prevent="submit">
        <v-radio-group
          v-model="typeField.value.value"
          :error-messages="typeField.errorMessage.value"
          inline
        >
          <v-radio label="Entrada" value="+" color="primary" />
          <v-radio label="Saída" value="-" color="error" />
        </v-radio-group>
        <v-text-field
          v-model.trim="categoryField.value.value"
          :error-messages="categoryField.errorMessage.value"
          label="Categoria"
          variant="outlined"
        />
        <v-text-field
          v-model.trim="descriptionField.value.value"
          :error-messages="descriptionField.errorMessage.value"
          label="Descrição"
          variant="outlined"
        />
        <v-text-field
          v-model="valueField.value.value"
          :error-messages="valueField.errorMessage.value"
          label="Valor"
          variant="outlined"
          prefix="R$"
          inputmode="numeric"
          @input="handleInput"
          @focus="setCursorToEnd"
        />
        <v-date-input
          v-model="dateField.value.value"
          :error-messages="dateField.errorMessage.value"
          type="date-local"
          label="Data"
          variant="outlined"
          prepend-icon=""
          prepend-inner-icon="$calendar"
        />
        <v-btn
          type="submit"
          :color="typeField.value.value === '-' ? 'error' : 'primary'"
          class="w-100"
        >
          Salvar
        </v-btn>
      </v-form>
    </v-card>
  </v-overlay>
</template>

<style scoped lang="scss">
.relative {
  position: relative;
  right: -10px;
}
</style>
