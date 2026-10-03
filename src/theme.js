import { ref } from 'vue'
export const theme = ref(document.documentElement.dataset.theme || 'dark')
function apply(v) {
  theme.value = v; document.documentElement.dataset.theme = v
  try { localStorage.setItem('bl_theme', v) } catch {}
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', v === 'dark' ? '#0b0b0b' : '#faf8f5')
}
// bascule avec une « éclosion » circulaire depuis le bouton (si le navigateur le permet)
export function toggleTheme(e) {
  const next = theme.value === 'dark' ? 'light' : 'dark'
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply(next)
  const r = e?.currentTarget?.getBoundingClientRect?.(), s = document.documentElement.style
  s.setProperty('--tx', (r ? r.left + r.width / 2 : innerWidth / 2) + 'px'); s.setProperty('--ty', (r ? r.top + r.height / 2 : 0) + 'px')
  document.startViewTransition(() => apply(next))
}
