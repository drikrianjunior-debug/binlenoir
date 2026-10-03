import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL, key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const demo = !(url && key)   // sans clés Supabase : mode démo (données dans le navigateur)
export const sb = demo ? null : createClient(url, key)
export const user = ref(null)
const L = {
  get: () => JSON.parse(localStorage.getItem('bl_db') || 'null') || { users: [{ id: 'admin', email: 'admin@binlenoir.ci', password: 'admin123', full_name: 'Administrateur', phone: '', role: 'admin' }], orders: [], session: null, seq: 1000 },
  set: d => localStorage.setItem('bl_db', JSON.stringify(d))
}
const pub = u => u && ({ id: u.id, email: u.email, full_name: u.full_name, phone: u.phone, role: u.role })
async function load(s) {
  if (!s) return (user.value = null)
  for (let i = 0; i < 3; i++) { // le profil est créé par un trigger : petite attente possible
    const { data } = await sb.from('profiles').select('*').eq('id', s.user.id).maybeSingle()
    if (data) return (user.value = data)
    await new Promise(r => setTimeout(r, 500))
  }
}
export async function init() {
  if (demo) { const d = L.get(); user.value = pub(d.users.find(u => u.id === d.session)) || null; return }
  const { data } = await sb.auth.getSession(); await load(data.session)
  sb.auth.onAuthStateChange((_, s) => { setTimeout(() => load(s), 0) })
}
export async function signUp({ email, password, full_name, phone }) {
  if (demo) {
    const d = L.get(); if (d.users.some(u => u.email === email)) throw new Error('err.dup')
    const u = { id: crypto.randomUUID(), email, password, full_name, phone, role: 'client' }
    d.users.push(u); d.session = u.id; L.set(d); user.value = pub(u); return
  }
  const { data, error } = await sb.auth.signUp({ email, password, options: { data: { full_name, phone } } })
  if (error) throw new Error(error.message)
  if (data.session) await load(data.session)
}
export async function signIn(email, password) {
  if (demo) {
    const d = L.get(), u = d.users.find(u => u.email === email && u.password === password)
    if (!u) throw new Error('err.login')
    d.session = u.id; L.set(d); user.value = pub(u); return
  }
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw new Error('err.login')
  await load(data.session)
}
export async function signOut() { if (demo) { const d = L.get(); d.session = null; L.set(d) } else await sb.auth.signOut(); user.value = null }
export async function saveProfile(p) {
  if (demo) { const d = L.get(); Object.assign(d.users.find(u => u.id === user.value.id), p); L.set(d) }
  else { const { error } = await sb.from('profiles').update(p).eq('id', user.value.id); if (error) throw error }
  user.value = { ...user.value, ...p }
}
export async function createOrder({ items, total, address, note }) {
  if (demo) { const d = L.get(), o = { id: crypto.randomUUID(), num: ++d.seq, user_id: user.value.id, items, total, address, note, status: 'En attente', created_at: new Date().toISOString() }; d.orders.push(o); L.set(d); return o }
  const { data, error } = await sb.from('orders').insert({ user_id: user.value.id, items, total, address, note }).select().single()
  if (error) throw error; return data
}
export async function orders(all = false) {
  if (demo) { const d = L.get(); return d.orders.filter(o => all || o.user_id === user.value.id).map(o => ({ ...o, customer: pub(d.users.find(u => u.id === o.user_id)) })).reverse() }
  let q = sb.from('orders').select('*, customer:profiles(full_name,phone,email)').order('created_at', { ascending: false })
  if (!all) q = q.eq('user_id', user.value.id)
  const { data, error } = await q; if (error) throw error; return data
}
export async function setStatus(id, status) {
  if (demo) { const d = L.get(); d.orders.find(o => o.id === id).status = status; L.set(d) }
  else { const { error } = await sb.from('orders').update({ status }).eq('id', id); if (error) throw error }
}
export async function customers() {
  if (demo) return L.get().users.filter(u => u.role === 'client').map(pub)
  const { data, error } = await sb.from('profiles').select('*').eq('role', 'client').order('created_at', { ascending: false }); if (error) throw error; return data
}
