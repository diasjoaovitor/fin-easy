<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'
import type { TFinanceModel, TFinanceType } from '@/models'
import type { TArgsCreate, TFormMode } from '@/types'
import { financeSchema, type TFinanceFormData } from '@/schemas'
import {
  formatCurrencyMask,
  formatCurrencyToNumber,
  getButtonColor,
  transformToRecurringFinance
} from '@/utils'
import { useAppStore } from '@/stores'
import { authConfig } from '@/config'
import {
  expenseCategories,
  incomeCategories,
  recurringOptions,
  type TDefaultFinance
} from '@/constants'

const appStore = useAppStore()

const props = defineProps<{
  finance: TFinanceModel | TDefaultFinance
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
  value: formatCurrencyMask(props.finance.value * 100),
  frequency: recurringOptions.find(
    (option) => option.value === props.finance.frequency
  )!.label,
  numberOfRepeats: props.finance.numberOfRepeats
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
const frequencyField = useField<string>('frequency')
const numberOfRepeatsField = useField<number>('numberOfRepeats')

const isRecurring = computed(() => frequencyField.value.value !== 'Não repetir')

const categories = computed(() =>
  typeField.value.value === '-' ? expenseCategories : incomeCategories
)
const color = computed(() =>
  typeField.value.value === '+' ? 'primary' : 'error'
)

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
  () => typeField.value.value,
  () => {
    categoryField.value.value = 'Outros'
  },
  { immediate: true }
)

watch(
  () => dateField.value.value,
  (newDate) => {
    dateField.value.value = dayjs(newDate as string).format('YYYY-MM-DD')
  }
)

watch(
  () => frequencyField.value.value,
  () => {
    if (!isRecurring.value) {
      numberOfRepeatsField.value.value = 1
      return
    }

    if (numberOfRepeatsField.value.value === 1) {
      numberOfRepeatsField.value.value = 2
    }
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
  const { frequency, id, financeRef } = props.finance as TFinanceModel
  frequency === null
    ? await appStore.deleteFinance(id)
    : await appStore.deleteRecurringFinance(financeRef)
  dialog.value = false
  overlay.value = false
}

const submit = handleSubmit(async (values) => {
  const value = formatCurrencyToNumber(values.value) / 100
  const financeRef = uuid()

  if (props.mode === 'create') {
    const data: TArgsCreate<TFinanceModel> = {
      ...(props.finance as TDefaultFinance),
      ...values,
      value,
      userRef,
      financeRef,
      frequency: null
    }

    if (values.frequency === 'Não repetir') {
      await appStore.createFinance(data)
    } else {
      const recurringData = transformToRecurringFinance({
        ...data,
        frequency: recurringOptions.find(
          (option) => option.label === values.frequency
        )!.value
      })
      await appStore.createRecurringFinance(recurringData)
    }
  } else {
    if (values.frequency === 'Não repetir') {
      const data: TFinanceModel = {
        ...(props.finance as TFinanceModel),
        ...values,
        value,
        frequency: null
      }
      await appStore.updateFinance(data)
    } else {
      const data: TFinanceModel = {
        ...(props.finance as TFinanceModel),
        ...values,
        value,
        frequency: props.finance.frequency
      }
      await appStore.updateRecurringFinance(data)
    }
  }
  overlay.value = false
})
</script>

<template>
  <v-overlay
    v-model="overlay"
    class="d-flex flex-column align-center justify-center"
  >
    <div class="h-screen d-flex flex-column align-center justify-center pa-2">
      <v-card class="pa-6 overflow-auto" width="100vw" max-width="400">
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
          <v-radio-group v-model="categoryField.value.value">
            <fieldset class="pa-4 pt-2 rounded">
              <legend class="text-caption text-medium-emphasis">
                Categoria
              </legend>
              <div
                style="
                  display: grid;
                  grid-template-columns: 1fr 1fr 1fr;
                  gap: 4px;
                "
              >
                <v-label
                  v-for="{ icon, label } in categories"
                  :key="label"
                  class="cursor-pointer border rounded pa-2 d-block text-center"
                  :class="{
                    [`border-${color}`]: label === categoryField.value.value
                  }"
                >
                  <v-radio :value="label" class="d-none" />
                  <v-icon
                    :color="label !== categoryField.value.value ? '' : color"
                  >
                    {{ icon }}
                  </v-icon>
                  <div
                    class="text-caption"
                    :class="{
                      [`text-${color}`]: label === categoryField.value.value
                    }"
                  >
                    {{ label }}
                  </div>
                </v-label>
              </div>
            </fieldset>
          </v-radio-group>
          <v-text-field
            v-model.trim="descriptionField.value.value"
            :error-messages="descriptionField.errorMessage.value"
            label="Descrição"
            variant="outlined"
            :color="color"
          />
          <v-text-field
            v-model="valueField.value.value"
            :error-messages="valueField.errorMessage.value"
            label="Valor"
            variant="outlined"
            :color="color"
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
            :color="color"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            :disabled="props.finance.frequency !== null"
          />
          <v-expansion-panels class="mb-4">
            <v-expansion-panel
              :title="
                mode === 'create'
                  ? 'Adicionar recorrência'
                  : 'Editar Recorrência'
              "
            >
              <v-expansion-panel-text>
                <div class="d-flex ga-2">
                  <v-select
                    v-model="frequencyField.value.value"
                    class="w-100"
                    :items="recurringOptions.map((option) => option.label)"
                    variant="outlined"
                    label="Frequência"
                    :color="color"
                    :disabled="mode === 'update'"
                  />
                  <v-text-field
                    v-model="numberOfRepeatsField.value.value"
                    class="flex-1-1"
                    label="Repetir"
                    variant="outlined"
                    type="number"
                    :min="!isRecurring ? 1 : 2"
                    :disabled="!isRecurring || mode === 'update'"
                    :color="color"
                  />
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
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
    </div>
  </v-overlay>
  <Dialog
    :dialog="dialog"
    title="Atenção"
    text="Deseja realmente excluir este lançamento?"
    :confirm="handleDelete"
    @close:dialog="dialog = $event"
  />
</template>
