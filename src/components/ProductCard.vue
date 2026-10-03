<script setup>
import { motion } from 'motion-v'
import { Play } from 'lucide-vue-next'
import { fmt, PH } from '../data'
import { t, pname } from '../i18n'
defineProps({ p: Object, i: { type: Number, default: 0 } })
</script>
<template>
  <motion.div :initial="{ opacity: 0, y: 50 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true, amount: 0.15 }" :whileHover="{ y: -6 }" :transition="{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }">
    <RouterLink :to="'/produit/' + p.id" class="pcard">
      <div class="pimg">
        <img :src="p.images[0] || PH" :alt="pname(p)" loading="lazy" />
        <img v-if="p.images[1]" class="alt" :src="p.images[1]" alt="" loading="lazy" />
        <span v-if="p.video" class="vb"><Play :size="13" /> {{ t('card.video') }}</span>
      </div>
      <h3>{{ pname(p) }}</h3><b class="price">{{ fmt(p.price) }}</b><span class="more">{{ t('card.more') }}</span>
    </RouterLink>
  </motion.div>
</template>
