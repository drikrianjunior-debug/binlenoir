<script setup>
import { ref, computed } from 'vue'
import { words as split, st } from '../i18n'
import { useScroll } from 'motion-v'
import ScrollWord from './ScrollWord.vue'
const props = defineProps({ text: String, by: String })
const el = ref(null), words = computed(() => split(props.text))
const { scrollYProgress } = useScroll({ target: el, offset: ['start start', 'end end'] })
const range = i => [0.06 + (0.64 * i) / words.value.length, 0.06 + (0.64 * (i + 1)) / words.value.length + 0.08]
</script>
<template>
  <div ref="el" class="mf">
    <div class="mfin">
      <p class="sw"><ScrollWord v-for="(w, i) in words" :key="st.lang + i" :word="w" :progress="scrollYProgress" :range="range(i)" /></p>
      <cite>{{ by }}</cite>
    </div>
  </div>
</template>
