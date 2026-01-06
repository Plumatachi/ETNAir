<template>
  <section class="hero relative font-stretch-125% flex items-center justify-center text-white">
    <div class="absolute inset-0 bg-linear-to-r from-blue-900/70 to-blue-600/70"></div>

    <div class="relative z-10 text-center px-4 max-w-4xl">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        Trouvez un logement unique,<br>où que vous soyez
      </h1>
      <p class="text-lg md:text-xl mb-8">
        Appartements, maisons et expériences sélectionnées avec soin
      </p>
      <RouterLink
          to="/recherche"
          class="inline-block px-8 py-3 bg-secondary text-white rounded-lg hover:bg-red-600 transition font-semibold"
      >
        Trouvez un bien à louer
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.hero {
  background: linear-gradient(to right, rgba(30, 58, 138, 0.7), rgba(37, 99, 235, 0.7)),
  url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200');
  background-size: cover;
  background-position: center;
}
</style>