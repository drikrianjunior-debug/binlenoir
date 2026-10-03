# BIN LENOIR — Boutique (Vue 3 + Motion for Vue + Supabase)
1. `npm install` puis `npm run dev` : sans clés Supabase, le site tourne en **mode démo** (admin : admin@binlenoir.ci / admin123, données stockées dans le navigateur).
2. Production (dans cet ordre) : créez un projet sur supabase.com, exécutez `supabase/schema.sql` puis `supabase/catalogue.sql` dans le SQL Editor (si `schema.sql` est déjà passé, lancez seulement `catalogue.sql`), copiez `.env.example` en `.env` avec l'URL et la clé anon (idem dans Vercel > Environment Variables).
3. Créez votre compte sur /connexion, puis passez-le admin : `update profiles set role = 'admin' where email = 'votre@email.com';`
4. Catalogue : **/admin > Catalogue** (catégories, tailles, prix, photos, description, vidéo). Au premier lancement, le bouton « Importer des articles d'exemple » remplit le catalogue. WhatsApp : constante `WA` dans `src/data.js`.

5. Traductions des articles/catégories : si `catalogue.sql` a déjà été exécuté, lancez `supabase/update-i18n.sql`.

## QR codes, factures, thème
- `VITE_SITE_URL` (optionnel, dans `.env` et Vercel) : adresse publique du site encodée dans les QR codes des articles (sinon l'adresse courante est utilisée : pensez à générer vos étiquettes depuis le site en ligne, pas depuis localhost).
- Facture PDF : disponible pour les commandes au statut « Livrée » (admin > Commandes, et espace client). Mentions légales (RCCM, etc.) : constante `LEGAL` dans `src/data.js`.
