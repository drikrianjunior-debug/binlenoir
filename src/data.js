import { money, moneyXOF } from './i18n'
export const fmt = money
export const fmtXOF = moneyXOF
export const WA = '2250777666688', PHONE = '07 77 66 66 88', ADDRESS = '92P7+J2V, D 28, Abidjan'
export const hours = [['Lundi', '08:30–19:00'], ['Mardi', '08:30–19:00'], ['Mercredi', '08:30–19:00'], ['Jeudi', '08:30–19:00'], ['Vendredi', '08:30–19:00'], ['Samedi', '08:30–19:00'], ['Dimanche', 'Fermé']]
export const PH = '/img/placeholder.svg'
export const SAMPLE_CATEGORIES = [
  { id: 'robes', name: 'Robes de soirée', position: 0 }, { id: 'bureau', name: 'Tenues de bureau', position: 1 },
  { id: 'ensembles', name: 'Ensembles', position: 2 }, { id: 'accessoires', name: 'Accessoires', position: 3 }]
const S = ['S', 'M', 'L', 'XL']
// Articles d'exemple (importés une seule fois). Ensuite tout se gère depuis /admin > Catalogue.
const mk = (id, name, category, price, sizes, description) => ({ id: 's' + id, name, category, price, sizes, description, images: [`/img/cat-${category}.svg`], video: null, active: true })
export const SAMPLE_PRODUCTS = [
  mk(1, 'Robe de soirée satinée rouge', 'robes', 45000, S, "Une robe de soirée à la coupe fluide, pour des entrées remarquées.\nExemple de description : modifiez-la depuis l'administration."),
  mk(2, 'Robe fleurie pastel', 'robes', 32000, S, 'Imprimé fleuri et tons pastels, confortable et dynamique.'),
  mk(3, 'Tailleur de bureau noir', 'bureau', 42000, S, 'Une tenue de bureau sobre et élégante.'),
  mk(4, 'Chemisier blanc élégant', 'bureau', 18000, S, 'Matière délicate, coupe pratique pour le quotidien.'),
  mk(5, 'Ensemble blazer & jupe', 'ensembles', 38000, S, 'Un ensemble coordonné, prêt à porter de la réunion au dîner.'),
  mk(6, 'Ensemble deux pièces imprimé', 'ensembles', 30000, S, 'Look de tous les jours, original et confortable.'),
  mk(7, 'Sac à main cuir rouge', 'accessoires', 38000, [], 'Le sac qui complète toutes vos tenues.'),
  mk(8, 'Foulard en soie', 'accessoires', 9000, [], 'Un accessoire délicat, à nouer comme vous voulez.')]
export function embed(u) {
  const y = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/); if (y) return { iframe: 'https://www.youtube.com/embed/' + y[1] }
  const v = u.match(/vimeo\.com\/(\d+)/); if (v) return { iframe: 'https://player.vimeo.com/video/' + v[1] }
  return { file: u }
}
export const waLink = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`
export const waTo = p => { const n = (p || '').replace(/\D/g, ''); return 'https://wa.me/' + (n.startsWith('225') ? n : '225' + n) }
export const orderText = (o, c) => `Bonjour BIN LENOIR ♥\nJe souhaite confirmer ma commande BL-${o.num} :\n` +
  o.items.map(i => `• ${i.qty} × ${i.name}${i.size ? ' (' + i.size + ')' : ''} — ${fmtXOF(i.price * i.qty)}`).join('\n') +
  `\n\nTotal : ${fmtXOF(o.total)}\nNom : ${c.full_name}\nLivraison : ${o.address}` + (o.note ? `\nNote : ${o.note}` : '')
// Abidjan = UTC+0
export function openNow() { const n = new Date(), d = (n.getUTCDay() + 6) % 7, m = n.getUTCHours() * 60 + n.getUTCMinutes(); return d < 6 && m >= 510 && m < 1140 }
export const today = () => (new Date().getUTCDay() + 6) % 7

// Mentions légales affichées en pied de facture si renseignées (ex. 'RCCM CI-ABJ-… · N° CC …')
export const SHOP_LEGAL = 'RCCM CI-ABJ-2106-A-23762 | N° CC 1646457 C'

// Mentions légales imprimées sous l'adresse de la facture (ex. 'RCCM CI-ABJ-… · N° CC …'). Laisser vide si inutile.
export const LEGAL = ''
