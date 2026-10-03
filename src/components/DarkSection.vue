<script setup>
import { ref } from 'vue'
import { motion, useScroll, useTransform } from 'motion-v'
defineProps({ id: String, cls: String })
const el = ref(null)
const { scrollYProgress } = useScroll({ target: el, offset: ['start end', 'start 35%'] })
const r = useTransform(scrollYProgress, [0, 1], ['72px', '0px'])
const s = useTransform(scrollYProgress, [0, 1], [0.92, 1])
</script>
<template>
  <div ref="el" class="dwrap">
    <motion.section :id="id" :class="['sec dark', cls]" :style="{ borderTopLeftRadius: r, borderTopRightRadius: r, scale: s, transformOrigin: '50% 0%' }"><slot /></motion.section>
  </div>
</template>
