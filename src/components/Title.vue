<script setup>
import { motion } from 'motion-v'
import { words } from '../i18n'
defineProps({ cls: String, text: String, tag: { type: String, default: 'h2' }, go: { type: Boolean, default: undefined }, delay: { type: Number, default: 0 } })
</script>
<template>
  <component :is="tag" :class="['tt', cls]" :aria-label="text">
    <span v-for="(w, i) in words(text)" :key="i" class="tw" aria-hidden="true">
      <motion.span class="tin" :initial="{ y: '118%', rotate: 4 }" :whileInView="go === undefined ? { y: 0, rotate: 0 } : undefined" :animate="go === true ? { y: 0, rotate: 0 } : undefined"
        :viewport="{ once: true, amount: 0.8 }" :transition="{ duration: 0.85, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }">{{ w }}</motion.span>
    </span><slot />
  </component>
</template>
