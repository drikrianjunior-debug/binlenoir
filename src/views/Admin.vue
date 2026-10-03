<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { motion } from 'motion-v'
import { LayoutDashboard, Package, Users, Shirt, LogOut, MessageCircle, FileText } from 'lucide-vue-next'
import { makeInvoice } from '../invoice'
import { orders, customers, setStatus, signOut, demo } from '../store'
import { fmtXOF as fmt, waTo } from '../data'
import Logo from '../components/Logo.vue'
import CatalogAdmin from '../components/CatalogAdmin.vue'
const router = useRouter(), tab = ref('apercu'), list = ref([]), clients = ref([])
const STAT = ['En attente', 'Confirmée', 'Payée', 'Expédiée', 'Livrée', 'Annulée'], PAID = ['Confirmée', 'Payée', 'Expédiée', 'Livrée']
const tabs = [['apercu', 'Aperçu', LayoutDashboard], ['commandes', 'Commandes', Package], ['clients', 'Clients', Users], ['catalogue', 'Catalogue', Shirt]]
onMounted(async () => { [list.value, clients.value] = await Promise.all([orders(true), customers()]) })
const by = s => list.value.filter(o => o.status === s).length
const stats = computed(() => [['Commandes', list.value.length], ['En attente', by('En attente')], ['Chiffre d’affaires', fmt(list.value.filter(o => PAID.includes(o.status)).reduce((s, o) => s + o.total, 0))], ['Clients', clients.value.length]])
const change = async (o, s) => { await setStatus(o.id, s); o.status = s }
const d = x => new Date(x).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
const out = async () => { await signOut(); router.push('/') }
const invoice = o => makeInvoice(o)
</script>
<template>
  <div class="admin">
    <aside class="aside side">
      <Logo /><small>Administration</small>
      <nav><button v-for="t in tabs" :key="t[0]" type="button" :class="{ on: tab === t[0] }" @click="tab = t[0]"><component :is="t[2]" :size="19" /><span>{{ t[1] }}</span></button></nav>
      <button class="out" type="button" @click="out"><LogOut :size="18" /><span>Quitter</span></button>
    </aside>
    <main class="amain">
      <p v-if="demo" class="demo">Mode démo : les données sont stockées dans ce navigateur. Ajoutez vos clés Supabase pour passer en production.</p>
      <template v-if="tab === 'apercu'">
        <h1>Aperçu</h1>
        <div class="stats"><motion.div v-for="(s, i) in stats" :key="s[0]" class="stat" :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: i * 0.08 }"><small>{{ s[0] }}</small><b>{{ s[1] }}</b></motion.div></div>
        <h2>Commandes par statut</h2>
        <div class="bars"><div v-for="s in STAT" :key="s"><span>{{ s }}</span><div class="bar"><motion.i :initial="{ width: 0 }" :animate="{ width: (by(s) / Math.max(1, list.length)) * 100 + '%' }" :transition="{ duration: 0.8 }" /></div><b>{{ by(s) }}</b></div></div>
      </template>
      <template v-else-if="tab === 'commandes'">
        <h1>Commandes</h1>
        <p v-if="!list.length" class="empty">Aucune commande pour l'instant.</p>
        <div v-else class="tbl t-orders"><table>
          <thead><tr><th>N°</th><th>Client</th><th>Articles</th><th>Total</th><th>Date</th><th>Statut</th><th></th></tr></thead>
          <tbody><tr v-for="o in list" :key="o.id">
            <td><b>BL-{{ o.num }}</b></td><td>{{ o.customer?.full_name }}<small>{{ o.customer?.phone }}</small></td>
            <td><small v-for="(it, k) in o.items" :key="k">{{ it.qty }} × {{ it.name }}{{ it.size ? ' (' + it.size + ')' : '' }}</small><small>{{ o.address }}</small></td>
            <td>{{ fmt(o.total) }}</td><td>{{ d(o.created_at) }}</td>
            <td><select :value="o.status" :data-s="o.status" @change="change(o, $event.target.value)"><option v-for="s in STAT" :key="s">{{ s }}</option></select></td>
            <td><a class="btn wa sm" :href="waTo(o.customer?.phone)" target="_blank" rel="noopener" aria-label="Contacter sur WhatsApp"><MessageCircle :size="16" /></a> <button v-if="o.status === 'Livrée'" class="btn sm" type="button" @click="invoice(o)"><FileText :size="16" /> Facture</button></td>
          </tr></tbody></table></div>
      </template>
      <template v-else-if="tab === 'clients'">
        <h1>Clients</h1>
        <p v-if="!clients.length" class="empty">Aucun client inscrit.</p>
        <div v-else class="tbl t-clients"><table><thead><tr><th>Nom</th><th>Téléphone</th><th>E-mail</th><th></th></tr></thead>
          <tbody><tr v-for="c in clients" :key="c.id"><td>{{ c.full_name }}</td><td>{{ c.phone }}</td><td>{{ c.email }}</td><td><a class="btn wa sm" :href="waTo(c.phone)" target="_blank" rel="noopener" aria-label="WhatsApp"><MessageCircle :size="16" /></a></td></tr></tbody></table></div>
      </template>
      <CatalogAdmin v-else />
    </main>
  </div>
</template>
