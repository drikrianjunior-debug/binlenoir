<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { motion, AnimatePresence } from 'motion-v'
import { ShoppingBag, User, Menu, X } from 'lucide-vue-next'
import { cart, count } from '../cart'
import { user } from '../store'
import Logo from './Logo.vue'
import Prefs from './Prefs.vue'
import ThemeToggle from './ThemeToggle.vue'
import { t } from '../i18n'
const menu = ref(false), route = useRoute()
const items = [['/#collections', 'nav.collections'], ['/#boutique', 'nav.shop'], ['/#apropos', 'nav.about'], ['/#infos', 'nav.info']]
watch(() => route.fullPath, () => (menu.value = false))
const esc = e => e.key === 'Escape' && (menu.value = false)
onMounted(() => document.addEventListener('keydown', esc))
onBeforeUnmount(() => document.removeEventListener('keydown', esc))
</script>
<template>
  <header class="nav">
    <RouterLink to="/" aria-label="Accueil"><Logo /></RouterLink>
    <nav class="links" aria-label="Navigation">
      <RouterLink v-for="i in items" :key="i[0]" :to="i[0]">{{ t(i[1]) }}</RouterLink>
    </nav>
    <div class="acts">
      <Prefs />
      <ThemeToggle />
      <RouterLink class="ib" :to="user ? (user.role === 'admin' ? '/admin' : '/compte') : '/connexion'" aria-label="Mon compte"><User :size="21" /></RouterLink>
      <button class="ib" type="button" aria-label="Ouvrir le panier" @click="cart.open = true">
        <ShoppingBag :size="21" />
        <motion.b v-if="count" :key="count" class="cnt" :initial="{ scale: 0.3 }" :animate="{ scale: 1 }" :transition="{ type: 'spring', stiffness: 500, damping: 18 }">{{ count }}</motion.b>
      </button>
      <button class="ib burger" type="button" :aria-expanded="menu" aria-label="Menu" @click="menu = !menu"><X v-if="menu" :size="22" /><Menu v-else :size="22" /></button>
    </div>
    <AnimatePresence>
      <motion.nav v-if="menu" key="m" class="mpanel" aria-label="Menu" :initial="{ opacity: 0, y: -14 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: -14 }" :transition="{ duration: 0.25 }">
        <motion.div v-for="(i, n) in items" :key="i[0]" :initial="{ opacity: 0, x: -18 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.05 + n * 0.06 }"><RouterLink :to="i[0]">{{ t(i[1]) }}</RouterLink></motion.div>
      </motion.nav>
    </AnimatePresence>
  </header>
</template>
