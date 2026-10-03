<script setup>
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import { MapPin, Phone, MessageCircle, Clock } from 'lucide-vue-next'
import { hours, ADDRESS, PHONE, WA, openNow, today, PH } from '../data'
import { catalog } from '../catalog'
import { ui } from '../ui'
import { t, cname } from '../i18n'
import Reveal from '../components/Reveal.vue'
import Title from '../components/Title.vue'
import DarkSection from '../components/DarkSection.vue'
import Divider from '../components/Divider.vue'
import Stamp from '../components/Stamp.vue'
import ScrollWords from '../components/ScrollWords.vue'
import ProductCard from '../components/ProductCard.vue'
import Logo from '../components/Logo.vue'
const filter = ref('all'), open = openNow(), td = today()
const active = computed(() => catalog.products.filter(p => p.active !== false))
const list = computed(() => (filter.value === 'all' ? active.value : active.value.filter(p => p.category === filter.value)))
const tileImg = id => active.value.find(p => p.category === id)?.images[0] || PH
const heroImgs = computed(() => [0, 1, 2].map(i => active.value[i]?.images[0] || `/img/cat-${['robes', 'bureau', 'ensembles'][i]}.svg`))
const pick = id => { filter.value = id; document.getElementById('boutique').scrollIntoView({ behavior: 'smooth' }) }
const slogan = computed(() => t('slogan'))
const steps = computed(() => t('steps'))
</script>
<template>
  <main>
    <section class="hero">
      <div class="hcopy">
        <Title tag="h1" :text="slogan" :go="ui.ready" :delay="0.6">
          <motion.i class="sheart" :initial="{ scale: 0, rotate: -50 }" :animate="ui.ready ? { scale: 1, rotate: 0 } : {}" :transition="{ type: 'spring', stiffness: 260, damping: 11, delay: 1.7 }">♥</motion.i>
        </Title>
        <motion.p :initial="{ opacity: 0, y: 16 }" :animate="ui.ready ? { opacity: 1, y: 0 } : {}" :transition="{ delay: 1.8, duration: 0.8 }">{{ t('hero.p') }}</motion.p>
        <motion.div class="cta" :initial="{ opacity: 0, y: 20 }" :animate="ui.ready ? { opacity: 1, y: 0 } : {}" :transition="{ delay: 2, duration: 0.8 }">
          <a class="btn red" href="#boutique" @click.prevent="pick('all')">{{ t('hero.cta') }}</a>
          <a class="btn line" :href="'https://wa.me/' + WA" target="_blank" rel="noopener"><MessageCircle :size="18" /> WhatsApp</a>
        </motion.div>
      </div>
      <div class="collage" aria-hidden="true">
        <motion.img v-for="(src, i) in heroImgs" :key="i" :class="'c' + i" :src="src" alt=""
          :initial="{ opacity: 0, y: 90, rotate: 0 }" :animate="ui.ready ? { opacity: 1, y: [0, -12, 0], rotate: [-7, 0, 7][i] } : {}" :transition="{ opacity: { delay: 0.6 + i * 0.15 }, rotate: { delay: 0.6 + i * 0.15, duration: 1 }, y: { delay: 1.6 + i * 0.4, duration: 5, repeat: Infinity, ease: 'easeInOut' } }" />
        <Stamp :go="ui.ready" />
      </div>
    </section>

    <div class="band" aria-hidden="true"><div class="track"><template v-for="n in 2" :key="n"><span v-for="b in ['Made in Africa', t('band.wa'), 'Cocody, Abidjan', t('band.qp')]" :key="b + n">{{ b }} <i>♥</i></span></template></div></div>

    <section id="collections" class="sec">
      <Title :text="t('nav.collections')" />
      <div class="tiles">
        <Reveal v-for="(c, i) in catalog.categories" :key="c.id" :delay="i * 0.07">
          <motion.button class="tile" type="button" :whileHover="{ scale: 1.03 }" @click="pick(c.id)"><img :src="tileImg(c.id)" :alt="c.name" loading="lazy" /><span>{{ cname(c) }}</span></motion.button>
        </Reveal>
      </div>
    </section>

    <DarkSection id="boutique">
      <Title :text="t('nav.shop')" />
      <div class="chips"><button v-for="c in [{ id: 'all', name: t('all') }, ...catalog.categories]" :key="c.id" type="button" class="chip" :class="{ on: filter === c.id }" @click="filter = c.id">{{ cname(c) }}</button></div>
      <p v-if="catalog.loaded && !list.length" class="empty light">{{ t('empty') }}</p>
      <motion.div layout class="pgrid"><ProductCard v-for="(p, i) in list" :key="p.id" :p="p" :i="i % 4" /></motion.div>
    </DarkSection>

    <ScrollWords :text="t('manifesto')" :by="'Mme FOFANA Bin’dia Abiba, ' + t('role')" />

    <section id="apropos" class="sec about">
      <Reveal>
        <Title :text="t('nav.about')" />
        <ul class="kw"><li v-for="k in t('kw')" :key="k">{{ k }}</li></ul>
      </Reveal>
      <Reveal :delay="0.1">
        <div class="prose"><p v-for="(para, i) in t('about')" :key="i" v-html="para"></p></div>
      </Reveal>
    </section>

    <section class="sec steps">
      <Title :text="t('steps.title')" />
      <div class="stp"><Reveal v-for="(s, i) in steps" :key="s[0]" :delay="i * 0.12"><div class="step"><em>{{ i + 1 }}</em><h3>{{ s[0] }}</h3><p>{{ s[1] }}</p></div></Reveal></div>
    </section>

    <Divider />

    <section id="infos" class="sec info">
      <Reveal>
        <Title :text="t('info.title')" />
        <p class="badge" :class="{ on: open }"><Clock :size="16" /> {{ open ? t('open') : t('closedNow') }}</p>
        <ul class="hours"><li v-for="(h, i) in hours" :key="h[0]" :class="{ now: i === td }"><span>{{ t('days')[i] }}</span><b>{{ h[1] === 'Fermé' ? t('closed') : h[1] }}</b></li></ul>
        <p class="row"><MapPin :size="18" /> Cocody 7ème tranche · {{ ADDRESS }}</p>
        <p class="row"><Phone :size="18" /> <a :href="'tel:+' + WA">{{ PHONE }}</a></p>
        <a class="btn wa" :href="'https://wa.me/' + WA" target="_blank" rel="noopener"><MessageCircle :size="18" /> {{ t('info.wa') }}</a>
      </Reveal>
      <Reveal :delay="0.1"><iframe class="map" title="Carte BIN LENOIR" loading="lazy" src="https://www.google.com/maps?q=92P7%2BJ2V%20Abidjan&output=embed"></iframe></Reveal>
    </section>

    <footer class="foot"><Logo /><span>{{ ADDRESS }} · {{ PHONE }}</span><span>© {{ new Date().getFullYear() }}</span></footer>
  </main>
</template>
