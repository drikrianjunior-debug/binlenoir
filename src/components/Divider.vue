<script setup>
import { motion } from 'motion-v'
const line = { initial: { scaleX: 0 }, whileInView: { scaleX: 1 }, viewport: { once: true }, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }
</script>
<template>
  <div class="divider" aria-hidden="true">
    <motion.span class="ln l" v-bind="line" />
    <motion.i :initial="{ scale: 0, rotate: -45 }" :whileInView="{ scale: 1, rotate: 0 }" :viewport="{ once: true }" :transition="{ type: 'spring', stiffness: 300, damping: 11, delay: 0.7 }">♥</motion.i>
    <motion.span class="ln r" v-bind="line" />
  </div>
</template>
