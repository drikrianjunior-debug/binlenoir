import QRCode from 'qrcode'
import { ADDRESS, PHONE, LEGAL, waLink } from './data'
const fcfa = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA' // espaces simples : compatibles PDF
const RED = [200, 16, 46], INK = [11, 11, 11], MUTE = [110, 106, 100], LINE = [225, 220, 213]
export async function makeInvoice(o) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' }), W = 210, M = 16
  const no = 'FA-' + o.num, date = new Date(o.created_at).toLocaleDateString('fr-FR'), c = o.customer || {}
  const heart = (x, y) => { doc.setFillColor(...RED); doc.circle(x, y, 1.7, 'F'); doc.circle(x + 3, y, 1.7, 'F'); doc.triangle(x - 1.55, y + 0.9, x + 4.55, y + 0.9, x + 1.5, y + 4.9, 'F') }
  const qr = await QRCode.toDataURL(waLink(`Bonjour BIN LENOIR ♥\nFacture ${no} du ${date} — ${fcfa(o.total)}`), { margin: 0, width: 300 })
  const txt = (s, x, y, size = 10, style = 'normal', color = INK, opt) => { doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor(...color); doc.text(s, x, y, opt) }

  // en-tête
  txt('BIN LENOIR', M, 26, 22, 'bold'); heart(M + doc.getTextWidth('BIN LENOIR') + 3, 21)
  txt(['Cocody 7ème tranche', ADDRESS, 'Tél. / WhatsApp : ' + PHONE, ...(LEGAL ? [LEGAL] : [])], M, 33, 9, 'normal', MUTE)
  txt('FACTURE', W - M, 26, 26, 'bold', RED, { align: 'right' })
  txt([`N° ${no}`, `Date : ${date}`, `Commande : BL-${o.num}`], W - M, 33, 9.5, 'normal', INK, { align: 'right' })

  // client
  doc.setDrawColor(...LINE); doc.line(M, 56, W - M, 56)
  txt('FACTURÉ À', M, 64, 8, 'bold', MUTE)
  txt(c.full_name || '—', M, 70, 12, 'bold')
  txt([c.phone, c.email, o.address && 'Livraison : ' + o.address].filter(Boolean), M, 76, 9.5, 'normal', INK)

  // tableau
  let y = 98
  const head = () => {
    doc.setFillColor(...INK); doc.rect(M, y, W - 2 * M, 8, 'F')
    txt('Désignation', M + 3, y + 5.4, 9, 'bold', [255, 255, 255]); txt('Taille', 106, y + 5.4, 9, 'bold', [255, 255, 255]); txt('Qté', 124, y + 5.4, 9, 'bold', [255, 255, 255])
    txt('Prix unit.', 164, y + 5.4, 9, 'bold', [255, 255, 255], { align: 'right' }); txt('Total', W - M - 3, y + 5.4, 9, 'bold', [255, 255, 255], { align: 'right' }); y += 8
  }
  head()
  for (const it of o.items) {
    const lines = doc.splitTextToSize(it.name, 84), h = Math.max(9, lines.length * 4.6 + 4)
    if (y + h > 245) { doc.addPage(); y = 20; head() }
    txt(lines, M + 3, y + 6, 10); txt(it.size || '—', 106, y + 6, 10); txt(String(it.qty), 124, y + 6, 10)
    txt(fcfa(it.price), 164, y + 6, 10, 'normal', INK, { align: 'right' }); txt(fcfa(it.price * it.qty), W - M - 3, y + 6, 10, 'bold', INK, { align: 'right' })
    y += h; doc.setDrawColor(...LINE); doc.line(M, y, W - M, y)
  }
  if (y > 225) { doc.addPage(); y = 20 }
  y += 10; txt('TOTAL', 130, y, 11, 'bold', MUTE); txt(fcfa(o.total), W - M - 3, y, 16, 'bold', RED, { align: 'right' })
  txt('Commande livrée. Le paiement a été convenu avec la boutique via WhatsApp.', M, y + 14, 9, 'normal', MUTE)
  txt('Merci de votre confiance', M, y + 21, 10, 'bold'); heart(M + doc.getTextWidth('Merci de votre confiance') + 3, y + 17.4)

  // pied de page (chaque page) : code QR + coordonnées
  const n = doc.getNumberOfPages()
  for (let i = 1; i <= n; i++) {
    doc.setPage(i); doc.setDrawColor(...LINE); doc.line(M, 262, W - M, 262)
    doc.addImage(qr, 'PNG', M, 266, 24, 24)
    txt('Scannez ce code pour contacter la boutique sur WhatsApp', M + 29, 272, 9, 'bold')
    txt([`Référence : ${no}`, `BIN LENOIR · ${ADDRESS} · ${PHONE}`], M + 29, 278, 8.5, 'normal', MUTE)
    txt(`${i} / ${n}`, W - M, 290, 8.5, 'normal', MUTE, { align: 'right' })
  }
  doc.save(`Facture-${no}.pdf`)
}
