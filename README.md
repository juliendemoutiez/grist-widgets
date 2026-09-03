# grist-widget

Widgets personnalisés pour [Grist](https://www.getgrist.com/), écrits en React + TypeScript
et servis en pages statiques.

| Widget | Page | Description |
| --- | --- | --- |
| Notes | `pages/notes.html` | Éditeur de notes hiérarchiques (tiptap) : arborescence, mentions `[[…]]`, emojis, archivage |
| Todo | `pages/todo.html` | Liste de tâches groupée par projet / échéance / priorité, avec tri et filtres |

## Utilisation dans Grist

1. Ajouter un widget **Custom** à la page.
2. Dans le panneau de droite, choisir *Custom URL* et coller l'URL de la page
   (ex. `https://<user>.github.io/grist-widget/pages/notes.html`).
3. Donner l'accès **Full document access** — les widgets lisent et écrivent dans la table
   sélectionnée.
4. Mapper les colonnes attendues par le widget dans la section *Columns*.

## Développement

Node 22 (voir `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:5173 — page d'accueil listant les widgets
npm run build     # type-check (tsc -b) puis build Vite dans dist/
npm run preview   # sert dist/
npm run lint
```

Chaque widget est une page à part entière déclarée dans `vite.config.ts`
(`build.rollupOptions.input`). Le script `grist-plugin-api.js` est chargé par CDN depuis
les fichiers HTML ; le paquet npm `grist-plugin-api` ne fournit que les types.

## Structure

```
index.html              page d'accueil (liste des widgets)
pages/                  une page HTML par widget
src/
  lib/
    contexts/           GristProvider / useGrist : records, options, CRUD, cache de table
    utils/grist.ts      helpers d'encodage Grist (RefList, ChoiceList, dates, hyperliens)
    ui/                 primitives Radix habillées (Menu, Tooltip)
    index.ts            barrel exporté sous l'alias @lib
  styles/
    tokens.css          variables de design (couleurs, rayons, ombres, police)
    globals.scss        base html/body + police Material Icons
    reset.scss          reset CSS
  widgets/
    notes/  todo/       un dossier par widget (composants + SCSS + main.tsx)
```

L'UI repose sur des primitives [Radix](https://www.radix-ui.com/) sans style, habillées avec
les tokens CSS de `src/styles/tokens.css`. Il n'y a pas de dépendance à un design system
externe : pour changer l'apparence, éditer `tokens.css`.

## Déploiement

Un push sur `main` déclenche `.github/workflows/deploy.yml`, qui build avec
`VITE_BASE_URL=/<nom-du-repo>/` et publie `dist/` sur la branche `gh-pages`.
Activer GitHub Pages sur cette branche dans les réglages du dépôt.
