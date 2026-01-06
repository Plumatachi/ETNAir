<template>
  <header class="bg-primary text-white shadow-md">
    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
      <RouterLink to="/" class="flex items-center space-x-2">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span class="text-2xl font-bold">ETNAir</span>
      </RouterLink>

      <div class="hidden md:flex items-center space-x-6">
        <RouterLink to="/" class="hover:text-gray-200 transition">Accueil</RouterLink>
        <RouterLink to="/recherche" class="hover:text-gray-200 transition">Recherche</RouterLink>
        <RouterLink to="/a-propos" class="hover:text-gray-200 transition">À propos</RouterLink>
        <RouterLink to="/contact" class="hover:text-gray-200 transition">Contact</RouterLink>
      </div>

      <div class="flex items-center space-x-4">
        <RouterLink
            to="/inscription"
            class="hidden md:block px-4 py-2 bg-white text-primary rounded hover:bg-gray-100 transition"
        >
          Inscription
        </RouterLink>
        <RouterLink
            to="/connexion"
            class="px-4 py-2 border border-white rounded hover:bg-white hover:text-primary transition"
        >
          Connexion
        </RouterLink>
      </div>

      <button
          @click="toggleMenu"
          class="md:hidden flex flex-col space-y-1"
      >
        <span class="w-6 h-0.5 bg-white"></span>
        <span class="w-6 h-0.5 bg-white"></span>
        <span class="w-6 h-0.5 bg-white"></span>
      </button>
    </nav>

    <!-- Menu mobile -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-primary border-t border-blue-900">
      <div class="container mx-auto px-4 py-4 space-y-3">
        <RouterLink to="/" class="block hover:text-gray-200" @click="toggleMenu">Accueil</RouterLink>
        <RouterLink to="/recherche" class="block hover:text-gray-200" @click="toggleMenu">Recherche</RouterLink>
        <RouterLink to="/a-propos" class="block hover:text-gray-200" @click="toggleMenu">À propos</RouterLink>
        <RouterLink to="/contact" class="block hover:text-gray-200" @click="toggleMenu">Contact</RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const mobileMenuOpen = ref(false)

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>