<script setup>
import { motion } from 'motion-v'
defineProps({ delay: { type: Number, default: 0 } })
</script>
<template>
  <motion.div :initial="{ opacity: 0, y: 34 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true, amount: 0.2 }" :transition="{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }"><slot /></motion.div>
</template>
