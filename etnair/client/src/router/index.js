import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/recherche',
            name: 'search',
            component: () => import('@/views/SearchView.vue')
        },
        {
            path: '/a-propos',
            name: 'about',
            component: () => import('@/views/AboutView.vue')
        },
        {
            path: '/contact',
            name: 'contact',
            component: () => import('@/views/ContactView.vue')
        },
        {
            path: '/connexion',
            name: 'login',
            component: () => import('@/views/LoginView.vue')
        },
        {
            path: '/inscription',
            name: 'register',
            component: () => import('@/views/RegisterView.vue')
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

export default router