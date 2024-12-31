<script setup lang="ts">
import { resetPasswordFields } from '@/constants'
import { resetPasswordSchema } from '@/schemas'
import { useAppStore } from '@/stores'

const store = useAppStore()
</script>

<template>
  <AuthFormLayout
    title="Recuperar senha"
    :fields="resetPasswordFields"
    :schema="resetPasswordSchema"
    :request="store.resetPassword"
  >
    <RouterLink to="/signin" variant="text" class="mb-1 text-center d-block">
      Já tenho uma conta
    </RouterLink>
    <RouterLink to="/signup" variant="text" class="mb-1 text-center d-block">
      Não tenho uma conta
    </RouterLink>
  </AuthFormLayout>
</template>
