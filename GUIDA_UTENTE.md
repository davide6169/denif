# 👞 DENIF - Guida Utente Demo

Benvenuto nella demo interattiva di DENIF, un e-commerce di scarpe fatte a mano con passione in Italia.

## 🌟 Cos'è Questa Demo

Questa è una **demo completa funzionante** che ti permette di vivere l'esperienza completa di acquisto su un e-commerce di scarpe artigianali italiane.

**Cosa puoi fare:**
- 🛍️ Esplorare un catalogo di 10+ modelli di scarpe artigianali
- 🛒 Aggiungere prodotti al carrello e gestire le quantità
- 💳 Completare un checkout realistico con form validato
- 📦 Ricevere conferma ordine con tutti i dettagli
- 📋 Consultare lo storico di tutti i tuoi ordini

---

## 🚀 Come Avviare la Demo

### Opzione A: Dal Codice Sorgente

Se hai il codice sorgente:

```bash
# 1. Installa le dipendenze (solo la prima volta)
npm install

# 2. Avvia la demo
npm run dev

# 3. Apri il browser su:
# http://localhost:4322
```

### Opzione B: Da File Standalone (.zip)

Se hai ricevuto il file `denif-demo.zip`:

1. **Estrai lo zip** in una cartella
2. **Apri la cartella `dist`**
3. **Fai doppio click su `index.html`**
4. Oppure trascina `index.html` nel tuo browser preferito

✅ **Non serve alcun server!** Funziona completamente offline.

---

## 📖 Guida Passo Passo

### 1. Esplora il Catalogo

La homepage ti accoglie con il brand DENIF. Clicca su **"Catalogo"** nel menu per vedere tutti i prodotti disponibili.

**Prodotti disponibili:**
- Décolleté Classica in Pelle - €280
- Sandalo Artigianale - €240
- Mocassino in Pelle Scamosciata - €320
- Stivaletto Invernale - €380
- Francesina Classica - €350
- Sneaker in Pelle e Canvas - €220
- ...e altri ancora!

**Funzionalità del catalogo:**
- 🔍 **Filtra per categoria** (Décolleté, Sandali, Mocassini, ecc.)
- 📏 **Filtra per taglia** (36-45)
- 🔎 **Cerca per nome** o descrizione

### 2. Aggiungi al Carrello

1. **Scegli un prodotto** che ti piace
2. **Seleziona la taglia** desiderata
3. **Clicca "Aggiungi al Carrello"**
4. Il carrello si aprirà automaticamente!

**Gestione del carrello:**
- ➕ **Aumenta quantità**: Clicca il tasto `+`
- ➖ **Diminuisci quantità**: Clicca il tasto `-`
- 🗑️ **Rimuovi prodotto**: Porta la quantità a 0
- 💰 **Vedi il totale**: Aggiornato in tempo reale

### 3. Procedi al Checkout

Quando sei pronto:

1. Clicca **"Procedi al Checkout"** nel carrello
2. Compila il form con i tuoi dati:

```
┌─────────────────────────────────────┐
│  Informazioni di Spedizione         │
├─────────────────────────────────────┤
│  Nome *              [Mario        ]│
│  Cognome *           [Rossi        ]│
│  Email *             [mario@email.it]│
│  Telefono *          [3123456789   ]│
│  Indirizzo *         [Via Roma 123 ]│
│  Città *             [Roma         ]│
│  CAP *               [00100        ]│
│  Paese *             [Italia       ]│
│  Note (opzionale)    [...          ]│
└─────────────────────────────────────┘
```

**Validazione in tempo reale:**
- ✅ Se un campo non è valido, vedrai l'errore immediatamente
- ✅ Il bordo diventa rosso
- � Un messaggio ti spiega cosa correggere

**Esempi di input validi:**
- Email: `mario.rossi@email.it` o `test@esempio.it`
- Telefono: `3123456789` (deve iniziare con 3, 10 cifre)
- CAP: `00100` (5 cifre)

### 4. Scegli il Metodo di Pagamento

Tre opzioni disponibili:

| Metodo | Descrizione |
|--------|-------------|
| 💳 **Carta di Credito/Debito** | Visa, Mastercard, Amex |
| 🔵 **PayPal** | Paga in sicurezza con PayPal |
| 🏦 **Bonifico Bancario** | Ordine confermato dopo pagamento |

### 5. Completa l'Ordine

1. Clicca **"Completa Ordine"**
2. Attendi **2-3 secondi** per l'elaborazione
3. Vedrai uno spinner di caricamento
4. **90% di successo** - L'ordine va a buon fine!
5. **10% di fallimento** - Simulatione di errore (riprova!)

**Se il pagamento ha successo:**
- 🎉 Verrai reindirizzato alla pagina di conferma
- 📧 Vedrai un riepilogo completo dell'ordine
- 📦 Riceverai una data di consegna stimata (3-5 giorni)
- 🔖 Un ID ordine unico (es: ORD-2024-17082345AB)

### 6. Consulta i Tuoi Ordini

Per vedere tutti i tuoi ordini:

1. Clicca su **"I Miei Ordini"** nel menu (in alto o nel footer)
2. Vedrai una lista di tutti gli ordini effettuati
3. Clicca su un ordine per vedere i dettagli completi

**Informazioni disponibili per ogni ordine:**
- 🔖 Numero ordine
- 📅 Data e ora
- ✅ Stato (Confermato, In elaborazione, Spedito, Consegnato)
- 👟 Prodotti acquistati con immagini
- 💰 Totale pagato
- 📚 Data di consegna stimata
- 💳 Metodo di pagamento e ID transazione

---

## 🎯 Scenari di Esempio

### Scenario 1: Primo Acquisto

