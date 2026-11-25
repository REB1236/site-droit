# Marché des capitaux · Maroc

Site pédagogique sur les infrastructures du marché des capitaux marocain. Il contient :

- le cours (parcours d'un ordre, simulateur de couverture, quiz) ;
- une bibliothèque des sources rangée selon la hiérarchie des normes ;
- un guide pour investir en Bourse ;
- un **assistant IA** qui lit les textes officiels et cite les articles.

## Ce que lit l'assistant (`data/corpus.json`)

Constitution 2011, lois 43-12, 44-12, 19-14, 35-96, 42-12, 45-12 (+ 83-20), 24-01, 26-03, décret 2-18-827 (ICMAT), règlement général de la Bourse des valeurs, règlement général de la société gestionnaire du marché à terme. Ça fait environ 1 100 articles.
Ces textes viennent de l'AMMC, du portail Adala du ministère de la Justice et du Bulletin officiel. Certains ont été numérisés, donc il peut rester quelques coquilles. La loi 43-12 est incomplète : 55 articles sur 61.

## Mettre le site en ligne sur Vercel (gratuit)

### Option 1 : GitHub + Vercel (sans terminal)

1. Sur github.com, crée un dépôt vide (par ex. `marche-des-capitaux`).
2. Clique sur « uploading an existing file » et glisse **tout le contenu** de ce dossier (sauf `node_modules` s'il existe). Valide avec « Commit changes ».
3. Sur vercel.com : **Add New… → Project**, importe le dépôt, puis clique sur **Deploy**. Vercel détecte Vite tout seul.
4. Dans le projet Vercel, va dans **Settings → Environment Variables** et ajoute **une** de ces clés :
   - `ANTHROPIC_API_KEY` (Claude) ;
   - ou `OPENAI_API_KEY` ;
   - ou `GEMINI_API_KEY`.
5. Va dans **Deployments → ⋯ → Redeploy** pour que la clé soit prise en compte.

### Option 2 : en ligne de commande

```bash
npm install
npx vercel          # première mise en ligne
npx vercel env add ANTHROPIC_API_KEY
npx vercel --prod
```

## Réglages optionnels (variables d'environnement Vercel)

| Variable | Rôle | Valeur par défaut |
|---|---|---|
| `ANTHROPIC_MODEL` | modèle Claude | `claude-haiku-5-5` |
| `OPENAI_MODEL` | modèle OpenAI | `gpt-5-mini` |
| `GEMINI_MODEL` | modèle Gemini | `gemini-2.5-flash` |
| `ACCESS_CODE` | code demandé avant d'utiliser le chatbot, pour que des inconnus ne consomment pas tes crédits | aucun |
| `RATE_LIMIT` | nombre de questions par adresse IP sur 10 minutes | `25` |

Si la clé est refusée ou que le modèle n'existe plus chez le fournisseur, le chatbot affiche un message clair. Il suffit alors de changer la variable concernée.

**Sécurité** : la clé API ne doit jamais être écrite dans le code ni envoyée à quelqu'un. Elle reste uniquement dans les variables d'environnement de Vercel et n'est utilisée que par `api/chat.js`, côté serveur.

## Développement local

```bash
npm install
npm run build
MOCK_LLM=1 node scripts/local-server.mjs   # chatbot de test sans clé, sur http://localhost:4173
npm run test:search                        # vérifie la recherche dans les textes
```

## Structure

- `src/` : le site (React + Vite + Tailwind) : pages `Cours`, `Sources`, `Investir` et composant `Chat`.
- `api/chat.js` : recherche les articles pertinents (`api/_lib/search.js`), puis interroge le modèle d'IA (`api/_lib/llm.js`) avec les consignes de `api/_lib/prompt.js`.
- `api/status.js` : indique au site si une clé est configurée.
- `data/corpus.json` : les textes officiels découpés par article.
