# ScreenMind

> **Site en ligne : https://fr3nchh.github.io/ScreenMind/**

[![Ouvrir le site](https://img.shields.io/badge/Ouvrir%20le%20site-ScreenMind-e2762f?style=for-the-badge)](https://fr3nchh.github.io/ScreenMind/)

**Photo d'un exercice ou d'un contrôle → le site lit le texte, détecte la langue et trouve les réponses.**

Le site fonctionne directement dans le navigateur. Il accepte les **images, PDF, fichiers texte et audio**.

![Aperçu du site](screenshot.png)

> Pour ajouter une capture d'écran : dépose ton image dans le dépôt sous le nom `screenshot.png`
> (ou change le nom dans la ligne ci-dessus).

## Fonctionnement

1. **📷 La photo** — import d'un fichier, prise de photo avec la caméra, ou capture d'écran.
2. **🔍 Analyse locale** — OCR (Tesseract.js) amélioré automatiquement (agrandissement, contraste, binarisation Otsu quand elle aide).
3. **🌍 Langue détectée automatiquement** — français, anglais, espagnol, italien, allemand, portugais.
4. **✅ Réponses automatiques** — le site résout tout seul, sans connexion :
   - calculs avec priorités, parenthèses, puissances, racines (`(5+2)^3`, `12 × 5 + 3`)
   - pourcentages (`20 % de 500`)
   - équations du 1ᵉʳ et du 2ᵉ degré (`3x + 5 = 20`, `x² − 5x + 6 = 0`)
   - vérifications `VRAI` / `FAUX`
5. **🤖 Corrigé complet** — si l'énoncé est trop complexe (rédaction, explication, OCR raté…),
   la photo part automatiquement à l'IA choisie et le corrigé revient **dans la langue de l'image**.
6. **🌐 Recherches** — liens Google / Scholar / YouTube / Wikipédia construits dans la langue détectée.

## Activer le corrigé IA

### 🔑 Mode par défaut : la clé est déjà intégrée (recommandé)

Le site appelle un **petit serveur gratuit** (Cloudflare Worker, code dans `worker.js`) qui
detient la clé API. Elle est stockée en **variable secrète côté serveur** :
elle n'apparaît **ni dans le site, ni dans GitHub, ni dans ton navigateur**.
Sélectionne **🔑 ScreenMind (clé intégrée)** dans le panneau **🔑 Clé IA** → rien d'autre à faire.

> Le code de ce serveur est dans [`worker.js`](worker.js), son URL dans `script.js` (`PROXY_URL`) ;
> pour modifier la clé : Cloudflare Dashboard → Workers → `screenmind` → Settings → Variables and Secrets.

### Autres fournisseurs (clé collée dans le navigateur)

Le site supporte aussi **5 fournisseurs** (4 gratuits) — choisis-le dans le panneau **🔑 Clé IA** :

| Fournisseur | Clé | Modèle par défaut |
|---|---|---|
| **Google Gemini** | [Gratuite sur AI Studio](https://aistudio.google.com/app/apikey) (peut renvoyer 403 si ton compte a < 18 ans, si ta région est bloquée ou si c'est un compte Éducation) | `gemini-2.5-flash` |
| **OpenRouter** | [Gratuite sur openrouter.ai](https://openrouter.ai/keys), aucune carte bancaire, pas de blocage géo | `nvidia/nemotron-3.5-super-vl:free` |
| **Groq** | [Gratuite sur console.groq.com](https://console.groq.com/keys), très rapide | `meta-llama/llama-4-scout-17b-16e-instruct` |
| **Mistral AI** | [Offre gratuite](https://console.mistral.ai/api-keys), entreprise française | `mistral-small-latest` |
| **OpenAI** | [Payante](https://platform.openai.com/api-keys) | `gpt-5-nano` |

1. Crée une clé chez le fournisseur de ton choix.
2. Sur le site : panneau **🔑 Clé IA** → choisis le fournisseur → colle la clé → *Enregistrer*.
3. Tu peux aussi changer de modèle (optionnel) si le défaut ne convient pas.
4. La clé reste stockée uniquement dans ton navigateur (`localStorage`), jamais sur un serveur.

Sans clé, le site continue de fonctionner : il lit, détecte et résout tout ce qui est calculable hors connexion.

## Fichiers

| Fichier      | Rôle                                              |
|--------------|---------------------------------------------------|
| `index.html` | Structure de la page                              |
| `style.css`  | Thème et mise en page                             |
| `script.js`  | Capture, OCR, détection langue/matière, solveur, IA multi-fournisseurs |
| `worker.js`  | Proxy Cloudflare qui garde la clé API cachée       |

## Lancer en local

Ouvre simplement `index.html` dans un navigateur.

> ⚠️ La **caméra** nécessite une page en `https://` (ou `localhost`) : elle fonctionne donc
> sur GitHub Pages, mais peut être bloquée si tu ouvres le fichier en `file://`.
> L'import de fichier et la capture d'écran marchent partout.
