<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Globe, Check } from 'lucide-vue-next'
import { st, t, LANGS, CURS, setLang, setCur } from '../i18n'
const open = ref(false), root = ref(null)
const away = e => { if (open.value && !root.value?.contains(e.target)) open.value = false }
const esc = e => e.key === 'Escape' && (open.value = false)
onMounted(() => { document.addEventListener('click', away); document.addEventListener('keydown', esc) })
onBeforeUnmount(() => { document.removeEventListener('click', away); document.removeEventListener('keydown', esc) })
</script>
<template>
  <div ref="root" class="prefs">
    <button class="ib pbtn" type="button" :aria-expanded="open" :aria-label="t('prefs')" @click="open = !open"><Globe :size="20" /><span>{{ st.lang.toUpperCase() }} · {{ st.cur }}</span></button>
    <AnimatePresence>
      <motion.div v-if="open" class="pop" :initial="{ opacity: 0, y: -10, scale: 0.96 }" :animate="{ opacity: 1, y: 0, scale: 1 }" :exit="{ opacity: 0, y: -10, scale: 0.96 }" :transition="{ duration: 0.2 }">
        <p class="pt">{{ t('prefs.lang') }}</p>
        <div class="plist"><button v-for="l in LANGS" :key="l.id" type="button" :class="{ on: st.lang === l.id }" @click="setLang(l.id)"><Check v-if="st.lang === l.id" :size="14" />{{ l.label }}</button></div>
        <p class="pt">{{ t('prefs.cur') }}</p>
        <div class="plist"><button v-for="c in CURS" :key="c.id" type="button" :class="{ on: st.cur === c.id }" @click="setCur(c.id)"><Check v-if="st.cur === c.id" :size="14" />{{ c.label }}</button></div>
        <small class="hint">{{ t('prefs.note') }}</small>
      </motion.div>
    </AnimatePresence>
  </div>
</template>
