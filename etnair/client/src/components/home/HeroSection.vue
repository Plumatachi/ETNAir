<template>
  <div class="home">
    <HeroSection />
    <AnnouncementsList />
    <FeaturesSection />
  </div>
</template>

<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import AnnouncementsList from '@/components/home/HomesList.vue'
import FeaturesSection from '@/components/home/FeaturesSection.vue'
</script>