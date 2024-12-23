<script setup lang="ts">
import { ref } from 'vue'
import { navItems } from '@/constants'

const items = ref(navItems)
const theme = ref('dark')
const drawer = ref(false)

const route = useRoute()
const path = ref(route.path)

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
  <v-app :theme="theme">
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
</template>
