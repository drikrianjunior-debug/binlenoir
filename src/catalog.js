import { reactive } from 'vue'
import { demo, sb } from './store'
import { SAMPLE_CATEGORIES, SAMPLE_PRODUCTS } from './data'
export const catalog = reactive({ categories: [], products: [], loaded: false })
const KEY = 'bl_catalog'
const seed = () => ({ categories: SAMPLE_CATEGORIES.map(c => ({ ...c })), products: SAMPLE_PRODUCTS.map(p => ({ ...p })) })
const persist = () => localStorage.setItem(KEY, JSON.stringify({ categories: catalog.categories, products: catalog.products }))
const norm = p => ({ ...p, images: p.images || [], sizes: p.sizes || [], i18n: p.i18n || {} })
export const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export async function loadCatalog() {
  try {
    if (demo) { const d = JSON.parse(localStorage.getItem(KEY) || 'null') || seed(); catalog.categories = d.categories; catalog.products = d.products.map(norm) }
    else {
      const [c, p] = await Promise.all([sb.from('categories').select('*').order('position'), sb.from('products').select('*').order('created_at', { ascending: false })])
      catalog.categories = c.data || []; catalog.products = (p.data || []).map(norm)
    }
  } catch (e) { console.error(e) }
  catalog.loaded = true
}
export async function saveProduct(p) {
  if (demo) {
    if (!p.id) p.id = crypto.randomUUID()
    const i = catalog.products.findIndex(x => x.id === p.id); i < 0 ? catalog.products.unshift({ ...p }) : (catalog.products[i] = { ...p }); persist(); return
  }
  const row = { name: p.name, category: p.category || null, price: p.price, sizes: p.sizes, description: p.description, images: p.images, video: p.video, active: p.active, i18n: p.i18n || {} }
  const { error } = await (p.id ? sb.from('products').update(row).eq('id', p.id) : sb.from('products').insert(row)); if (error) throw error
  await loadCatalog()
}
export async function deleteProduct(id) {
  if (demo) { catalog.products = catalog.products.filter(p => p.id !== id); persist(); return }
  const { error } = await sb.from('products').delete().eq('id', id); if (error) throw error; await loadCatalog()
}
export async function saveCategory(name, id, i18n) {
  if (demo) {
    if (id) Object.assign(catalog.categories.find(c => c.id === id), { name, ...(i18n ? { i18n } : {}) })
    else catalog.categories.push({ id: slug(name) || crypto.randomUUID().slice(0, 8), name, position: catalog.categories.length, i18n: {} })
    persist(); return
  }
  const { error } = await (id ? sb.from('categories').update({ name, ...(i18n ? { i18n } : {}) }).eq('id', id) : sb.from('categories').insert({ id: slug(name) || crypto.randomUUID().slice(0, 8), name, position: catalog.categories.length }))
  if (error) throw error; await loadCatalog()
}
export async function deleteCategory(id) {
  if (demo) { catalog.categories = catalog.categories.filter(c => c.id !== id); catalog.products.forEach(p => p.category === id && (p.category = '')); persist(); return }
  const { error } = await sb.from('categories').delete().eq('id', id); if (error) throw error; await loadCatalog()
}
export async function importSamples() {
  if (demo) { Object.assign(catalog, seed()); persist(); return }
  await sb.from('categories').upsert(SAMPLE_CATEGORIES)
  const { error } = await sb.from('products').insert(SAMPLE_PRODUCTS.map(({ id, ...r }) => r)); if (error) throw error; await loadCatalog()
}
async function shrink(file) {
  const b = await createImageBitmap(file), k = Math.min(1, 1100 / Math.max(b.width, b.height)), c = document.createElement('canvas')
  c.width = Math.round(b.width * k); c.height = Math.round(b.height * k); c.getContext('2d').drawImage(b, 0, 0, c.width, c.height)
  const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.82)); return new File([blob], 'photo.jpg', { type: 'image/jpeg' })
}
const dataUrl = f => new Promise((ok, ko) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = ko; r.readAsDataURL(f) })
export async function uploadMedia(file) {
  const img = file.type.startsWith('image/')
  if (img) file = await shrink(file)
  if (demo) { if (!img) throw new Error("En mode démo, collez un lien vidéo : l'envoi de fichiers vidéo nécessite Supabase."); return dataUrl(file) }
  const path = crypto.randomUUID() + '.' + (img ? 'jpg' : file.name.split('.').pop())
  const { error } = await sb.storage.from('media').upload(path, file, { contentType: file.type }); if (error) throw error
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl
}
