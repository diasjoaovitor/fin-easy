<script setup lang="ts">
import { ref } from 'vue'
import { navItems } from '@/constants'
import { useAppStore } from '@/stores'
import { authConfig } from '@/config'

const items = ref(navItems)
const theme = ref('dark')
const drawer = ref(false)

const router = useRouter()
const route = useRoute()
const path = ref(route.path)

const user = ref(authConfig.currentUser)

const store = useAppStore()

const publicRoutes = ['/signin', '/signup', '/verify-email', '/reset-password']

authConfig.onAuthStateChanged((u) => {
  if (u?.emailVerified) {
    router.push('/')
  } else if (u?.emailVerified === false) {
    router.push('/verify-email')
    return
  } else {
    router.push('/signin')
  }

  user.value = u
  store.isLoading = false
})

watch(
  () => route.path,
  (newPath) => {
    path.value = newPath
  }
)

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>

<template>
  <v-app v-if="publicRoutes.includes(path)" :theme="theme">
    <v-container
      class="position-relative flex-1-1 d-flex flex-column align-center justify-center"
    >
      <RouterView />
    </v-container>
  </v-app>
  <Loader v-else-if="!user" />
  <v-app v-else :theme="theme">
    <v-app-bar>
      <v-app-bar-nav-icon
        variant="text"
        :icon="drawer ? 'mdi-close' : 'mdi-menu'"
        @click="toggleDrawer"
      />
      <v-app-bar-title>FinEasy</v-app-bar-title>
      <v-btn
        :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        @click="toggleTheme"
      />
      <v-btn icon="mdi-logout" @click="store.signOut" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :title="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :slim="true"
          :active="path === item.to"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="position-relative">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
  <Loader />
  <Alert />
</template>
