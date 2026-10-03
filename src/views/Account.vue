<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { motion } from 'motion-v'
import { LogOut, MessageCircle, FileText } from 'lucide-vue-next'
import { makeInvoice } from '../invoice'
import { user, orders, saveProfile, signOut } from '../store'
import { fmtXOF as fmt, waLink, orderText } from '../data'
import { t, st, LOC, tst } from '../i18n'
const router = useRouter(), tab = ref('cmd'), list = ref([]), loaded = ref(false), saved = ref(false)
const p = reactive({ full_name: user.value.full_name || '', phone: user.value.phone || '' })
onMounted(async () => { list.value = await orders(); loaded.value = true })
const d = x => new Date(x).toLocaleDateString(LOC[st.lang], { day: '2-digit', month: 'long', year: 'numeric' })
const save = async () => { await saveProfile({ ...p }); saved.value = true; setTimeout(() => (saved.value = false), 2000) }
const out = async () => { await signOut(); router.push('/') }
const invoice = o => makeInvoice({ ...o, customer: o.customer || user.value })
</script>
<template>
  <main class="dpage">
    <div class="dtop">
      <h1>{{ t('acc.hello') }} {{ (user.full_name || '').split(' ')[0] }} ♥</h1>
      <button class="btn line dk" type="button" @click="out"><LogOut :size="17" /> {{ t('acc.logout') }}</button>
    </div>
    <div class="chips"><button v-for="tb in [['cmd', t('acc.orders')], ['profil', t('acc.profile')]]" :key="tb[0]" type="button" class="chip dk" :class="{ on: tab === tb[0] }" @click="tab = tb[0]">{{ tb[1] }}</button></div>
    <template v-if="tab === 'cmd'">
      <p v-if="loaded && !list.length" class="empty">{{ t('acc.none') }}</p>
      <div class="olist">
        <motion.article v-for="(o, i) in list" :key="o.id" class="ocard" :initial="{ opacity: 0, y: 24 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: i * 0.07 }">
          <header><b>BL-{{ o.num }}</b><span class="pill" :data-s="o.status">{{ tst(o.status) }}</span></header>
          <small>{{ d(o.created_at) }} · {{ o.address }}</small>
          <ul><li v-for="(it, k) in o.items" :key="k"><span>{{ it.qty }} × {{ it.name }}<em v-if="it.size"> ({{ it.size }})</em></span><b>{{ fmt(it.price * it.qty) }}</b></li></ul>
          <footer><b>{{ t('cart.total') }} {{ fmt(o.total) }}</b><button v-if="o.status === 'Livrée'" class="btn sm" type="button" @click="invoice(o)"><FileText :size="16" /> {{ t('acc.invoice') }}</button><a class="btn wa sm" :href="waLink(orderText(o, user))" target="_blank" rel="noopener"><MessageCircle :size="16" /> {{ t('acc.wa') }}</a></footer>
        </motion.article>
      </div>
    </template>
    <form v-else class="pform" @submit.prevent="save">
      <label class="fld">{{ t('auth.name') }}<input v-model="p.full_name" required /></label>
      <label class="fld">{{ t('auth.phone') }}<input v-model="p.phone" type="tel" required /></label>
      <label class="fld">{{ t('auth.email') }}<input :value="user.email" disabled /></label>
      <button class="btn red">{{ t('acc.save') }}</button><p v-if="saved" class="msg ok">{{ t('acc.saved') }}</p>
    </form>
  </main>
</template>
