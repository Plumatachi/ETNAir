<template>
  <div id="app">
    <Header />
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<style scoped>
main {
  min-height: calc(100vh - 120px);
}
</style>