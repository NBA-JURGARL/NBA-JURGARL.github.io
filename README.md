# NBA-JURGARL.github.io

Portfolio statique : HTML et CSS purs, sans JavaScript, sans build et sans ressource externe.
Il est publié par GitHub Pages depuis la branche `main`, à l'adresse https://nba-jurgarl.github.io/

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Contenu français. Chaque section est repérée par un commentaire `<!-- ===== NOM ===== -->`. |
| `en/index.html` | Contenu anglais, même structure. |
| `assets/cv/` | Les CV en PDF (FR et EN). |
| `assets/style.css` | Le style. Les couleurs, polices et vitesses d'animation sont dans le bloc `:root`, en haut du fichier. |
| `assets/main.js` | Les animations d'entrée (facultatives). |
| `assets/scene.js` | La scène Wazuh animée au défilement (section Projets), avec GSAP. |
| `assets/vendor/` | GSAP 3.15 et ScrollTrigger, hébergés sur le site (licence GSAP « Standard no-charge », https://gsap.com/standard-license). |
| `assets/fonts/` | Les polices hébergées sur le site et leurs licences. |
| `assets/photo.jpg` | Ta photo (480×480, sans métadonnées). |
| `assets/favicon.svg` | L'icône de l'onglet. |
| `.well-known/security.txt` | Contact sécurité (RFC 9116). **Mets à jour `Expires:` avant le 27/10/2027.** |
| `.nojekyll` | Empêche Jekyll d'ignorer le dossier `.well-known`. Ne pas supprimer. |

## Modifier le contenu

- **Texte d'une section** : ouvre `index.html` et cherche `===== ACCUEIL`, `COMPÉTENCES`, `PROJETS`, `PARCOURS` ou `CONTACT`.
- **Ajouter un projet** : copie un bloc `<article class="card"> … </article>` dans la section Projets, puis modifie-le.
- **Ajouter une compétence** : ajoute un `<li>` dans la liste `tags` de la bonne carte.
- **Statut d'un élément** : `<span class="badge badge-now">En cours</span>` ou `<span class="badge badge-goal">Objectif</span>`.
- **Couleurs** : modifie les variables `--bg`, `--accent`, etc. dans `assets/style.css`. Garde un contraste d'au moins 4.5:1 entre le texte et le fond.

## Prévisualiser en local

```sh
python3 -m http.server -d ~/site 8000
```
Ouvre ensuite http://localhost:8000

## Publier

```sh
cd ~/site
git add -A
git commit -m "Mise à jour du contenu"
git push
```
GitHub Pages republie le site en une ou deux minutes.

## Deux langues

- `index.html` est la version française, `en/index.html` la version anglaise. Le bouton `EN`/`FR` de l'en-tête passe de l'une à l'autre.
- **Toute modification de contenu doit être faite dans les deux fichiers.**
- Dans `en/index.html`, les chemins commencent par `../assets/…`.

## CV

- `assets/cv/CV_Justin_Huchet_FR.pdf` est lié depuis la page française, `assets/cv/CV_Justin_Huchet_EN.pdf` depuis la page anglaise.
- Pour les mettre à jour : exporte ton CV en PDF depuis Word ou LibreOffice, et remplace le fichier en gardant **exactement le même nom**.
- Avant de publier, retire le téléphone, l'âge et l'adresse précise : le PDF est téléchargeable par n'importe qui.

## Sécurité

- Une Content-Security-Policy stricte est déclarée en balise `<meta>` : uniquement des ressources locales (`'self'`), et aucun script ni style écrit directement dans le HTML (pas d'attribut `style="…"`, pas de `<script>…</script>` en ligne).
- Les scripts sont tous hébergés sur le site : `assets/main.js` (apparitions, chiffres, indicateur de défilement), `assets/scene.js` et GSAP dans `assets/vendor/` (scène Wazuh). Sans eux, la page s'affiche complète et immobile, avec le schéma Wazuh en entier.
- Pour modifier le texte de la scène Wazuh : il est dans le bloc `<div class="scene">` de chaque page (étapes dans `<ol class="scene-steps">`, libellés du schéma dans les `<text>` du `<svg>`).
- Les polices (Space Grotesk, JetBrains Mono) sont dans `assets/fonts/`, avec leurs licences OFL.
- Si tu ajoutes un jour une ressource externe, il faudra modifier cette CSP dans les deux pages.
- Limite : GitHub Pages ne permet pas d'envoyer d'en-têtes HTTP personnalisés, et `frame-ancestors` (protection contre l'intégration en iframe) ne fonctionne pas en balise meta.
- Ne publie aucun détail interne de l'entreprise : noms de serveurs, adresses IP, domaines internes, captures d'écran.

## TODO restants

Pour ajouter les dates plus tard, utilise une ligne `<p class="when">…</p>` au-dessus du `<h3>` de chaque étape du Parcours.
