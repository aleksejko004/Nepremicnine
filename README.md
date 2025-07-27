# Ugibaj Ceno Nepremičnin - Igra

## Struktura projekta

```
nepremicnine/
├── index.html                  # Glavna stran projekta
├── scraped_nepremicnine.json  # Podatki o nepremičninah
└── igra/                       # Organizirana igra
    ├── index.html              # Glavni HTML
    ├── css/
    │   └── style.css           # Vsi stili
    ├── js/
    │   └── game.js             # Vsa JavaScript logika
    ├── images/                 # Slike za projekt
    └── data/                   # Mapa za prihodnje podatke
```

## Dostop

- **Glavna stran**: `http://localhost/nepremicnine/`
- **Igra**: `http://localhost/nepremicnine/igra/`

## Nove funkcionalnosti

### 🎨 Vizualne izboljšave
- Ozadje z sliko namesto gradientov
- Nova barvna shema z gradientnimi efekti
- Slike gredo čez celotno višino zaslona
- Prosojni efekti in zastiranje ozadja

### 🎮 Igrajka
- Gumbova "Višja/Nižja" sta zdaj v sredini desne slike
- Nova navigacija slik s "X od Y" formatom
- Gumbova za predhodno/naslednjo sliko
- Tipkovni bližnjici za lažje igranje

### ⌨️ Tipkovni bližnjici
- **↑ ali H**: Višja cena
- **↓ ali L**: Nižja cena  
- **← →**: Menjava slik
- **Enter**: Ponovni zagon (na koncu igre)

### 📱 Odzivnost
- Prilagodljiv dizajn za mobilne naprave
- Optimizirani gumbi in tekst za dotik
- Fleksibilni layout za različne velikosti zaslonov

## Tehnične lastnosti

- **Čist kod**: Ločeni HTML, CSS in JavaScript
- **Moderne tehnologije**: ES6+, CSS Grid, Flexbox
- **Optimizacija**: Filtriranje neveljavnih podatkov
- **Uporabniška izkušnja**: Gladke animacije in prehodi

## Podatki

Igra uporablja `scraped_nepremicnine.json` z naslednjimi informacijami:
- Naslov in lokacija nepremičnine
- Cena in površina
- Opis nepremičnine
- Galerija slik
- URL originalnega oglasa