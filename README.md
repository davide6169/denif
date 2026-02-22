# Denif - PWA E-commerce Scarpe Artigianali

**My Hands. Your steps.** - Un e-commerce PWA per scarpe fatte a mano da un'artigiana ex-Fendi.

## 🚀 Caratteristiche

- ✅ **PWA Progressivo**: Installabile su mobile, supporto offline
- ✅ **Catalogo Dinamico**: Prodotti gestiti via AirTable (nessun deploy necessario)
- ✅ **Carrello Locale**: Persistenza con localStorage
- ✅ **Responsive Design**: Ottimizzato per mobile e desktop
- ✅ **Performance**: Astro SSG + Tailwind CSS per caricamento istantaneo
- ✅ **SEO Friendly**: Meta tags ottimizzati
- ✅ **Gratuito**: Hosting su Vercel a costo zero

## 📦 Tecnologie

- **Framework**: Astro 5 (Static Site Generation)
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components shadcn/ui-style
- **PWA**: Vite PWA Plugin
- **Hosting**: Vercel (gratis)
- **Catalogo**: AirTable API
- **Pagamenti**: Stripe Checkout (opzionale)

## 🛠️ Setup e Installazione

### Prerequisiti

- Node.js 18+
- npm o yarn
- Account AirTable (gratis)
- Account Stripe (opzionale, per pagamenti)

### 1. Installazione

```bash
# Installa le dipendenze
npm install

# Copia il file environment
cp .env.example .env
```

### 2. Configurazione AirTable

