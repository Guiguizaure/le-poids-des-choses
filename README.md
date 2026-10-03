# Le poids des choses

Un comparateur carbone illustré : pose deux gestes du quotidien sur une balance, note ton
choix, et un jardin dessiné grandit avec les kilos de CO2e évités.

Projet vitrine du portfolio [webjuno.com](https://webjuno.com).

> Projet indépendant, non affilié à l'ADEME.

## Stack

- Next.js (App Router) + TypeScript, export 100 % statique (Cloudflare Pages)
- Tailwind CSS 4
- Vitest, ESLint, Prettier
- Données : API Impact CO2 de l'ADEME (via un script local)

## Installation

```bash
pnpm install
pnpm dev      # serveur de développement
pnpm build    # génère le site statique dans out/
pnpm lint
pnpm test
pnpm format
```

Les clés API vont dans un fichier `.env.local`, jamais versionné.
