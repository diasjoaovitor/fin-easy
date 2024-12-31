<script setup lang="ts">
import { authConfig } from '@/config'
import { useAppStore } from '@/stores'
import { useRouter } from 'vue-router'

const user = authConfig.currentUser

const store = useAppStore()
const router = useRouter()

if (user) {
  if (user.emailVerified) {
    router.push('/')
  }
}

const email = user?.email

const resend = async () => {
  if (!user) return
  await store.resendEmailVerification(user)
}
</script>

<template>
  <v-card>
    <v-card-title>
      <v-icon class="mr-2">mdi-email</v-icon>
      Verificar email
    </v-card-title>
    <v-card-text>
      <p>
        Enviamos um email de verificação para o endereço
        <strong>
          {{ email }}
        </strong>
        . Por favor, verifique sua caixa de entrada e clique no link de
        verificação.
      </p>
      <p class="my-2">
        Caso não tenha encontrado o email, verifique a caixa de spam ou clique
        no botão abaixo para reenviar o email de verificação.
      </p>
      <v-btn block color="primary" class="mt-4" @click="resend">
        Reenviar email de verificação
      </v-btn>
    </v-card-text>
  </v-card>
  <RouterLink to="/signin" class="mt-4 text-center">
    Voltar para a tela de login
  </RouterLink>
</template>
