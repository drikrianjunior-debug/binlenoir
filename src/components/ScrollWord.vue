<script setup>
import { motion, useTransform } from 'motion-v'
const props = defineProps({ word: String, progress: Object, range: Array })
const opacity = useTransform(props.progress, props.range, [0.15, 1])
</script>
<template><motion.span :style="{ opacity }">{{ word }}</motion.span></template>
