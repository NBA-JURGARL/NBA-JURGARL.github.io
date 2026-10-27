# NBA-JURGARL.github.io

Portfolio statique : HTML et CSS purs, sans JavaScript, sans build et sans ressource externe.
Il est publié par GitHub Pages depuis la branche `main`, à l'adresse https://nba-jurgarl.github.io/

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Tout le contenu. Chaque section est repérée par un commentaire `<!-- ===== NOM ===== -->`. |
| `assets/style.css` | Le style. Les couleurs sont dans le bloc `:root`, en haut du fichier. |
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

## Ajouter la version anglaise (Canada)

1. Copie `index.html` dans `en/index.html`, puis traduis le texte.
2. Dans la copie, passe `lang="fr"` à `lang="en"`, et remplace les chemins `assets/…` par `../assets/…`.
3. Dans les deux fichiers, décommente le bloc `hreflang` du `<head>` et le lien `EN`/`FR` de la navigation.

## Sécurité

- Une Content-Security-Policy stricte est déclarée en balise `<meta>` : uniquement des ressources locales, aucun script.
- Si tu ajoutes un jour du JS ou une image externe, il faudra modifier cette CSP.
- Limite : GitHub Pages ne permet pas d'envoyer d'en-têtes HTTP personnalisés, et `frame-ancestors` (protection contre l'intégration en iframe) ne fonctionne pas en balise meta.
- Ne publie aucun détail interne de l'entreprise : noms de serveurs, adresses IP, domaines internes, captures d'écran.

## TODO restants

Pour ajouter les dates plus tard, utilise une ligne `<p class="when">…</p>` au-dessus du `<h3>` de chaque étape du Parcours.
