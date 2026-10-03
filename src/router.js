import { createRouter, createWebHistory } from 'vue-router'
import { user } from './store'
import { ui } from './ui'
const sleep = ms => new Promise(r => setTimeout(r, ms))
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: to => (to.hash ? { el: to.hash, top: 70, behavior: 'smooth' } : { top: 0 }),
  routes: [
    { path: '/', component: () => import('./views/Home.vue') },
    { path: '/produit/:id', component: () => import('./views/Product.vue') },
    { path: '/connexion', component: () => import('./views/Auth.vue') },
    { path: '/compte', component: () => import('./views/Account.vue'), meta: { auth: true } },
    { path: '/admin', component: () => import('./views/Admin.vue'), meta: { auth: true, admin: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})
router.beforeEach(async (to, from) => {
  if (to.meta.auth && !user.value) return { path: '/connexion', query: { redirect: to.fullPath } }
  if (to.meta.admin && user.value?.role !== 'admin') return '/compte'
  // rideau (ou éclosion depuis le clic sur une fiche) entre deux pages
  if (from.matched.length && to.path !== from.path) { ui.phase = 'cover'; await sleep(ui.kind === 'bloom' ? 680 : 640) }
})
router.afterEach(() => {
  if (ui.phase !== 'cover') return
  ui.phase = 'reveal'; setTimeout(() => { ui.phase = 'idle'; ui.kind = 'wipe' }, 700)
})
router.onError(() => { ui.phase = 'idle' })
export default router
