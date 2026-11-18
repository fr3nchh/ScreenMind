# 🧠 ScreenMind

**Photo d'un exercice ou d'un contrôle → le site lit le texte, détecte la langue et complète les réponses.**

Site 100 % statique (aucun serveur, aucun back-end) : il suffit d'ouvrir `index.html`.

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
   la photo part automatiquement à **Gemini** et le corrigé revient **dans la langue de l'image**.
6. **🌐 Recherches** — liens Google / Scholar / YouTube / Wikipédia construits dans la langue détectée.

## Activer le corrigé Gemini (optionnel)

1. Crée une clé **gratuite** sur [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sur le site : panneau **🔑 Clé Gemini** → colle la clé → *Enregistrer*.
3. La clé reste stockée uniquement dans ton navigateur (`localStorage`), jamais sur un serveur.

Sans clé, le site continue de fonctionner : il lit, détecte et résout tout ce qui est calculable hors connexion.

## Fichiers

| Fichier      | Rôle                                              |
|--------------|---------------------------------------------------|
| `index.html` | Structure de la page                              |
| `style.css`  | Thème et mise en page                             |
| `script.js`  | Capture, OCR, détection langue/matière, solveur, Gemini |

## Lancer en local

Ouvre simplement `index.html` dans un navigateur.

> ⚠️ La **caméra** nécessite une page en `https://` (ou `localhost`) : elle fonctionne donc
> sur GitHub Pages, mais peut être bloquée si tu ouvres le fichier en `file://`.
> L'import de fichier et la capture d'écran marchent partout.
