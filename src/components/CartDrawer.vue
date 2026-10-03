<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { motion, AnimatePresence } from 'motion-v'
import { X, Plus, Minus, Trash2, MessageCircle } from 'lucide-vue-next'
import { cart, total } from '../cart'
import { user, createOrder } from '../store'
import { fmt, fmtXOF, waLink, orderText } from '../data'
import { t, st, pname } from '../i18n'
import { catalog } from '../catalog'
const lname = i => pname(catalog.products.find(x => x.id === i.id) || i)
const router = useRouter(), address = ref(''), note = ref(''), err = ref(''), busy = ref(false)
const qty = (i, d) => { i.qty += d; if (i.qty < 1) cart.items.splice(cart.items.indexOf(i), 1) }
const login = () => { cart.open = false; router.push({ path: '/connexion', query: { redirect: '/' } }) }
async function order() {
  err.value = ''
  if (!address.value.trim()) return (err.value = t('cart.addr_err'))
  busy.value = true
  const w = window.open('', '_blank') // ouvert dans le clic pour éviter le blocage des pop-ups
  try {
    const o = await createOrder({ items: cart.items.map(({ name, price, size, qty }) => ({ name, price, size, qty })), total: total.value, address: address.value, note: note.value })
    const link = waLink(orderText(o, user.value))
    w ? (w.location = link) : (window.location.href = link)
    cart.items = []; cart.open = false; address.value = note.value = ''; router.push('/compte')
  } catch (e) { w?.close(); err.value = t('cart.fail') } finally { busy.value = false }
}
</script>
<template>
  <AnimatePresence>
    <motion.div v-if="cart.open" key="ov" class="overlay" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" @click="cart.open = false" />
  </AnimatePresence>
  <AnimatePresence>
    <motion.aside v-if="cart.open" key="dr" class="drawer" aria-label="Panier" :initial="{ x: '100%' }" :animate="{ x: 0 }" :exit="{ x: '100%' }" :transition="{ type: 'spring', stiffness: 260, damping: 30 }">
      <div class="dh"><h2>{{ t('cart.title') }}</h2><button class="ib dark" type="button" aria-label="Fermer" @click="cart.open = false"><X :size="20" /></button></div>
      <p v-if="!cart.items.length" class="empty">{{ t('cart.empty') }}</p>
      <ul class="lines">
        <motion.li v-for="i in cart.items" :key="i.key" layout :initial="{ opacity: 0, x: 30 }" :animate="{ opacity: 1, x: 0 }">
          <img :src="i.image" alt="" />
          <div><b>{{ lname(i) }}</b><small v-if="i.size">{{ t('p.size') }} {{ i.size }}</small><span>{{ fmt(i.price * i.qty) }}</span></div>
          <div class="qty"><button type="button" aria-label="Moins" @click="qty(i, -1)"><Minus v-if="i.qty > 1" :size="15" /><Trash2 v-else :size="15" /></button><em>{{ i.qty }}</em><button type="button" aria-label="Plus" @click="qty(i, 1)"><Plus :size="15" /></button></div>
        </motion.li>
      </ul>
      <div v-if="cart.items.length" class="df">
        <div class="tot"><span>{{ t('cart.total') }}</span><b>{{ fmt(total) }}</b></div>
        <small v-if="st.cur !== 'XOF'" class="hint">{{ t('cart.fcfa') }} <b>{{ fmtXOF(total) }}</b></small>
        <template v-if="user">
          <label class="fld">{{ t('cart.addr') }}<input v-model="address" :placeholder="t('cart.addr_ph')" /></label>
          <label class="fld">{{ t('cart.note') }}<input v-model="note" :placeholder="t('cart.note_ph')" /></label>
          <p v-if="err" class="msg error">{{ err }}</p>
          <button class="btn wa" type="button" :disabled="busy" @click="order"><MessageCircle :size="19" /> {{ busy ? t('cart.saving') : t('cart.order') }}</button>
          <small class="hint">{{ t('cart.hint') }}</small>
        </template>
        <template v-else>
          <button class="btn" type="button" @click="login">{{ t('cart.login') }}</button>
          <small class="hint">{{ t('cart.hint2') }}</small>
        </template>
      </div>
    </motion.aside>
  </AnimatePresence>
</template>
