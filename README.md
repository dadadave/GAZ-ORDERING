# GazExpress (nom de travail)

Plateforme SaaS de commande et de livraison de bouteilles de gaz (pilote à Yaoundé).

## Web app (`web/`)

Une seule application web progressive (PWA) en React + Vite + TypeScript, avec trois espaces :

| Espace | URL | Pour qui |
|---|---|---|
| Client | `/` → `/accueil` | Ménages et professionnels : commande, paiement, suivi, urgence fuite |
| Livreur | `/livreur` | Missions, livraison avec code, encaissement, caisse du jour |
| Console | `/console` | Gérant, dispatcheur, admin : dispatch, stock, rapports |

État actuel : **prototype cliquable avec données fictives** (`web/src/data/mock.ts`). Supabase sera branché ensuite.

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production + service worker PWA
```