```
1. Vai al Catalogo
2. Scegli "Décolleté Classica in Pelle"
3. Seleziona taglia 38
4. Clicca "Aggiungi al Carrello"
5. Clicca "Procedi al Checkout"
6. Compila il form:
   - Nome: Maria
   - Cognome: Bianchi
   - Email: maria.bianchi@email.it
   - Telefono: 3331234567
   - Indirizzo: Via Milano 10
   - Città: Milano
   - CAP: 20100
   - Paese: Italia
7. Seleziona "Carta di Credito"
8. Clicca "Completa Ordine"
9. Attendi 2-3 secondi
10. Guarda la conferma! 🎉
```

### Scenario 2: Spedizione Gratuita

```
1. Aggiungi al carrello:
   - Mocassino in Pelle Scamosciata (€320)
   - Sneaker in Pelle (€220)
   - Totale: €540
2. Nota la scritta "Spedizione: Gratis" ✅
3. Completa l'ordine
4. Verifica che il totale sia €540 (nessuna spedizione aggiunta)
```

### Scenario 3: Più Ordini

```
1. Completa il primo ordine
2. Torna al Catalogo
3. Aggiungi altri prodotti
4. Completa il secondo ordine
5. Vai su "I Miei Ordini"
6. Vedi entrambi gli ordini nella lista! 📋
```

---

## ⚠️ Importante: È Una Demo!

### ❌ Cosa NON succede davvero:

- **Nessun pagamento reale** - Non viene addebitato nulla
- **Nessuna email inviata** - La conferma è solo sullo schermo
- **Nessuna spedizione reale** - Le scarpe non verranno spedite
- **Nessun server** - Tutto funziona nel tuo browser

### ✅ Cosa succede davvero:

- **Simulazione completa** del checkout reale
- **Validazione dei form** in tempo reale
- **Creazione di ordini** con ID univoci
- **Calcolo corretto** dei totali e spedizione
- **Persistenza dati** nel tuo browser (localStorage)

---

## 💾 I Tuoi Dati Sono Sicuri

**Dove sono salvati?**
- Nel tuo browser (localStorage)
- Non vengono inviati a nessun server
- Non vengono condivisi con terze parti

**Possono essere persi?**
- Sì, se cancelli la cache del browser
- Basta non cancellare i dati del sito

**Come pulire tutto?**
```javascript
// Apri la console del browser (F12) e scrivi:
localStorage.clear();
location.reload();
```

---

## 📱 Compatibilità

### ✅ Funziona con:

- **Desktop**: Chrome, Firefox, Safari, Edge
- **Tablet**: iPad, Android tablet
- **Smartphone**: iPhone, Android

### ❌ Non funziona con:

- Internet Explorer (non supportato)
- Browser molto vecchi
- JavaScript disabilitato

---

## 🐤 Risoluzione Problemi

### Il carrello sembra vuoto

**Soluzione:**
- Aggiungi prodotti dal catalogo
- Non aver cancellato la cache del browser

### Non riesco a completare l'ordine

**Soluzione:**
- Compila tutti i campi obbligatori (contrassegnati da *)
- Verifica che l'email sia valida (deve contenere @)
- Verifica che il telefono inizi con 3 e abbia 10 cifre
- Il CAP deve essere 5 cifre (es: 00100)

### La pagina rimane bianca

**Soluzione:**
- Assicurati di aver avviato `npm run dev`
- Prova con un browser diverso
- Apri la console (F12) per vedere errori

### Non vedo i miei ordini

**Soluzione:**
- Devi aver completato almeno un ordine con successo
- Non aver cancellato la cache del browser
- Controlla in "I Miei Ordini" nel menu

---

## 🎨 Design e Brand

**DENIF** significa:
- **Artigianato italiano** - Ogni scarpa è fatta a mano
- **Qualità premium** - Pelle italiana, cuciture tradizionali
- **Stile senza tempo** - Classici che non passano mai di moda

**My Hands. Your Steps.**
*Scarpe fatte a mano con passione*

---

## 📊 Statistiche Demo

| Elemento | Quantità |
|----------|----------|
| Prodotti nel catalogo | 10 |
| Categorie | 7 |
| Taglie disponibili | 36-45 |
| Metodi di pagamento | 3 |
| Tempo di elaborazione | 2-3 secondi |
| Tasso di successo pagamento | 90% |
| Spedizione gratuita | Oltre €200 |

---

## 🔗 Link Utili

- **Home**: `/`
- **Catalogo**: `/catalogo`
- **Chi Sono**: `/chi-sono`
- **Checkout**: `/checkout` (con prodotti nel carrello)
- **I Miei Ordini**: `/ordini`

---

## ✅ Checklist Veloce

Prima di fare una demo o presentazione:

- [ ] Homepage si carica correttamente
- [ ] Catalogo mostra tutti i prodotti
- [ ] Filtri funzionano
- [ ] Carrello si apre e chiude
- [ ] Aggiunta al carrello funziona
- [ ] Checkout è accessibile
- [ ] Validazione form funziona
- [ ] Pagamento va a buon fine (normalmente)
- [ ] Conferma ordine si vede
- [ ] Storico ordini funziona
- [ ] Tutto funziona su mobile

---

## 🎉 Buon Divertimento!

Questa demo è stata creata per mostrare come può essere semplice e piacevole fare shopping online di scarpe artigianali italiane.

**Esplora, prova, sperimenta!**

Non c'è modo di "sbagliare" - è solo una demo!

---

## 📞 Contatti (Demo)

- 📱 WhatsApp: +39 XXX XXX XXXX (numero di esempio)
- 📧 Email: info@denif.it (email di esempio)

---

**Creato con ❤️ per mostrare il meglio dell'e-commerce italiano**

*My Hands. Your Steps. DENIF*
