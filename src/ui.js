import { reactive } from 'vue'
// ready : le preloader s'ouvre (le hero peut jouer) · phase/kind/x/y : transition entre pages
export const ui = reactive({ ready: false, phase: 'idle', kind: 'wipe', x: 0, y: 0 })
