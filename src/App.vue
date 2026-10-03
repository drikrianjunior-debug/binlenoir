<script setup>
import { ref, computed, onMounted } from 'vue'
import { t, words } from './i18n'
import { motion, MotionConfig, useScroll } from 'motion-v'
import { ui } from './ui'
import Navbar from './components/Navbar.vue'
import CartDrawer from './components/CartDrawer.vue'
import Curtain from './components/Curtain.vue'
const phase = ref(0), prog = ref(0) // phase : 0 chargement · 1 ouverture · 2 terminé
const slogan = computed(() => words(t('slogan')))
const { scrollYProgress } = useScroll()
function leave() { phase.value = 1; ui.ready = true; document.body.style.overflow = ''; setTimeout(() => (phase.value = 2), 1400) }
onMounted(() => {
  document.body.style.overflow = 'hidden'
  document.addEventListener('click', e => { // le type de transition dépend du clic
    const a = e.target.closest?.('a.pcard')
    ui.kind = a ? 'bloom' : 'wipe'; if (a) { ui.x = e.clientX; ui.y = e.clientY }
  }, true)
  const t0 = performance.now(), D = 3400
  const tick = () => { prog.value = Math.min(100, Math.round(((performance.now() - t0) / D) * 100)); prog.value < 100 ? requestAnimationFrame(tick) : setTimeout(leave, 250) }
  tick()
})
</script>
<template>
  <MotionConfig reducedMotion="user">
    <motion.div class="progress" :style="{ scaleX: scrollYProgress }" />
    <div v-if="phase < 2" class="pre">
      <motion.div class="pnl top" :animate="{ y: phase >= 1 ? '-101%' : '0%' }" :transition="{ duration: 1, ease: [0.76, 0, 0.24, 1] }" />
      <motion.div class="pnl bot" :animate="{ y: phase >= 1 ? '101%' : '0%' }" :transition="{ duration: 1, ease: [0.76, 0, 0.24, 1] }" />
      <motion.div class="pcont" :animate="phase >= 1 ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }" :transition="{ duration: 0.5 }">
        <div class="bl"><span class="lm"><motion.span v-for="(c, i) in ['B', 'L']" :key="c" :initial="{ y: '110%' }" :animate="{ y: 0 }" :transition="{ delay: 0.2 + i * 0.22, duration: 0.9, ease: [0.22, 1, 0.36, 1] }">{{ c }}</motion.span></span>
          <motion.i class="ph" :initial="{ scale: 0, rotate: -40 }" :animate="{ scale: [0, 1.4, 1], rotate: 0 }" :transition="{ delay: 0.9, duration: 0.8 }">♥</motion.i></div>
        <div class="pbar"><motion.div :style="{ width: prog + '%' }" /></div>
        <p class="pslogan"><span v-for="(w, i) in slogan" :key="i" class="tw"><motion.span class="tin" :initial="{ y: '120%' }" :animate="{ y: 0 }" :transition="{ delay: 1.1 + i * 0.16, duration: 0.8, ease: [0.22, 1, 0.36, 1] }">{{ w }}</motion.span></span></p>
      </motion.div>
    </div>
    <Navbar />
    <RouterView />
    <CartDrawer />
    <Curtain />
  </MotionConfig>
</template>
