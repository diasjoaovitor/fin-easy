<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import dayjs from 'dayjs'
import type { TFinanceModel, TFinanceType } from '@/models'
import type { TFormMode } from '@/types'
import { financeSchema, type TFinanceFormData } from '@/schemas'
import {
  formatCurrencyMask,
  formatCurrencyToNumber,
  getButtonColor
} from '@/utils'
import { useAppStore } from '@/stores'
import { authConfig } from '@/config'

const appStore = useAppStore()

const props = defineProps<{
  finance: TFinanceModel
  mode: TFormMode
  overlay: boolean
}>()

const userRef = authConfig.currentUser?.uid as string

const overlay = ref(props.overlay)

const dialog = ref(false)

const initialValues = computed<TFinanceFormData>(() => ({
  category: props.finance.category,
  date: props.finance.date,
  description: props.finance.description,
  type: props.finance.type,
  value: formatCurrencyMask(props.finance.value)
}))

const { handleReset, handleSubmit, resetForm } = useForm({
  validationSchema: financeSchema,
  initialValues: initialValues.value
})

const typeField = useField<TFinanceType>('type')
const categoryField = useField<string>('category')
const descriptionField = useField<string>('description')
const valueField = useField<string>('value')
const dateField = useField<string>('date')

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
      values: initialValues.value
    })
  },
  { immediate: true }
)

const handleInput = (event: InputEvent) => {
  const input = event.target as HTMLInputElement
  const value = formatCurrencyToNumber(input.value)
  valueField.value.value = formatCurrencyMask(value)
}

const setCursorToEnd = (event: FocusEvent) => {
  const input = event.target as HTMLInputElement
  setTimeout(() => {
    input.setSelectionRange(input.value.length, input.value.length)
  }, 0)
}

const handleDelete = async () => {
  await appStore.deleteFinance(props.finance.id)
  dialog.value = false
  overlay.value = false
}

const submit = handleSubmit(async (values) => {
  const value = formatCurrencyToNumber(values.value) / 100
  props.mode === 'create'
    ? await appStore.createFinance({ ...values, value, userRef })
    : await appStore.updateFinance({ ...props.finance, ...values, value })
  overlay.value = false
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
          v-if="mode === 'create'"
          type="submit"
          :color="getButtonColor(typeField.value.value)"
          class="w-100"
        >
          Salvar
        </v-btn>
        <div v-else class="d-flex ga-2">
          <v-btn
            type="submit"
            :color="getButtonColor(typeField.value.value)"
            class="w-75"
          >
            Salvar
          </v-btn>
          <v-btn
            type="button"
            color="warning"
            class="flex-1-1"
            @click="dialog = true"
          >
            Excluir
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-overlay>
  <Dialog
    :dialog="dialog"
    title="Atenção"
    text="Deseja realmente excluir este lançamento?"
    :confirm="handleDelete"
    @close:dialog="dialog = $event"
  />
</template>

<style scoped lang="scss">
.relative {
  position: relative;
  right: -10px;
}
</style>
