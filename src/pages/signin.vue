<script setup lang="ts">
import { signInFields } from '@/constants'
import { signInSchema } from '@/schemas'
import { useAppStore } from '@/stores'

const store = useAppStore()
</script>

<template>
  <AuthFormLayout
    title="Sign In"
    :fields="signInFields"
    :schema="signInSchema"
    :request="store.signIn"
  >
    <RouterLink to="/signup" variant="text" class="mb-1 text-center d-block">
      Não tenho uma conta
    </RouterLink>
    <RouterLink to="/reset-password" variant="text" class="text-center d-block">
      Esqueci a senha
    </RouterLink>
  </AuthFormLayout>
</template>
