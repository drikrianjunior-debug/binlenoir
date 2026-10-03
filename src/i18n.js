import { reactive } from 'vue'
export const LANGS = [{ id: 'fr', label: 'Français' }, { id: 'en', label: 'English' }, { id: 'de', label: 'Deutsch' }, { id: 'ja', label: '日本語' }, { id: 'es', label: 'Español' }, { id: 'zh', label: '中文' }, { id: 'ru', label: 'Русский' }]
export const LOC = { fr: 'fr-FR', en: 'en-US', de: 'de-DE', ja: 'ja-JP', es: 'es-ES', zh: 'zh-CN', ru: 'ru-RU' }
export const CURS = [{ id: 'XOF', label: 'XOF · FCFA' }, { id: 'EUR', label: 'EUR · €' }, { id: 'GBP', label: 'GBP · £' }, { id: 'JPY', label: 'JPY · ¥' }, { id: 'USD', label: 'USD · $' }]
export const STATUS = ['En attente', 'Confirmée', 'Payée', 'Expédiée', 'Livrée', 'Annulée']
const XOF_EUR = 655.957 // parité fixe FCFA / euro
const get = k => { try { return localStorage.getItem(k) } catch { return null } }
const guess = () => { const l = (navigator.language || 'fr').slice(0, 2); return LANGS.some(x => x.id === l) ? l : 'fr' }
// taux de secours (indicatifs) : remplacés par les taux du jour dès que possible
export const st = reactive({ lang: get('bl_lang') || guess(), cur: get('bl_cur') || 'XOF', eur: { USD: 1.1, GBP: 0.85, JPY: 160 } })
document.documentElement.lang = st.lang
export const setLang = id => { st.lang = id; document.documentElement.lang = id; try { localStorage.setItem('bl_lang', id) } catch {} }
export const setCur = id => { st.cur = id; try { localStorage.setItem('bl_cur', id) } catch {} }
export async function loadRates() {
  try {
    const c = JSON.parse(get('bl_rates') || 'null')
    if (c && Date.now() - c.t < 12 * 3600e3) return Object.assign(st.eur, c.r)
    const j = await (await fetch('https://open.er-api.com/v6/latest/EUR')).json()
    const n = { USD: j.rates.USD, GBP: j.rates.GBP, JPY: j.rates.JPY }
    if (Object.values(n).every(Boolean)) { Object.assign(st.eur, n); localStorage.setItem('bl_rates', JSON.stringify({ t: Date.now(), r: n })) }
  } catch { /* on garde les taux de secours */ }
}
export const moneyXOF = n => new Intl.NumberFormat(LOC[st.lang]).format(n) + ' FCFA'
export function money(n) {
  const c = st.cur; if (c === 'XOF') return moneyXOF(n)
  const v = (n / XOF_EUR) * (c === 'EUR' ? 1 : st.eur[c])
  return new Intl.NumberFormat(LOC[st.lang], { style: 'currency', currency: c, maximumFractionDigits: c === 'JPY' ? 0 : 2 }).format(v)
}
// découpe un texte en « mots » (japonais et chinois n'ont pas d'espaces)
export const words = text => /\s/.test(text) ? text.split(/\s+/).map(w => w + '\u00a0')
  : (typeof Intl !== 'undefined' && Intl.Segmenter ? [...new Intl.Segmenter(st.lang, { granularity: 'word' }).segment(text)].map(s => s.segment) : [...text])

