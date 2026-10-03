<script setup>
import { ref, reactive } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Plus, Pencil, Trash2, X, Star, QrCode, Printer, Download } from 'lucide-vue-next'
import { productUrl, qrData, downloadLabel, printLabels } from '../qr'
import { catalog, saveProduct, deleteProduct, saveCategory, deleteCategory, uploadMedia, importSamples } from '../catalog'
import { fmtXOF as fmt, PH } from '../data'
import { LANGS } from '../i18n'
const OTHERS = LANGS.filter(l => l.id !== 'fr'), trLang = ref('en')
const withTr = o => Object.fromEntries(OTHERS.map(l => [l.id, { name: o?.[l.id]?.name || '', description: o?.[l.id]?.description || '' }]))
const sub = ref('articles'), editing = ref(false), busy = ref(false), up = ref(false), err = ref(''), newCat = ref('')
const blank = () => ({ id: null, name: '', category: catalog.categories[0]?.id || '', price: 0, sizesText: '', description: '', images: [], video: '', active: true, i18n: withTr() })
const form = reactive(blank())
const openNew = () => { Object.assign(form, blank()); err.value = ''; editing.value = true }
const openEdit = p => { Object.assign(form, blank(), { ...p, images: [...p.images], video: p.video || '', i18n: withTr(p.i18n), sizesText: (p.sizes || []).join(', ') }); err.value = ''; editing.value = true }
const catName = id => catalog.categories.find(c => c.id === id)?.name || '—'
async function save() {
  err.value = ''; busy.value = true
  try {
    const { sizesText, ...r } = form
    await saveProduct({ ...r, price: Number(r.price) || 0, sizes: sizesText.split(',').map(s => s.trim()).filter(Boolean), images: [...r.images], video: r.video.trim() || null, i18n: Object.fromEntries(Object.entries(r.i18n).filter(([, v]) => v.name.trim() || v.description.trim())) })
    editing.value = false
  } catch (e) { err.value = e.message || 'Enregistrement impossible.' } finally { busy.value = false }
}
async function addImages(e) { up.value = true; for (const f of e.target.files) { try { form.images.push(await uploadMedia(f)) } catch (x) { err.value = x.message } } e.target.value = ''; up.value = false }
async function addVideo(e) { const f = e.target.files[0]; if (!f) return; up.value = true; try { form.video = await uploadMedia(f) } catch (x) { err.value = x.message } e.target.value = ''; up.value = false }
const cover = i => form.images.unshift(form.images.splice(i, 1)[0])
const del = async p => { if (confirm(`Supprimer « ${p.name} » ?`)) await deleteProduct(p.id) }
const run = fn => async (...a) => { err.value = ''; try { await fn(...a) } catch (e) { err.value = e.message } }
const addCat = run(async () => { if (newCat.value.trim()) { await saveCategory(newCat.value.trim()); newCat.value = '' } })
const rename = run((c, e) => saveCategory(e.target.value.trim() || c.name, c.id))
const delCat = run(async c => { if (confirm(`Supprimer la catégorie « ${c.name} » ? Ses articles resteront sans catégorie.`)) await deleteCategory(c.id) })
const imp = run(importSamples)
const qrFor = ref(null), qrImg = ref('')
async function showQR(p) { qrFor.value = p; qrImg.value = ''; qrImg.value = await qrData(productUrl(p), 360) }
const saveTr = run((c, l, v) => saveCategory(c.name, c.id, { ...(c.i18n || {}), [l]: v }))
</script>
<template>
  <h1>Catalogue</h1>
  <div class="chips"><button v-for="t in [['articles', 'Articles'], ['cats', 'Catégories']]" :key="t[0]" type="button" class="chip dk" :class="{ on: sub === t[0] }" @click="sub = t[0]">{{ t[1] }}</button></div>
  <p v-if="err && !editing" class="msg error">{{ err }}</p>
  <template v-if="sub === 'articles'">
    <div class="bar2"><button class="btn red sm" type="button" @click="openNew"><Plus :size="16" /> Nouvel article</button> <button class="btn line dk sm" type="button" :disabled="!catalog.products.length" @click="printLabels(catalog.products)"><Printer :size="16" /> Étiquettes QR</button></div>
    <div v-if="!catalog.products.length" class="empty">Le catalogue est vide. <button class="btn sm" type="button" @click="imp">Importer des articles d'exemple</button></div>
    <div v-else class="tbl t-prods"><table>
      <thead><tr><th></th><th>Article</th><th>Catégorie</th><th>Prix</th><th>Médias</th><th>Statut</th><th></th></tr></thead>
      <tbody><tr v-for="p in catalog.products" :key="p.id">
        <td><img class="thumb" :src="p.images[0] || PH" alt="" /></td><td><b>{{ p.name }}</b><small>{{ p.sizes.join(', ') || 'Taille unique' }}</small></td><td>{{ catName(p.category) }}</td><td>{{ fmt(p.price) }}</td>
        <td>{{ p.images.length }} photo(s){{ p.video ? ' · vidéo' : '' }}</td><td><span class="pill" :data-s="p.active ? 'Livrée' : 'Annulée'">{{ p.active ? 'En ligne' : 'Masqué' }}</span></td>
        <td class="acts2"><button type="button" class="ib dark" aria-label="Code QR" @click="showQR(p)"><QrCode :size="17" /></button><button type="button" class="ib dark" aria-label="Modifier" @click="openEdit(p)"><Pencil :size="17" /></button><button type="button" class="ib dark" aria-label="Supprimer" @click="del(p)"><Trash2 :size="17" /></button></td>
      </tr></tbody></table></div>
  </template>
  <template v-else>
    <form class="catadd" @submit.prevent="addCat"><input v-model="newCat" placeholder="Nouvelle catégorie (ex. Robes de soirée)" /><button class="btn red sm"><Plus :size="16" /> Ajouter</button></form>
    <ul class="catlist"><li v-for="c in catalog.categories" :key="c.id"><div class="crow"><input :value="c.name" :aria-label="'Renommer ' + c.name" @change="rename(c, $event)" /><button type="button" class="ib dark" aria-label="Supprimer" @click="delCat(c)"><Trash2 :size="17" /></button></div><details class="ctr"><summary>Traductions</summary><label v-for="l in OTHERS" :key="l.id" class="fld">{{ l.label }}<input :value="c.i18n?.[l.id] || ''" @change="saveTr(c, l.id, $event.target.value)" /></label></details></li></ul>
  </template>

  <AnimatePresence>
    <motion.div v-if="editing" key="o" class="overlay" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" @click="editing = false" />
  </AnimatePresence>
  <AnimatePresence>
    <motion.aside v-if="editing" key="s" class="drawer sheet" :initial="{ x: '100%' }" :animate="{ x: 0 }" :exit="{ x: '100%' }" :transition="{ type: 'spring', stiffness: 260, damping: 30 }">
      <div class="dh"><h2>{{ form.id ? "Modifier l'article" : 'Nouvel article' }}</h2><button class="ib dark" type="button" aria-label="Fermer" @click="editing = false"><X :size="20" /></button></div>
      <form class="eform" @submit.prevent="save">
        <label class="fld">Nom<input v-model="form.name" required /></label>
        <div class="two">
          <label class="fld">Catégorie<select v-model="form.category"><option value="">Aucune</option><option v-for="c in catalog.categories" :key="c.id" :value="c.id">{{ c.name }}</option></select></label>
          <label class="fld">Prix (FCFA)<input v-model="form.price" type="number" min="0" step="500" required /></label>
        </div>
        <label class="fld">Tailles (séparées par des virgules, vide = taille unique)<input v-model="form.sizesText" placeholder="S, M, L, XL" /></label>
        <label class="fld">Description<textarea v-model="form.description" rows="5"></textarea></label>
        <div class="fld">Traductions (facultatif : sinon le français s'affiche)
          <div class="chips trl"><button v-for="l in OTHERS" :key="l.id" type="button" class="chip dk" :class="{ on: trLang === l.id }" @click="trLang = l.id">{{ l.label }}</button></div>
          <input v-model="form.i18n[trLang].name" placeholder="Nom" />
          <textarea v-model="form.i18n[trLang].description" rows="3" placeholder="Description"></textarea>
        </div>
        <div class="fld">Photos (la première est la photo principale)
          <div class="imgs">
            <div v-for="(im, i) in form.images" :key="im + i"><img :src="im" alt="" /><button type="button" class="x" aria-label="Retirer" @click="form.images.splice(i, 1)"><X :size="14" /></button><button v-if="i" type="button" class="st" aria-label="Photo principale" @click="cover(i)"><Star :size="14" /></button></div>
            <label class="addimg">+<input type="file" accept="image/*" multiple hidden @change="addImages" /></label>
          </div>
        </div>
        <div class="fld">Vidéo (lien YouTube, Vimeo ou fichier)
          <input v-model="form.video" placeholder="https://…" />
          <input type="file" accept="video/*" @change="addVideo" />
        </div>
        <label class="chk"><input v-model="form.active" type="checkbox" /> Visible sur le site</label>
        <p v-if="up" class="hint">Envoi en cours…</p><p v-if="err" class="msg error">{{ err }}</p>
        <button class="btn red" :disabled="busy || up">{{ busy ? 'Enregistrement…' : 'Enregistrer' }}</button>
      </form>
    </motion.aside>
  </AnimatePresence>
  <AnimatePresence>
    <motion.div v-if="qrFor" key="qr" class="qrwrap" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" @click.self="qrFor = null">
      <motion.div class="qrbox" role="dialog" :initial="{ scale: 0.88, y: 24 }" :animate="{ scale: 1, y: 0 }" :transition="{ type: 'spring', stiffness: 260, damping: 22 }">
        <button class="ib dark qx" type="button" aria-label="Fermer" @click="qrFor = null"><X :size="20" /></button>
        <h3>{{ qrFor.name }}</h3>
        <img v-if="qrImg" class="qrimg" :src="qrImg" alt="Code QR de l'article" />
        <small>{{ productUrl(qrFor) }}</small>
        <div class="qracts"><button class="btn sm" type="button" @click="downloadLabel(qrFor)"><Download :size="16" /> Télécharger l'étiquette</button><button class="btn line dk sm" type="button" @click="printLabels([qrFor])"><Printer :size="16" /> Imprimer</button></div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
</template>
