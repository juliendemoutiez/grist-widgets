# grist-widget

Widgets personnalisés pour [Grist](https://www.getgrist.com/), écrits en React + TypeScript
et servis en pages statiques.

| Widget | Page | Description |
| --- | --- | --- |
| Notes | `pages/notes.html` | Éditeur de notes hiérarchiques (tiptap) : arborescence, mentions `[[…]]`, emojis, archivage |
| Todo | `pages/todo.html` | Liste de tâches groupée par projet / échéance / priorité, avec tri et filtres |
| Formulaire imbriqué | `pages/nested-form.html` | Fiche de saisie configurable en JSON : champs, sous-tâches, commentaires, historique |

## Utilisation dans Grist

1. Ajouter un widget **Custom** à la page.
2. Dans le panneau de droite, choisir *Custom URL* et coller l'URL de la page
   (ex. `https://<user>.github.io/grist-widget/pages/notes.html`).
3. Donner l'accès **Full document access** — les widgets lisent et écrivent dans la table
   sélectionnée.
4. Mapper les colonnes attendues par le widget dans la section *Columns*.

## Configurations (`instances/`)

Le widget « formulaire imbriqué » se configure en JSON, collé dans le champ *options* du
widget côté Grist. Les configurations utilisées en production sont archivées dans
`instances/` pour ne pas exister uniquement dans un document Grist :

| Fichier | Widget | Document |
| --- | --- | --- |
| `todo-form.json` | nested-form | fiche d'une tâche (table `Taches`) — complète le widget Todo |

Pour l'appliquer : ouvrir le widget dans Grist, coller le contenu du fichier dans les
options, et mapper les colonnes citées par la configuration.

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
instances/              configurations JSON archivées (voir « Configurations »)
pages/                  une page HTML par widget
src/
  lib/
    contexts/           GristProvider / useGrist ; NavigationProvider (écrans imbriqués)
    utils/grist.ts      helpers d'encodage Grist (RefList, ChoiceList, dates, hyperliens)
    hooks/              useColumnMeta, useReadOnlyFields, useRelativeDate
    components/         PickerSelect, DatePickerSelect, MarkdownEditor, WidgetSettings
    ui/                 primitives sans dépendance (Menu, Tooltip, Avatar, Button)
    types.ts            types de configuration du formulaire imbriqué
    index.ts            barrel exporté sous l'alias @lib
  styles/
    tokens.css          variables de design (couleurs, rayons, ombres, police)
    globals.scss        base html/body + police Material Icons
    reset.scss          reset CSS
  widgets/
    notes/  todo/       un dossier par widget (composants + SCSS + main.tsx)
    nested-form/
```

L'UI repose sur des primitives [Radix](https://www.radix-ui.com/) sans style, habillées avec
les tokens CSS de `src/styles/tokens.css`. Il n'y a pas de dépendance à un design system
externe : pour changer l'apparence, éditer `tokens.css`.

Les valeurs de `tokens.css` reprennent celles du thème `dsfr-light` de La Suite, qui était
le thème déclaré par les widgets à l'origine — le rendu est donc inchangé.

## Déploiement

Un push sur `main` déclenche `.github/workflows/deploy.yml`, qui build avec
`VITE_BASE_URL=/<nom-du-repo>/` et publie `dist/` sur la branche `gh-pages`.
Activer GitHub Pages sur cette branche dans les réglages du dépôt.
