import { reactive, computed, watch } from 'vue'
export const cart = reactive({ open: false, items: JSON.parse(localStorage.getItem('bl_cart') || '[]') })
watch(() => cart.items, v => localStorage.setItem('bl_cart', JSON.stringify(v)), { deep: true })
export const total = computed(() => cart.items.reduce((s, i) => s + i.price * i.qty, 0))
export const count = computed(() => cart.items.reduce((s, i) => s + i.qty, 0))
export function add(p, size, q = 1) {
  const key = p.id + '|' + (size || ''), it = cart.items.find(i => i.key === key)
  it ? (it.qty += q) : cart.items.push({ key, id: p.id, name: p.name, price: p.price, size, qty: q, image: p.images?.[0] || '/img/placeholder.svg' })
}
