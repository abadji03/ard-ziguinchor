# Guide de déploiement — Vercel (frontend) + Render (backend)

## Architecture

| Composant | Plateforme | Rôle |
|---|---|---|
| `frontend/` (Next.js) | **Vercel** | Site public + back-office admin |
| `backend/` (NestJS + Prisma) | **Render** (Web Service) | API REST sous `/api` |
| PostgreSQL | **Render** (Database) | Base de données |
| Cloudinary | Externe | Stockage des images (déjà configuré) |

## 1. Base de données (Render)

1. Créer un **PostgreSQL** sur Render.
2. Copier la **External Database URL** (pour les migrations depuis votre PC) et la **Internal Database URL** (pour le backend hébergé sur Render, plus rapide).
3. Format : `postgresql://user:password@host:5432/db?sslmode=require`

## 2. Backend sur Render

Créer un **Web Service** lié au repo GitHub :

| Paramètre | Valeur |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start:prod:migrate` (applique les migrations puis démarre) |
| Health Check Path | `/api` |

**Variables d'environnement** (copier depuis `backend/.env.example`) :

```
NODE_ENV=production
DATABASE_URL=<Internal Database URL de Render>
CORS_ORIGIN=https://<votre-projet>.vercel.app
JWT_SECRET=<longue chaîne aléatoire — NE PAS réutiliser celle du .env local>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
REDIS_HOST=        (laisser vide : cache mémoire — ou créer un Redis Render)
```

> ⚠️ Après le premier déploiement, noter l'URL du service (ex. `https://ard-ziguinchor-api.onrender.com`). Elle sert pour `NEXT_PUBLIC_API_URL` et `CORS_ORIGIN`.

## 3. Frontend sur Vercel

1. Importer le repo GitHub sur Vercel.
2. **Root Directory** : `frontend` (Vercel détecte Next.js automatiquement).
3. **Variables d'environnement** (copier depuis `frontend/.env.example`) :

```
NEXT_PUBLIC_API_URL=https://<votre-service>.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://<votre-projet>.vercel.app
```

4. Déployer.

> ⚠️ Les variables `NEXT_PUBLIC_*` sont inlinées **au build** : si l'URL de l'API change, il faut redéployer le frontend.

> ⚠️ Boucle d'initialisation : `CORS_ORIGIN` (Render) dépend de l'URL Vercel, qui existe après création du projet Vercel. Ordre conseillé : créer Vercel d'abord (ça échouera à l'appel API, pas grave), récupérer l'URL, configurer Render, puis redéployer Vercel.

## 4. Développement local (inchangé)

```bash
# Backend  (port 3000)
cd backend && npm run start:dev

# Frontend (port 3001)
cd frontend && npm run dev
```

Les fichiers locaux `backend/.env` et `frontend/.env.local` continuent de fonctionner exactement comme avant — ils ne sont pas versionnés (`.gitignore`).

## 5. Changements apportés au code (compatibles local + prod)

1. **CORS multi-origines** (`backend/src/main.ts`) : `CORS_ORIGIN` accepte désormais plusieurs origines séparées par des virgules. En local, rien ne change (fallback `http://localhost:3001`).
2. **Cache Redis optionnel** (`backend/src/cache/cache.module.ts`) : si `REDIS_HOST` n'est pas défini, le cache mémoire intégré est utilisé au lieu de planter faute de Redis.
3. **Scripts de migration** (`backend/package.json`) : ajout de `migrate:deploy` et `start:prod:migrate`.
4. **Fichiers modèles** : `backend/.env.example` et `frontend/.env.example` (versionnés dans Git, sans secrets).

## 6. Checklist de mise en production

- [ ] `JWT_SECRET` différent et plus fort qu'en local
- [ ] `CORS_ORIGIN` = URL Vercel exacte (sans `/` final)
- [ ] Migrations appliquées (`start:prod:migrate` ou `npm run migrate:deploy` manuellement)
- [ ] Seed : `npm run db:seed` depuis le backend si base vierge (upserts, sans duplication) — ou déployer avec `start:prod:seed` qui applique les migrations + le seed avant de démarrer l'API
- [ ] Cloudinary : mêmes credentials, les uploads resteront fonctionnels
- [ ] Tester : connexion admin, création d'article avec upload d'image, affichage public
