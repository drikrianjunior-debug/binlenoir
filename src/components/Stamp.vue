<script setup>
import { motion } from 'motion-v'
defineProps({ go: Boolean })
</script>
<template>
  <motion.div class="stamp" :initial="{ scale: 2.6, rotate: -55, opacity: 0 }" :animate="go ? { scale: 1, rotate: -12, opacity: 1 } : {}" :transition="{ type: 'spring', stiffness: 230, damping: 13, delay: 2.1 }">
    <motion.svg viewBox="0 0 160 160" :animate="{ rotate: 360 }" :transition="{ duration: 26, repeat: Infinity, ease: 'linear' }">
      <defs><path id="circ" d="M80 80m-60 0a60 60 0 1 1 120 0a60 60 0 1 1-120 0" /></defs>
      <text><textPath href="#circ" textLength="370" lengthAdjust="spacing">BIN LENOIR ♥ ABIDJAN ♥ MADE IN AFRICA ♥</textPath></text>
    </motion.svg>
    <span class="mono">BL</span>
  </motion.div>
</template>
