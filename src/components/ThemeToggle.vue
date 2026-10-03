<script setup>
import { motion, AnimatePresence } from 'motion-v'
import { Sun, Moon } from 'lucide-vue-next'
import { theme, toggleTheme } from '../theme'
import { t } from '../i18n'
</script>
<template>
  <button class="ib" type="button" :aria-label="theme === 'dark' ? t('theme.toLight') : t('theme.toDark')" @click="toggleTheme">
    <AnimatePresence mode="wait" :initial="false">
      <motion.span :key="theme" class="ico" :initial="{ rotate: -90, scale: 0, opacity: 0 }" :animate="{ rotate: 0, scale: 1, opacity: 1 }" :exit="{ rotate: 90, scale: 0, opacity: 0 }" :transition="{ duration: 0.25 }">
        <Sun v-if="theme === 'dark'" :size="20" /><Moon v-else :size="20" />
      </motion.span>
    </AnimatePresence>
  </button>
</template>