1. Crea un account su [AirTable](https://airtable.com/)
2. Crea una nuova base (Base)
3. Crea una tabella chiamata "Prodotti" con questi campi:
   - **Name** (Single line text) - Nome del prodotto
   - **Prezzo** (Currency) - Prezzo in EUR
   - **Descrizione** (Long text) - Descrizione completa
   - **Immagini** (Attachments) - Foto del prodotto
   - **Categoria** (Single select) - Es: Décolleté, Sandali, Stivaletti
   - **Taglie** (Multiple select) - Es: 36, 37, 38, 39, 40, 41
   - **InStock** (Checkbox) - Disponibilità (default: true)

4. Ottieni le tue credenziali:
   - API Key: https://airtable.com/account
   - Base ID: Nella URL della tua base: `https://airtable.com/appXXXXX/...`

5. Configura le variabili environment in `.env`:

```env
AIRTABLE_API_KEY=keyXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Prodotti
```

### 3. Configurazione Stripe (Opzionale)

Se vuoi integrare i pagamenti online:

1. Crea un account su [Stripe](https://stripe.com/)
2. Ottieni le chiavi API da https://dashboard.stripe.com/apikeys
3. Configura in `.env`:

```env
PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

4. **Nota**: Per l'implementazione completa serve un backend per creare Checkout Sessions.
   Per ora, l'opzione più semplice è usare WhatsApp per gli ordini.

### 4. Configurazione WhatsApp

Modifica il numero WhatsApp nei file:

1. In `.env`:
```env
WHATSAPP_NUMBER=39XXXXXXXXXX
```

2. Aggiorna nei file:
   - `src/components/Cart.astro` (link checkout WhatsApp)
   - `src/components/Footer.astro` (link contatti)
   - `src/pages/index.astro` (link CTA)

### 5. Sviluppo Locale

```bash
# Avvia il dev server
npm run dev

# Apri http://localhost:4321
```

## 📁 Struttura del Progetto

```
denif/
├── src/
│   ├── components/          # Componenti riutilizzabili
│   │   ├── Cart.astro       # Carrello slide-out
│   │   ├── Footer.astro     # Footer globale
│   │   ├── Header.astro     # Header responsive
│   │   └── ProductCard.astro # Card prodotto
│   ├── layouts/
│   │   └── Layout.astro     # Layout base + PWA meta
│   ├── lib/
│   │   └── airtable.ts      # Client AirTable API
│   ├── pages/
│   │   ├── index.astro      # Homepage
│   │   ├── catalogo.astro   # Catalogo con filtri
│   │   ├── prodotto/
│   │   │   └── [id].astro   # Dettaglio prodotto
│   │   └── chi-sono.astro   # Storia brand
│   └── styles/
│       └── global.css       # Tailwind imports
├── public/
│   ├── icons/               # PWA icons (da generare)
│   ├── favicon.svg
│   └── favicon.ico
├── astro.config.mjs         # Config Astro + PWA
├── tailwind.config.ts       # Config Tailwind
└── package.json
```

## 🎨 Personalizzazione

### Colori e Fonts

I colori principali sono definiti in `src/layouts/Layout.astro`:

```css
:root {
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
}
```

### Logo

Sostituisci il logo in `src/components/Header.astro`:

```astro
<a href="/" class="flex items-center space-x-2">
  <span class="text-2xl font-semibold">DENIF</span>
</a>
```

### Placeholder Immagini

Le immagini dei prodotti sono placeholder da Unsplash. Quando carichi i prodotti su AirTable con le tue foto, verranno usate automaticamente.

## 🚀 Deployment su Vercel

### 1. Prepara il Repository

```bash
git init
git add .
git commit -m "Initial commit"
# Push su GitHub
```

### 2. Deploy su Vercel

1. Vai su [vercel.com](https://vercel.com/)
2. Importa il repository GitHub
3. Configura le Environment Variables nel dashboard Vercel:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_TABLE_NAME`
   - `PUBLIC_STRIPE_PUBLIC_KEY` (opzionale)

4. Deploy automatico! ✨

### 3. Dominio Personalizzato (Opzionale)

1. Vai su Settings > Domains nel dashboard Vercel
2. Aggiungi il tuo dominio (es. `denif.it`)
3. Aggiorna i DNS secondo le istruzioni

## 📱 PWA Features

### Icone PWA

Manca la cartella `public/icons/` con le icone in vari formati. Puoi generarle usando uno strumento online come:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

Oppure con sharp:

```bash
# Installa sharp CLI
npm install -g sharp

# Genera icone da una sorgente (da una icona 512x512)
sharp input-icon.png -o public/icons/icon-72x72.png --resize 72 72
sharp input-icon.png -o public/icons/icon-96x96.png --resize 96 96
# ... e così via per tutte le dimensioni
```

### Test PWA

1. Apri il sito in Chrome
2. Apri DevTools > Application
3. Controlla:
   - Manifest: Presente e valido
   - Service Workers: Registrato e attivo
   - Installabile: Icona "+" nella barra indirizzi

## 💰 Costi

| Servizio | Costo Mensile | Note |
|----------|---------------|------|
| Vercel Hosting | 0€ | Piano hobby (gratuito) |
| AirTable | 0€ | Fino a 1,000 record |
| Stripe | 0€ fissi | 1.4% + €0.25 per transazione |
| Dominio (opzionale) | ~1€/mese | Se usi .it, .com |

**Totale**: ~0€/mese + commissioni sulle vendite

## 🔄 Gestione Prodotti

### Aggiungere un Prodotto

1. Apri AirTable
2. Aggiungi una nuova riga nella tabella "Prodotti"
3. Compila i campi:
   - Name: "Décolleté Nero"
   - Prezzo: 280
   - Descrizione: "Descrizione completa..."
   - Immagini: Trascina le foto
   - Categoria: Seleziona dalla lista
   - Taglie: Seleziona le taglie disponibili
   - InStock: Spunta se disponibile
4. **Salva** → Automaticamente online in 24 ore (cache)

### Modificare un Prodotto

Basta modificare i campi in AirTable e salvare. Le modifiche appariranno sul sito dopo la scadenza della cache (24 ore) o manualmente svuotando la cache.

### Svuotare Cache (Forzare Aggiornamento)

Per vedere subito le modifiche:

1. Apri il sito
2. DevTools > Application > Local Storage
3. Cancella `denif-products-cache`
4. Ricarica la pagina

## 🛒 Flusso Ordine

### Opzione 1: WhatsApp (Più Semplice)

L'utente:
1. Sfoglia il catalogo
2. Aggiunge prodotti al carrello
3. Clicca "Procedi al Checkout"
4. Viene reindirizzato a WhatsApp con un messaggio precompilato
5. Tu ricevi l'ordine e gestisci il pagamento

**Vantaggi**: Zero commissioni, gestione diretta

### Opzione 2: Stripe (Richiede Backend)

Richiede l'implementazione di:
- API endpoint per creare Checkout Session
- Webhook per confermare ordini
- Gestione stati ordini nel database

## 📊 Analytics (Opzionale)

Per integrare analytics gratuiti:

### Vercel Analytics

```bash
npm install @astrojs/vercel
npx astro add vercel
```

### Plausible (Privacy-friendly)

```bash
npm install @astrojs/plausible
npx astro add plausible
```

## 🔧 Troubleshooting

### Il catalogo non si carica

- Controlla le credenziali AirTable nel `.env`
- Verifica che il nome tabella corrisponda
- Controlla la console per errori API

### Immagini non appaiono

- Su AirTable, verifica che le immagini siano pubbliche
- Le attachment AirTable dovrebbero essere accessibili pubblicamente

### PWA non si installa

- Verifica che le icone esistano in `public/icons/`
- Controlla che il manifest sia servito correttamente
- Testa su HTTPS (locale funziona con localhost)

### Il carrello è vuoto dopo refresh

- È normale! Il carrello usa localStorage e persiste tra le sessioni
- Se vuoi svuotarlo, cancella `denif-cart` dal LocalStorage

## 📝 TODO / Miglioramenti Futuri

- [ ] Generare icone PWA
- [ ] Integrazione Stripe completa
- [ ] Pagina "Carrello" dedicata
- [ ] Filtri avanzati (prezzo, colore)
- [ ] Pagamenti gestiti interamente online
- [ ] Recensioni prodotti
- [ ] Lista desideri
- [ ] Multi-lingua (EN/IT)

## 🧞 Comandi

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📞 Supporto

Per domande sull'artigianato o sui prodotti:
- WhatsApp: +39 XXX XXX XXXX (da configurare)
- Email: info@denif.it

---

**Realizzato con ❤️ usando Astro, Tailwind CSS e molto caffè.**