const A1 = '<a href="https://www.facebook.com/binlenoir" target="_blank" rel="noopener">BIN LENOIR</a>'
const A2 = '<a href="https://jcdmag.com/jcd-mag-la-naissance/" target="_blank" rel="noopener">Jeunes Cadres Dynamiques</a>'
const D = {
fr: { slogan: "Un bon vêtement, c'est un passeport pour le bonheur", 'nav.collections': 'Collections', 'nav.shop': 'Boutique', 'nav.about': 'À propos', 'nav.info': 'Infos',
 'hero.p': "Le prêt-à-porter féminin dont raffolent les jeunes cadres dynamiques d'Abidjan. Du Made in Africa, sans se ruiner.", 'hero.cta': 'Découvrir la boutique',
 'band.wa': 'Commandez sur WhatsApp', 'band.qp': 'Qualité / prix imbattable', all: 'Tout', empty: 'Aucun article pour le moment.',
 manifesto: 'Vêtir les femmes du monde dans du Made in Africa, sans se ruiner.', role: 'promotrice', kw: ['Originaux', 'Pratiques', 'Confortables', 'Dynamiques'],
 about: [`${A1} est la marque de prêt-à-porter dont raffolent toutes les ${A2} de la ville d’Abidjan. Présente depuis quelques années sur la place, la marque BIN LENOIR s’est imposée comme un incontournable dans le dressing des femmes par la qualité de ses collections.`,
  'Questionnée, la promotrice, Mme FOFANA Bin’dia Abiba confie que son ambition est de vêtir les femmes du monde dans du Made in Africa sans se ruiner.',
  'Dans sa boutique située à Cocody 7ème tranche, on trouve un large éventail de choix : de la robe de soirée à la tenue de bureau en passant par des ensembles de tous les jours.',
  'La marque BIN LENOIR privilégie les looks originaux, pratiques, confortables et dynamiques. Le tout réalisé avec des matières délicates, des imprimés fleuris, des tons pastels ou des couleurs plus sobres. Mettre une tenue BIN LENOIR c’est épouser l’air du temps. C’est affirmer une féminité gracieuse et un tantinet audacieuse. C’est aussi et surtout avoir le goût raffiné.',
  'Avec un rapport qualité/prix à nul autre pareil, on comprend aisément l’engouement des JCD pour cette marque de vêtement.'],
 'steps.title': 'Commander en confiance', steps: [['Choisissez', 'Parcourez la boutique, ouvrez la fiche d’un article et remplissez votre panier.'], ['Commandez', 'Connectez-vous, indiquez votre adresse : la commande est enregistrée.'], ['Confirmez sur WhatsApp', 'Vous échangez directement avec la boutique et convenez du paiement.']],
 'info.title': 'Nous trouver', open: 'Ouvert maintenant', closedNow: 'Fermé actuellement', closed: 'Fermé', days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'], 'info.wa': 'Écrire sur WhatsApp',
 'card.more': 'Voir le détail', 'card.video': 'Vidéo', 'p.size': 'Taille', 'p.qty': 'Quantité', 'p.add': 'Ajouter au panier', 'p.added': 'Ajouté ♥', 'p.ask': 'Poser une question sur WhatsApp', 'p.gone': "Cet article n'est plus disponible.", 'p.back': 'Retour à la boutique', 'p.related': 'Vous aimerez aussi',
 'cart.title': 'Mon panier', 'cart.empty': 'Votre panier est vide. Choisissez vos pièces préférées dans la boutique.', 'cart.total': 'Total', 'cart.fcfa': 'Montant à payer en FCFA :', 'cart.addr': 'Adresse de livraison', 'cart.addr_ph': 'Commune, quartier, repère', 'cart.note': 'Note (facultatif)', 'cart.note_ph': 'Couleur, précision…', 'cart.order': 'Commander sur WhatsApp', 'cart.saving': 'Enregistrement…', 'cart.login': 'Se connecter pour commander',
 'cart.hint': 'Votre commande est enregistrée, puis vous la confirmez avec la boutique sur WhatsApp. Le paiement se convient directement avec elle.', 'cart.hint2': 'Un compte permet de suivre vos commandes.', 'cart.addr_err': 'Indiquez votre adresse de livraison.', 'cart.fail': "La commande n'a pas pu être enregistrée. Réessayez.",
 'auth.aside': 'Connectez-vous pour suivre vos commandes et commander en quelques clics.', 'auth.login': 'Connexion', 'auth.signup': 'Inscription', 'auth.name': 'Nom complet', 'auth.phone': 'Téléphone (WhatsApp)', 'auth.email': 'E-mail', 'auth.pass': 'Mot de passe', 'auth.go': 'Se connecter', 'auth.create': 'Créer mon compte', 'auth.wait': 'Patientez…', 'auth.confirm': 'Compte créé. Confirmez votre e-mail, puis connectez-vous.', 'err.login': 'E-mail ou mot de passe incorrect.', 'err.dup': 'Cet e-mail est déjà utilisé.',
 'acc.hello': 'Bonjour', 'acc.logout': 'Déconnexion', 'acc.orders': 'Mes commandes', 'acc.profile': 'Mon profil', 'acc.none': "Aucune commande pour l'instant. Rendez-vous dans la boutique.", 'acc.wa': 'Voir sur WhatsApp', 'acc.save': 'Enregistrer', 'acc.saved': 'Profil mis à jour.',
 st: ['En attente', 'Confirmée', 'Payée', 'Expédiée', 'Livrée', 'Annulée'], prefs: 'Langue et devise', 'prefs.lang': 'Langue', 'prefs.cur': 'Devise', 'prefs.note': 'Les prix sont convertis à titre indicatif. Les commandes sont réglées en FCFA.',
 'cat.robes': 'Robes de soirée', 'cat.bureau': 'Tenues de bureau', 'cat.ensembles': 'Ensembles', 'cat.accessoires': 'Accessoires' },
en: { slogan: 'A good outfit is a passport to happiness', 'nav.collections': 'Collections', 'nav.shop': 'Shop', 'nav.about': 'About', 'nav.info': 'Info',
 'hero.p': "The women's ready-to-wear loved by Abidjan's young dynamic professionals. Made in Africa, without breaking the bank.", 'hero.cta': 'Discover the shop',
 'band.wa': 'Order on WhatsApp', 'band.qp': 'Unbeatable value', all: 'All', empty: 'No items yet.',
 manifesto: 'Dressing women around the world in Made in Africa, without breaking the bank.', role: 'founder', kw: ['Original', 'Practical', 'Comfortable', 'Dynamic'],
 about: [`${A1} is the ready-to-wear brand adored by all the ${A2} (young dynamic professionals) of Abidjan. Present on the scene for a few years, BIN LENOIR has established itself as a must-have in women's wardrobes thanks to the quality of its collections.`,
  'Asked about it, the founder, Mrs. FOFANA Bin’dia Abiba, says her ambition is to dress women around the world in Made in Africa without breaking the bank.',
  'In her boutique in Cocody 7ème tranche, you will find a wide choice: from evening dresses to office outfits and everyday sets.',
  'BIN LENOIR favours original, practical, comfortable and dynamic looks, all made with delicate fabrics, floral prints, pastel tones or more sober colours. Wearing BIN LENOIR means embracing the spirit of the times. It means asserting a graceful and slightly daring femininity. It is also, and above all, having refined taste.',
  'With an unrivalled quality-to-price ratio, it is easy to understand the enthusiasm of the JCDs for this clothing brand.'],
 'steps.title': 'Order with confidence', steps: [['Choose', 'Browse the shop, open an item page and fill your cart.'], ['Order', 'Log in and enter your address: your order is saved.'], ['Confirm on WhatsApp', 'You chat directly with the shop and agree on payment.']],
 'info.title': 'Find us', open: 'Open now', closedNow: 'Currently closed', closed: 'Closed', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 'info.wa': 'Message us on WhatsApp',
 'card.more': 'View details', 'card.video': 'Video', 'p.size': 'Size', 'p.qty': 'Quantity', 'p.add': 'Add to cart', 'p.added': 'Added ♥', 'p.ask': 'Ask a question on WhatsApp', 'p.gone': 'This item is no longer available.', 'p.back': 'Back to the shop', 'p.related': 'You may also like',
 'cart.title': 'My cart', 'cart.empty': 'Your cart is empty. Pick your favourite pieces in the shop.', 'cart.total': 'Total', 'cart.fcfa': 'Amount payable in FCFA:', 'cart.addr': 'Delivery address', 'cart.addr_ph': 'District, neighbourhood, landmark', 'cart.note': 'Note (optional)', 'cart.note_ph': 'Colour, details…', 'cart.order': 'Order on WhatsApp', 'cart.saving': 'Saving…', 'cart.login': 'Log in to order',
 'cart.hint': 'Your order is saved, then you confirm it with the shop on WhatsApp. Payment is agreed directly with them.', 'cart.hint2': 'An account lets you track your orders.', 'cart.addr_err': 'Please enter your delivery address.', 'cart.fail': 'The order could not be saved. Please try again.',
 'auth.aside': 'Log in to track your orders and order in a few clicks.', 'auth.login': 'Log in', 'auth.signup': 'Sign up', 'auth.name': 'Full name', 'auth.phone': 'Phone (WhatsApp)', 'auth.email': 'Email', 'auth.pass': 'Password', 'auth.go': 'Log in', 'auth.create': 'Create my account', 'auth.wait': 'Please wait…', 'auth.confirm': 'Account created. Confirm your email, then log in.', 'err.login': 'Incorrect email or password.', 'err.dup': 'This email is already in use.',
 'acc.hello': 'Hello', 'acc.logout': 'Log out', 'acc.orders': 'My orders', 'acc.profile': 'My profile', 'acc.none': 'No orders yet. Head to the shop.', 'acc.wa': 'View on WhatsApp', 'acc.save': 'Save', 'acc.saved': 'Profile updated.',
 st: ['Pending', 'Confirmed', 'Paid', 'Shipped', 'Delivered', 'Cancelled'], prefs: 'Language and currency', 'prefs.lang': 'Language', 'prefs.cur': 'Currency', 'prefs.note': 'Prices are converted for information only. Orders are paid in FCFA.',
 'cat.robes': 'Evening dresses', 'cat.bureau': 'Office outfits', 'cat.ensembles': 'Sets', 'cat.accessoires': 'Accessories' },
de: { slogan: 'Ein gutes Kleidungsstück ist ein Reisepass ins Glück', 'nav.collections': 'Kollektionen', 'nav.shop': 'Shop', 'nav.about': 'Über uns', 'nav.info': 'Infos',
 'hero.p': 'Die Damenmode, die Abidjans junge, dynamische Berufstätige lieben. Made in Africa, ohne sich zu ruinieren.', 'hero.cta': 'Zum Shop',
 'band.wa': 'Bestellen über WhatsApp', 'band.qp': 'Unschlagbares Preis-Leistungs-Verhältnis', all: 'Alle', empty: 'Noch keine Artikel.',
 manifesto: 'Frauen auf der ganzen Welt in Made in Africa kleiden – ohne sich zu ruinieren.', role: 'Gründerin', kw: ['Originell', 'Praktisch', 'Bequem', 'Dynamisch'],
 about: [`${A1} ist die Prêt-à-porter-Marke, die alle ${A2} (junge, dynamische Berufstätige) Abidjans lieben. Seit einigen Jahren auf dem Markt, hat sich BIN LENOIR dank der Qualität ihrer Kollektionen als Muss im Kleiderschrank der Frauen etabliert.`,
  'Auf Nachfrage erklärt die Gründerin, Frau FOFANA Bin’dia Abiba, ihr Ziel sei es, Frauen auf der ganzen Welt in Made in Africa zu kleiden, ohne dass es ein Vermögen kostet.',
  'In ihrer Boutique in Cocody 7ème tranche findet man eine große Auswahl: vom Abendkleid über Business-Outfits bis hin zu Alltags-Sets.',
  'BIN LENOIR setzt auf originelle, praktische, bequeme und dynamische Looks – gefertigt aus feinen Stoffen, mit Blumenmustern, in Pastelltönen oder in schlichteren Farben. Ein Outfit von BIN LENOIR zu tragen heißt, den Zeitgeist zu leben. Es bedeutet, eine anmutige und ein wenig kühne Weiblichkeit zu zeigen – und vor allem, einen raffinierten Geschmack zu haben.',
  'Mit einem unvergleichlichen Preis-Leistungs-Verhältnis versteht man leicht die Begeisterung der JCD für diese Modemarke.'],
 'steps.title': 'Sicher bestellen', steps: [['Auswählen', 'Stöbern Sie im Shop, öffnen Sie die Artikelseite und füllen Sie Ihren Warenkorb.'], ['Bestellen', 'Melden Sie sich an und geben Sie Ihre Adresse ein: Ihre Bestellung wird gespeichert.'], ['Per WhatsApp bestätigen', 'Sie schreiben direkt mit dem Shop und vereinbaren die Zahlung.']],
 'info.title': 'So finden Sie uns', open: 'Jetzt geöffnet', closedNow: 'Derzeit geschlossen', closed: 'Geschlossen', days: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'], 'info.wa': 'Per WhatsApp schreiben',
 'card.more': 'Details ansehen', 'card.video': 'Video', 'p.size': 'Größe', 'p.qty': 'Menge', 'p.add': 'In den Warenkorb', 'p.added': 'Hinzugefügt ♥', 'p.ask': 'Frage per WhatsApp stellen', 'p.gone': 'Dieser Artikel ist nicht mehr verfügbar.', 'p.back': 'Zurück zum Shop', 'p.related': 'Das könnte Ihnen auch gefallen',
 'cart.title': 'Mein Warenkorb', 'cart.empty': 'Ihr Warenkorb ist leer. Wählen Sie Ihre Lieblingsstücke im Shop.', 'cart.total': 'Gesamt', 'cart.fcfa': 'Zu zahlender Betrag in FCFA:', 'cart.addr': 'Lieferadresse', 'cart.addr_ph': 'Stadtteil, Viertel, Orientierungspunkt', 'cart.note': 'Hinweis (optional)', 'cart.note_ph': 'Farbe, Details …', 'cart.order': 'Per WhatsApp bestellen', 'cart.saving': 'Wird gespeichert …', 'cart.login': 'Zum Bestellen anmelden',
 'cart.hint': 'Ihre Bestellung wird gespeichert und anschließend per WhatsApp mit dem Shop bestätigt. Die Zahlung wird direkt mit dem Shop vereinbart.', 'cart.hint2': 'Mit einem Konto können Sie Ihre Bestellungen verfolgen.', 'cart.addr_err': 'Bitte geben Sie Ihre Lieferadresse an.', 'cart.fail': 'Die Bestellung konnte nicht gespeichert werden. Bitte erneut versuchen.',
 'auth.aside': 'Melden Sie sich an, um Ihre Bestellungen zu verfolgen und mit wenigen Klicks zu bestellen.', 'auth.login': 'Anmelden', 'auth.signup': 'Registrieren', 'auth.name': 'Vollständiger Name', 'auth.phone': 'Telefon (WhatsApp)', 'auth.email': 'E-Mail', 'auth.pass': 'Passwort', 'auth.go': 'Anmelden', 'auth.create': 'Konto erstellen', 'auth.wait': 'Bitte warten …', 'auth.confirm': 'Konto erstellt. Bestätigen Sie Ihre E-Mail und melden Sie sich dann an.', 'err.login': 'E-Mail oder Passwort falsch.', 'err.dup': 'Diese E-Mail wird bereits verwendet.',
 'acc.hello': 'Hallo', 'acc.logout': 'Abmelden', 'acc.orders': 'Meine Bestellungen', 'acc.profile': 'Mein Profil', 'acc.none': 'Noch keine Bestellungen. Besuchen Sie den Shop.', 'acc.wa': 'Auf WhatsApp ansehen', 'acc.save': 'Speichern', 'acc.saved': 'Profil aktualisiert.',
 st: ['Ausstehend', 'Bestätigt', 'Bezahlt', 'Versandt', 'Geliefert', 'Storniert'], prefs: 'Sprache und Währung', 'prefs.lang': 'Sprache', 'prefs.cur': 'Währung', 'prefs.note': 'Preise werden nur zur Orientierung umgerechnet. Bestellungen werden in FCFA bezahlt.',
 'cat.robes': 'Abendkleider', 'cat.bureau': 'Business-Outfits', 'cat.ensembles': 'Sets', 'cat.accessoires': 'Accessoires' },
ja: { slogan: '良い服は、幸せへのパスポート。', 'nav.collections': 'コレクション', 'nav.shop': 'ショップ', 'nav.about': '私たちについて', 'nav.info': '店舗情報',
 'hero.p': 'アビジャンの若くてダイナミックなビジネスパーソンに愛される、レディースのプレタポルテ。無理なく楽しめるMade in Africa。', 'hero.cta': 'ショップを見る',
 'band.wa': 'WhatsAppで注文', 'band.qp': '抜群のコストパフォーマンス', all: 'すべて', empty: '現在、商品はありません。',
 manifesto: '世界中の女性に、Made in Africaの服を無理のない価格で。', role: '創業者', kw: ['個性的', '実用的', '快適', 'ダイナミック'],
 about: [`${A1}は、アビジャンの${A2}（若くてダイナミックなビジネスパーソン）が夢中になるプレタポルテブランドです。数年前から市場で存在感を示し、コレクションの品質で、女性のワードローブに欠かせない存在となりました。`,
  '創業者のFOFANA Bin’dia Abiba夫人は、世界中の女性に、無理のない価格でMade in Africaの服を着てほしいというのが目標だと語ります。',
  'Cocody 7ème tranche にある店舗には、イブニングドレスからオフィスウェア、毎日のセットアップまで、幅広い品揃えがあります。',
  'BIN LENOIRが大切にしているのは、個性的で実用的、快適でダイナミックなスタイル。繊細な素材、花柄のプリント、パステルカラー、あるいは落ち着いた色合いで仕立てられています。BIN LENOIRを着ることは、時代の空気をまとうこと。優雅で少し大胆な女性らしさを表現し、何よりも洗練されたセンスを持つことです。',
  '比類のないコストパフォーマンスを思えば、JCDの人々がこのブランドに夢中になるのも納得です。'],
 'steps.title': '安心してご注文', steps: [['選ぶ', 'ショップを見て、商品ページを開き、カートに入れます。'], ['注文する', 'ログインして住所を入力すると、注文が保存されます。'], ['WhatsAppで確認', 'ショップと直接やり取りして、お支払い方法を決めます。']],
 'info.title': 'アクセス', open: '営業中', closedNow: '現在休業中', closed: '定休日', days: ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'], 'info.wa': 'WhatsAppで連絡',
 'card.more': '詳細を見る', 'card.video': '動画', 'p.size': 'サイズ', 'p.qty': '数量', 'p.add': 'カートに追加', 'p.added': '追加しました ♥', 'p.ask': 'WhatsAppで質問する', 'p.gone': 'この商品は現在ご利用いただけません。', 'p.back': 'ショップに戻る', 'p.related': 'こちらもおすすめ',
 'cart.title': 'カート', 'cart.empty': 'カートは空です。お気に入りのアイテムをショップで選んでください。', 'cart.total': '合計', 'cart.fcfa': 'お支払い金額（FCFA）：', 'cart.addr': '配送先住所', 'cart.addr_ph': '地区・エリア・目印', 'cart.note': 'メモ（任意）', 'cart.note_ph': '色、詳細など…', 'cart.order': 'WhatsAppで注文する', 'cart.saving': '保存中…', 'cart.login': 'ログインして注文',
 'cart.hint': 'ご注文は保存され、その後WhatsAppでショップと確認します。お支払いはショップと直接決めます。', 'cart.hint2': 'アカウントがあると注文状況を確認できます。', 'cart.addr_err': '配送先住所を入力してください。', 'cart.fail': '注文を保存できませんでした。もう一度お試しください。',
 'auth.aside': 'ログインすると、注文状況の確認や、数クリックでの注文ができます。', 'auth.login': 'ログイン', 'auth.signup': '新規登録', 'auth.name': 'お名前', 'auth.phone': '電話番号（WhatsApp）', 'auth.email': 'メールアドレス', 'auth.pass': 'パスワード', 'auth.go': 'ログイン', 'auth.create': 'アカウントを作成', 'auth.wait': 'お待ちください…', 'auth.confirm': 'アカウントを作成しました。メールを確認してからログインしてください。', 'err.login': 'メールアドレスまたはパスワードが正しくありません。', 'err.dup': 'このメールアドレスは既に使われています。',
 'acc.hello': 'こんにちは、', 'acc.logout': 'ログアウト', 'acc.orders': '注文履歴', 'acc.profile': 'プロフィール', 'acc.none': 'まだ注文はありません。ショップをご覧ください。', 'acc.wa': 'WhatsAppで見る', 'acc.save': '保存', 'acc.saved': 'プロフィールを更新しました。',
 st: ['保留中', '確認済み', '支払い済み', '発送済み', '配達済み', 'キャンセル'], prefs: '言語と通貨', 'prefs.lang': '言語', 'prefs.cur': '通貨', 'prefs.note': '価格は参考換算です。ご注文のお支払いはFCFAです。',
 'cat.robes': 'イブニングドレス', 'cat.bureau': 'オフィスウェア', 'cat.ensembles': 'セットアップ', 'cat.accessoires': 'アクセサリー' },
es: { slogan: 'Una buena prenda es un pasaporte a la felicidad', 'nav.collections': 'Colecciones', 'nav.shop': 'Tienda', 'nav.about': 'Nosotros', 'nav.info': 'Info',
 'hero.p': 'La moda femenina que enamora a las jóvenes ejecutivas dinámicas de Abiyán. Made in Africa, sin arruinarte.', 'hero.cta': 'Descubrir la tienda',
 'band.wa': 'Pide por WhatsApp', 'band.qp': 'Calidad y precio inmejorables', all: 'Todo', empty: 'Aún no hay artículos.',
 manifesto: 'Vestir a las mujeres del mundo con Made in Africa, sin arruinarse.', role: 'fundadora', kw: ['Originales', 'Prácticos', 'Cómodos', 'Dinámicos'],
 about: [`${A1} es la marca de prêt-à-porter que enamora a todas las ${A2} (jóvenes ejecutivos dinámicos) de la ciudad de Abiyán. Presente desde hace algunos años en el mercado, BIN LENOIR se ha consolidado como un imprescindible en el armario de las mujeres por la calidad de sus colecciones.`,
  'Preguntada al respecto, la fundadora, la Sra. FOFANA Bin’dia Abiba, confiesa que su ambición es vestir a las mujeres del mundo con Made in Africa sin arruinarse.',
  'En su boutique de Cocody 7ème tranche encontrará una amplia variedad: desde el vestido de noche hasta el look de oficina, pasando por conjuntos para todos los días.',
  'BIN LENOIR apuesta por looks originales, prácticos, cómodos y dinámicos, confeccionados con tejidos delicados, estampados florales, tonos pastel o colores más sobrios. Llevar una prenda BIN LENOIR es abrazar el espíritu de la época. Es afirmar una feminidad elegante y un poco audaz. Es, sobre todo, tener un gusto refinado.',
  'Con una relación calidad-precio sin igual, se comprende fácilmente el entusiasmo de las JCD por esta marca de ropa.'],
 'steps.title': 'Compra con confianza', steps: [['Elige', 'Recorre la tienda, abre la ficha de un artículo y llena tu carrito.'], ['Pide', 'Inicia sesión e indica tu dirección: tu pedido queda registrado.'], ['Confirma por WhatsApp', 'Hablas directamente con la tienda y acuerdas el pago.']],
 'info.title': 'Dónde encontrarnos', open: 'Abierto ahora', closedNow: 'Cerrado ahora', closed: 'Cerrado', days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], 'info.wa': 'Escribir por WhatsApp',
 'card.more': 'Ver detalle', 'card.video': 'Vídeo', 'p.size': 'Talla', 'p.qty': 'Cantidad', 'p.add': 'Añadir al carrito', 'p.added': 'Añadido ♥', 'p.ask': 'Preguntar por WhatsApp', 'p.gone': 'Este artículo ya no está disponible.', 'p.back': 'Volver a la tienda', 'p.related': 'También te puede gustar',
 'cart.title': 'Mi carrito', 'cart.empty': 'Tu carrito está vacío. Elige tus prendas favoritas en la tienda.', 'cart.total': 'Total', 'cart.fcfa': 'Importe a pagar en FCFA:', 'cart.addr': 'Dirección de entrega', 'cart.addr_ph': 'Comuna, barrio, referencia', 'cart.note': 'Nota (opcional)', 'cart.note_ph': 'Color, detalles…', 'cart.order': 'Pedir por WhatsApp', 'cart.saving': 'Guardando…', 'cart.login': 'Inicia sesión para pedir',
 'cart.hint': 'Tu pedido se guarda y luego lo confirmas con la tienda por WhatsApp. El pago se acuerda directamente con ella.', 'cart.hint2': 'Una cuenta te permite seguir tus pedidos.', 'cart.addr_err': 'Indica tu dirección de entrega.', 'cart.fail': 'No se pudo guardar el pedido. Inténtalo de nuevo.',
 'auth.aside': 'Inicia sesión para seguir tus pedidos y comprar en unos clics.', 'auth.login': 'Iniciar sesión', 'auth.signup': 'Registrarse', 'auth.name': 'Nombre completo', 'auth.phone': 'Teléfono (WhatsApp)', 'auth.email': 'Correo electrónico', 'auth.pass': 'Contraseña', 'auth.go': 'Iniciar sesión', 'auth.create': 'Crear mi cuenta', 'auth.wait': 'Espera…', 'auth.confirm': 'Cuenta creada. Confirma tu correo y luego inicia sesión.', 'err.login': 'Correo o contraseña incorrectos.', 'err.dup': 'Este correo ya está en uso.',
 'acc.hello': 'Hola', 'acc.logout': 'Cerrar sesión', 'acc.orders': 'Mis pedidos', 'acc.profile': 'Mi perfil', 'acc.none': 'Aún no tienes pedidos. Visita la tienda.', 'acc.wa': 'Ver en WhatsApp', 'acc.save': 'Guardar', 'acc.saved': 'Perfil actualizado.',
 st: ['Pendiente', 'Confirmado', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'], prefs: 'Idioma y moneda', 'prefs.lang': 'Idioma', 'prefs.cur': 'Moneda', 'prefs.note': 'Los precios se convierten solo a título informativo. Los pedidos se pagan en FCFA.',
 'cat.robes': 'Vestidos de noche', 'cat.bureau': 'Looks de oficina', 'cat.ensembles': 'Conjuntos', 'cat.accessoires': 'Accesorios' },
zh: { slogan: '一件好衣服，就是通往幸福的护照', 'nav.collections': '系列', 'nav.shop': '商店', 'nav.about': '关于我们', 'nav.info': '门店信息',
 'hero.p': '深受阿比让年轻职场人士喜爱的女装成衣品牌。非洲制造，价格亲民。', 'hero.cta': '探索商店',
 'band.wa': '通过WhatsApp下单', 'band.qp': '品质与价格无可匹敌', all: '全部', empty: '暂无商品。',
 manifesto: '让全世界的女性穿上非洲制造的服饰，而且无需花费太多。', role: '创始人', kw: ['原创', '实用', '舒适', '活力'],
 about: [`${A1}是一个深受阿比让所有${A2}（年轻职场人士）喜爱的成衣品牌。品牌进入市场已有数年，凭借高品质的系列，成为女性衣橱中不可或缺的一员。`,
  '品牌创始人FOFANA Bin’dia Abiba女士表示，她的愿望是让全世界的女性都能穿上非洲制造的服饰，而且无需花费太多。',
  '在位于Cocody 7ème tranche的门店里，选择丰富：从晚礼服到职场装，再到日常套装，应有尽有。',
  'BIN LENOIR崇尚原创、实用、舒适而富有活力的造型，采用精致面料，搭配花卉印花、粉彩色调或更沉稳的色彩。穿上BIN LENOIR，就是拥抱时代气息，展现优雅而略带大胆的女性魅力，更重要的是，拥有精致的品位。',
  '凭借无与伦比的性价比，不难理解JCD们为何如此钟爱这个服装品牌。'],
 'steps.title': '放心下单', steps: [['挑选', '浏览商店，打开商品页，加入购物车。'], ['下单', '登录并填写地址，订单即被保存。'], ['在WhatsApp确认', '直接与门店沟通，并商定付款方式。']],
 'info.title': '门店位置', open: '营业中', closedNow: '暂停营业', closed: '休息', days: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'], 'info.wa': '通过WhatsApp联系',
 'card.more': '查看详情', 'card.video': '视频', 'p.size': '尺码', 'p.qty': '数量', 'p.add': '加入购物车', 'p.added': '已添加 ♥', 'p.ask': '通过WhatsApp咨询', 'p.gone': '该商品已下架。', 'p.back': '返回商店', 'p.related': '你可能还喜欢',
 'cart.title': '我的购物车', 'cart.empty': '购物车是空的。去商店挑选您喜欢的款式吧。', 'cart.total': '合计', 'cart.fcfa': '应付金额（FCFA）：', 'cart.addr': '配送地址', 'cart.addr_ph': '区、街区、地标', 'cart.note': '备注（可选）', 'cart.note_ph': '颜色、补充说明…', 'cart.order': '通过WhatsApp下单', 'cart.saving': '保存中…', 'cart.login': '登录后下单',
 'cart.hint': '您的订单会先被保存，然后通过WhatsApp与门店确认。付款方式直接与门店商定。', 'cart.hint2': '注册账号后可查看您的订单。', 'cart.addr_err': '请填写配送地址。', 'cart.fail': '订单保存失败，请重试。',
 'auth.aside': '登录后可查看订单，并几步完成下单。', 'auth.login': '登录', 'auth.signup': '注册', 'auth.name': '姓名', 'auth.phone': '电话（WhatsApp）', 'auth.email': '电子邮箱', 'auth.pass': '密码', 'auth.go': '登录', 'auth.create': '创建账号', 'auth.wait': '请稍候…', 'auth.confirm': '账号已创建。请先确认邮箱，然后登录。', 'err.login': '邮箱或密码不正确。', 'err.dup': '该邮箱已被使用。',
 'acc.hello': '你好，', 'acc.logout': '退出登录', 'acc.orders': '我的订单', 'acc.profile': '我的资料', 'acc.none': '还没有订单，去商店逛逛吧。', 'acc.wa': '在WhatsApp查看', 'acc.save': '保存', 'acc.saved': '资料已更新。',
 st: ['待处理', '已确认', '已付款', '已发货', '已送达', '已取消'], prefs: '语言与货币', 'prefs.lang': '语言', 'prefs.cur': '货币', 'prefs.note': '价格换算仅供参考，订单以FCFA结算。',
 'cat.robes': '晚礼服', 'cat.bureau': '职场装', 'cat.ensembles': '套装', 'cat.accessoires': '配饰' },
ru: { slogan: 'Хорошая одежда — это паспорт в счастье', 'nav.collections': 'Коллекции', 'nav.shop': 'Магазин', 'nav.about': 'О нас', 'nav.info': 'Контакты',
 'hero.p': 'Женская одежда, которую обожают молодые динамичные профессионалы Абиджана. Сделано в Африке — без лишних трат.', 'hero.cta': 'Посмотреть магазин',
 'band.wa': 'Заказ через WhatsApp', 'band.qp': 'Качество по лучшей цене', all: 'Все', empty: 'Пока нет товаров.',
 manifesto: 'Одевать женщин всего мира в одежду Made in Africa — без лишних трат.', role: 'основательница', kw: ['Оригинальные', 'Практичные', 'Удобные', 'Динамичные'],
 about: [`${A1} — бренд прет-а-порте, который обожают все ${A2} (молодые динамичные профессионалы) Абиджана. Уже несколько лет на рынке, BIN LENOIR благодаря качеству своих коллекций стал незаменимой частью женского гардероба.`,
  'Основательница бренда, г-жа FOFANA Bin’dia Abiba, рассказывает, что её цель — одевать женщин всего мира в одежду Made in Africa, не разоряясь.',
  'В её бутике в Cocody 7ème tranche представлен большой выбор: от вечернего платья до офисных нарядов и повседневных комплектов.',
  'BIN LENOIR делает ставку на оригинальные, практичные, удобные и динамичные образы: из деликатных тканей, с цветочными принтами, в пастельных тонах или в более сдержанных цветах. Надеть вещь BIN LENOIR — значит идти в ногу со временем. Это подчеркнуть грациозную и чуть смелую женственность. И прежде всего — обладать утончённым вкусом.',
  'С несравненным соотношением цены и качества легко понять увлечённость JCD этим брендом одежды.'],
 'steps.title': 'Заказывайте уверенно', steps: [['Выбирайте', 'Просмотрите магазин, откройте страницу товара и наполните корзину.'], ['Оформляйте', 'Войдите и укажите адрес: заказ сохранится.'], ['Подтвердите в WhatsApp', 'Вы общаетесь напрямую с магазином и договариваетесь об оплате.']],
 'info.title': 'Как нас найти', open: 'Сейчас открыто', closedNow: 'Сейчас закрыто', closed: 'Закрыто', days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'], 'info.wa': 'Написать в WhatsApp',
 'card.more': 'Подробнее', 'card.video': 'Видео', 'p.size': 'Размер', 'p.qty': 'Количество', 'p.add': 'В корзину', 'p.added': 'Добавлено ♥', 'p.ask': 'Задать вопрос в WhatsApp', 'p.gone': 'Этот товар больше недоступен.', 'p.back': 'Вернуться в магазин', 'p.related': 'Вам также понравится',
 'cart.title': 'Моя корзина', 'cart.empty': 'Ваша корзина пуста. Выберите любимые вещи в магазине.', 'cart.total': 'Итого', 'cart.fcfa': 'К оплате в FCFA:', 'cart.addr': 'Адрес доставки', 'cart.addr_ph': 'Район, квартал, ориентир', 'cart.note': 'Примечание (необязательно)', 'cart.note_ph': 'Цвет, уточнения…', 'cart.order': 'Заказать в WhatsApp', 'cart.saving': 'Сохранение…', 'cart.login': 'Войдите, чтобы заказать',
 'cart.hint': 'Заказ сохраняется, затем вы подтверждаете его с магазином в WhatsApp. Оплата согласовывается напрямую с магазином.', 'cart.hint2': 'Аккаунт позволяет отслеживать заказы.', 'cart.addr_err': 'Укажите адрес доставки.', 'cart.fail': 'Не удалось сохранить заказ. Попробуйте ещё раз.',
 'auth.aside': 'Войдите, чтобы отслеживать заказы и оформлять их в несколько кликов.', 'auth.login': 'Вход', 'auth.signup': 'Регистрация', 'auth.name': 'Полное имя', 'auth.phone': 'Телефон (WhatsApp)', 'auth.email': 'Эл. почта', 'auth.pass': 'Пароль', 'auth.go': 'Войти', 'auth.create': 'Создать аккаунт', 'auth.wait': 'Подождите…', 'auth.confirm': 'Аккаунт создан. Подтвердите почту, затем войдите.', 'err.login': 'Неверная почта или пароль.', 'err.dup': 'Эта почта уже используется.',
 'acc.hello': 'Здравствуйте,', 'acc.logout': 'Выйти', 'acc.orders': 'Мои заказы', 'acc.profile': 'Мой профиль', 'acc.none': 'Заказов пока нет. Загляните в магазин.', 'acc.wa': 'Открыть в WhatsApp', 'acc.save': 'Сохранить', 'acc.saved': 'Профиль обновлён.',
 st: ['Ожидает', 'Подтверждён', 'Оплачен', 'Отправлен', 'Доставлен', 'Отменён'], prefs: 'Язык и валюта', 'prefs.lang': 'Язык', 'prefs.cur': 'Валюта', 'prefs.note': 'Цены пересчитаны только для ориентира. Заказы оплачиваются в FCFA.',
 'cat.robes': 'Вечерние платья', 'cat.bureau': 'Офисная одежда', 'cat.ensembles': 'Комплекты', 'cat.accessoires': 'Аксессуары' }
}
const EXTRA = {
  fr: ['Mode clair', 'Mode sombre', 'Facture PDF'], en: ['Light mode', 'Dark mode', 'Invoice (PDF)'], de: ['Heller Modus', 'Dunkler Modus', 'Rechnung (PDF)'],
  ja: ['ライトモード', 'ダークモード', '請求書（PDF）'], es: ['Modo claro', 'Modo oscuro', 'Factura (PDF)'], zh: ['浅色模式', '深色模式', '发票（PDF）'], ru: ['Светлая тема', 'Тёмная тема', 'Счёт (PDF)'] }
for (const l in EXTRA) Object.assign(D[l], { 'theme.toLight': EXTRA[l][0], 'theme.toDark': EXTRA[l][1], 'acc.invoice': EXTRA[l][2] })
export function t(k) { return D[st.lang]?.[k] ?? D.fr[k] ?? k }
export const cname = c => c.i18n?.[st.lang] || (D.fr['cat.' + c.id] === c.name ? t('cat.' + c.id) : c.name)
export const pname = p => p.i18n?.[st.lang]?.name || p.name
export const pdesc = p => p.i18n?.[st.lang]?.description || p.description
export const tst = s => t('st')[STATUS.indexOf(s)] || s
