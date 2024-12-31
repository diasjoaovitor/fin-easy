<script setup lang="ts">
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import type { TAuthFormField } from '@/types'

const props = defineProps<{
  title: string
  fields: TAuthFormField[]
  schema: yup.ObjectSchema<any>
  request: (values: any) => Promise<void>
}>()

const { handleSubmit } = useForm({
  validationSchema: props.schema
})

const veeFields = props.fields.reduce(
  (acc, field) => {
    acc[field.name] = useField(field.name)
    return acc
  },
  {} as Record<string, ReturnType<typeof useField>>
)

const submit = handleSubmit(async (values) => {
  await props.request(values)
})
</script>

<template>
  <div class="d-flex flex-column justify-center align-center flex-1-1">
    <v-card width="100vw" max-width="400">
      <v-card-title class="mb-4 mt-2">
        <v-icon class="mr-2">mdi-account-circle</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-form novalidate @submit.prevent="submit">
          <v-text-field
            v-for="field in fields"
            :key="field.name"
            v-model.trim="veeFields[field.name].value.value"
            :error-messages="veeFields[field.name].errorMessage.value"
            :label="field.label"
            :type="field.type"
            variant="outlined"
          />
          <v-btn color="primary" type="submit" class="mb-4 w-100">
            {{ title }}
          </v-btn>
        </v-form>
        <slot />
      </v-card-text>
    </v-card>
  </div>
</template>
