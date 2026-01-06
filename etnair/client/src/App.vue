<template>
  <div id="app">
    <HeaderComponent />
    <main>
      <RouterView />
    </main>
    <FooterComponent />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import HeaderComponent from '@/components/layout/HeaderComponent.vue'
import FooterComponent from '@/components/layout/FooterComponent.vue'
</script>

<style scoped>
main {
  min-height: calc(100vh - 120px);
}
</style>