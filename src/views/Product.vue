<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { motion, AnimatePresence } from 'motion-v'
import { Minus, Plus, MessageCircle, Play, ArrowLeft, ShoppingBag } from 'lucide-vue-next'
import { catalog } from '../catalog'
import { add, cart } from '../cart'
import { ui } from '../ui'
import { fmt, embed, waLink, PH } from '../data'
import Title from '../components/Title.vue'
import { t, cname, pname, pdesc } from '../i18n'
import DarkSection from '../components/DarkSection.vue'
import ProductCard from '../components/ProductCard.vue'
const route = useRoute()
const p = computed(() => catalog.products.find(x => String(x.id) === route.params.id))
const idx = ref(0), size = ref(''), qty = ref(1), added = ref(false), shown = ref(0)
const show = computed(() => ui.phase !== 'cover') // l'entrée démarre quand le rideau s'ouvre
const ease = [0.22, 1, 0.36, 1]
const enter = d => ({ initial: { opacity: 0, y: 28 }, animate: show.value ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.75, delay: d, ease } })
watch(p, v => { idx.value = 0; qty.value = 1; size.value = v?.sizes?.[0] || '' }, { immediate: true })
watch([p, show], ([v, s]) => { // le prix « monte » jusqu'à sa valeur
  if (!v || !s) return
  const t0 = performance.now(), to = v.price
  const f = () => { const k = Math.min(1, (performance.now() - t0) / 1000); shown.value = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f) }
  shown.value = 0; setTimeout(f, 700)
}, { immediate: true })
const media = computed(() => !p.value ? [] : [...(p.value.images.length ? p.value.images : [PH]).map(src => ({ type: 'img', src })), ...(p.value.video ? [{ type: 'video', src: p.value.video }] : [])])
const cur = computed(() => media.value[idx.value]), em = computed(() => (cur.value?.type === 'video' ? embed(cur.value.src) : {}))
const cat = computed(() => catalog.categories.find(c => c.id === p.value?.category))
const related = computed(() => catalog.products.filter(x => x.active !== false && x.category === p.value?.category && x.id !== p.value?.id).slice(0, 4))
function put() { add(p.value, size.value, qty.value); added.value = true; cart.open = true; setTimeout(() => (added.value = false), 1500) }
const ask = () => window.open(waLink(`Bonjour BIN LENOIR ♥\nJe suis intéressé(e) par : ${p.value.name}${size.value ? ' (taille ' + size.value + ')' : ''}\n${location.href}`), '_blank')
</script>
<template>
  <main>
    <div v-if="p" :key="p.id" class="pp">
      <div class="gal">
        <motion.div v-bind="enter(0.05)"><RouterLink to="/#boutique" class="back"><ArrowLeft :size="16" /> {{ t('nav.shop') }}</RouterLink></motion.div>
        <motion.div class="stage" :initial="{ clipPath: 'inset(100% 0 0 0)' }" :animate="show ? { clipPath: 'inset(0% 0 0 0)' } : {}" :transition="{ duration: 1, delay: 0.1, ease: [0.76, 0, 0.24, 1] }">
          <AnimatePresence mode="wait">
            <motion.div :key="idx" class="sfill" :initial="{ opacity: 0, scale: 1.22 }" :animate="show ? { opacity: 1, scale: 1 } : {}" :exit="{ opacity: 0 }" :transition="{ duration: 1.3, ease }">
              <img v-if="cur.type === 'img'" :src="cur.src" :alt="p.name" />
              <iframe v-else-if="em.iframe" :src="em.iframe" title="Vidéo du produit" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture"></iframe>
              <video v-else :src="em.file" controls playsinline></video>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <div v-if="media.length > 1" class="thumbs">
          <motion.button v-for="(m, i) in media" :key="i" v-bind="enter(0.8 + i * 0.08)" type="button" :class="{ on: idx === i }" :aria-label="m.type === 'video' ? 'Voir la vidéo' : 'Photo ' + (i + 1)" @click="idx = i">
            <img v-if="m.type === 'img'" :src="m.src" alt="" /><span v-else class="vth"><Play :size="20" /></span>
          </motion.button>
        </div>
      </div>
      <div class="pinfo">
        <motion.small v-if="cat" v-bind="enter(0.35)">{{ cname(cat) }}</motion.small>
        <Title tag="h1" cls="ptitle" :text="pname(p)" :go="show" :delay="0.4" />
        <motion.b class="pprice" v-bind="enter(0.7)">{{ fmt(shown) }}</motion.b>
        <motion.p v-if="p.description" class="pdesc" v-bind="enter(0.85)">{{ pdesc(p) }}</motion.p>
        <motion.div v-if="p.sizes.length" class="szrow" v-bind="enter(1)"><span>{{ t('p.size') }}</span><div><button v-for="s in p.sizes" :key="s" type="button" class="sz" :class="{ on: size === s }" @click="size = s">{{ s }}</button></div></motion.div>
        <motion.div class="szrow" v-bind="enter(1.1)"><span>{{ t('p.qty') }}</span><div class="qty big"><button type="button" aria-label="Moins" @click="qty > 1 && qty--"><Minus :size="16" /></button><em>{{ qty }}</em><button type="button" aria-label="Plus" @click="qty++"><Plus :size="16" /></button></div></motion.div>
        <motion.button class="btn red lg" type="button" v-bind="enter(1.2)" :whileTap="{ scale: 0.97 }" @click="put"><ShoppingBag :size="19" /> {{ added ? t('p.added') : t('p.add') }}</motion.button>
        <motion.button class="btn line dk" type="button" v-bind="enter(1.3)" @click="ask"><MessageCircle :size="18" /> {{ t('p.ask') }}</motion.button>
      </div>
    </div>
    <div v-else-if="catalog.loaded" class="pp none"><p>{{ t('p.gone') }}</p><RouterLink class="btn" to="/#boutique">{{ t('p.back') }}</RouterLink></div>
    <DarkSection v-if="p && related.length" cls="rel"><Title :text="t('p.related')" /><div class="pgrid"><ProductCard v-for="(r, i) in related" :key="r.id" :p="r" :i="i" /></div></DarkSection>
  </main>
</template>
