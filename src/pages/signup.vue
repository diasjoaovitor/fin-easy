<script setup lang="ts">
import { signUpFields } from '@/constants'
import { signUpSchema } from '@/schemas'
import { useAppStore } from '@/stores'

const store = useAppStore()
</script>

<template>
  <AuthFormLayout
    title="Sign Up"
    :fields="signUpFields"
    :schema="signUpSchema"
    :request="store.signUp"
  >
    <RouterLink to="/signin" variant="text" class="mb-1 text-center d-block">
      Já tenho uma conta
    </RouterLink>
  </AuthFormLayout>
</template>
