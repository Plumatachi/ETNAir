<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Nouvelles annonces</h2>

      <div v-if="loading" class="text-center">
        <p class="text-gray-600">Chargement des annonces...</p>
      </div>

      <div v-else-if="error" class="text-center text-red-600">
        <p>{{ error }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HomeCard
            v-for="home in homes"
            :key="home.id"
            :home="home"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HomeCard from './HomeCard.vue'
import api from '@/services/api'

const homes = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await api.getHomes()
    homes.value = response.data
  } catch (err) {
    error.value = 'Impossible de charger les annonces'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>