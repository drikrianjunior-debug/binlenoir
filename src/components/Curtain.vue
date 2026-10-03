<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import { ui } from '../ui'
const idle = computed(() => ui.phase === 'idle')
const wipe = computed(() => (ui.kind !== 'wipe' ? { y: '100%' } : ui.phase === 'cover' ? { y: '0%' } : ui.phase === 'reveal' ? { y: '-100%' } : { y: '100%' }))
const R = () => Math.ceil(Math.hypot(window.innerWidth, window.innerHeight))
const bloom = computed(() => {
  const at = `at ${ui.x}px ${ui.y}px`
  if (ui.kind !== 'bloom' || idle.value) return { clipPath: `circle(0px ${at})`, opacity: 1 }
  return ui.phase === 'cover' ? { clipPath: `circle(${R()}px ${at})`, opacity: 1 } : { clipPath: `circle(${R()}px ${at})`, opacity: 0 }
})
const tr = computed(() => (idle.value ? { duration: 0 } : { duration: ui.phase === 'cover' ? 0.62 : 0.6, ease: [0.76, 0, 0.24, 1] }))
</script>
<template>
  <motion.div class="curtain wipe" aria-hidden="true" :initial="{ y: '100%' }" :animate="wipe" :transition="tr"><span>BL <i>♥</i></span></motion.div>
  <motion.div class="curtain bloom" aria-hidden="true" :initial="{ clipPath: 'circle(0px at 50% 50%)' }" :animate="bloom" :transition="tr" />
</template>
