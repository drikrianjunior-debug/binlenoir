-- Si catalogue.sql a déjà été exécuté, lancez uniquement ce fichier (traductions des articles et catégories)
alter table products add column if not exists i18n jsonb not null default '{}';
alter table categories add column if not exists i18n jsonb not null default '{}';
