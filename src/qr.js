import QRCode from 'qrcode'
import { slug } from './catalog'
import { fmtXOF } from './data'
export const siteUrl = () => (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')
export const productUrl = p => `${siteUrl()}/produit/${p.id}`
export const qrData = (text, width = 480) => QRCode.toDataURL(text, { margin: 1, width, errorCorrectionLevel: 'M', color: { dark: '#0b0b0b', light: '#ffffff' } })
const load = src => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = src })
function wrap(g, text, max) {
  const out = []; let line = ''
  for (const w of text.split(' ')) { const test = line ? line + ' ' + w : w; if (g.measureText(test).width > max && line) { out.push(line); line = w } else line = test }
  return out.concat(line).slice(0, 2)
}
// Étiquette imprimable : logo, QR, nom et prix
export async function labelCanvas(p) {
  const c = document.createElement('canvas'); c.width = 600; c.height = 800
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 600, 800); g.textBaseline = 'alphabetic'
  g.font = '700 36px Arial'; g.textAlign = 'left'
  const w1 = g.measureText('BIN LENOIR ').width, w2 = g.measureText('♥').width, x0 = 300 - (w1 + w2) / 2
  g.fillStyle = '#0b0b0b'; g.fillText('BIN LENOIR ', x0, 66); g.fillStyle = '#c8102e'; g.fillText('♥', x0 + w1, 66)
  g.drawImage(await load(await qrData(productUrl(p), 480)), 60, 100, 480, 480)
  g.textAlign = 'center'; g.fillStyle = '#0b0b0b'; g.font = '700 32px Arial'
  wrap(g, p.name, 520).forEach((l, i) => g.fillText(l, 300, 640 + i * 38))
  g.fillStyle = '#c8102e'; g.font = '700 38px Arial'; g.fillText(fmtXOF(p.price), 300, 740)
  g.strokeStyle = '#ddd'; g.lineWidth = 2; g.strokeRect(1, 1, 598, 798)
  return c
}
export async function downloadLabel(p) {
  const c = await labelCanvas(p)
  c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `etiquette-${slug(p.name) || 'article'}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000) })
}
export async function printLabels(list) {
  const w = window.open('', '_blank'); if (!w) return
  const imgs = []; for (const p of list) imgs.push((await labelCanvas(p)).toDataURL('image/png'))
  const cols = list.length === 1 ? 1 : 3
  w.document.write(`<html><head><title>Étiquettes BIN LENOIR</title><style>@page{margin:10mm}body{margin:0}.g{display:grid;grid-template-columns:repeat(${cols},1fr);gap:6mm;${cols === 1 ? 'max-width:90mm;' : ''}}img{width:100%;break-inside:avoid}</style></head><body><div class="g">${imgs.map(s => `<img src="${s}">`).join('')}</div></body></html>`)
  w.document.close(); setTimeout(() => w.print(), 400)
}
