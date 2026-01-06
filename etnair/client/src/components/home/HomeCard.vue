<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer">
    <div class="h-48 bg-gray-300 flex items-center justify-center">
      <img
          v-if="home.image"
          :src="home.image"
          :alt="home.title"
          class="w-full h-full object-cover"
      />
      <span v-else class="text-gray-500">Image</span>
    </div>

    <div class="p-4">
      <h3 class="font-semibold text-lg mb-2">{{ home.title }}</h3>
      <p class="text-gray-600 text-sm mb-3">
        {{ 'À partir de ...' }}
      </p>
      <div class="flex justify-between items-center">
        <span class="text-primary font-bold">
          {{ formatPrice(home.price) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  home: {
    type: Object,
    required: true
  }
})

const formatPrice = (price) => {
  if (!price) return 'Prix sur demande'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}
</script>