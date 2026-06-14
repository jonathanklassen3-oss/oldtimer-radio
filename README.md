# Oldtimer-Radio.de — moderne Retro-Website

Eine neu gestaltete Website für den Oldtimer-Autoradio-Service: klassischer
Retro-Look (warme Cremetöne, Vintage-Typografie, Chrom-Details, der Porsche 356
als Held), aber mit modernem Layout und spielerischen Features.

Reines **HTML / CSS / JavaScript** — kein Framework, keine Build-Tools.
Läuft per Doppelklick im Browser.

## Schnellstart

1. Ordner `oldtimer-radio` öffnen
2. `index.html` doppelklicken → öffnet sich im Standard-Browser (Safari)

> Tipp: Für saubere lokale Anzeige (z. B. Schriften-Caching) kann man auch einen
> kleinen Server starten:
> ```bash
> cd oldtimer-radio
> python3 -m http.server 8000
> ```
> Dann im Browser `http://localhost:8000` öffnen.

## Features

- **Tag-/Nacht-Modus** — Umschalter oben rechts. Tag = warmer 60er-Look mit Sonne
  und Wolken, Nacht = Drive-in-Stimmung mit Mond, Sternen und Neon-Akzenten.
  Die Wahl wird im Browser gemerkt (`localStorage`) und folgt anfangs der
  Systemeinstellung.
- **Auto-Szene im Hero** — die beiden Porsche fahren beim Laden herein und
  schweben sanft; beim Scrollen entsteht ein Parallax-Tiefeneffekt.
- **Showcase-Shop mit Warenkorb** — Produktkarten mit stilisiertem CSS-Autoradio,
  Kategorie-Filter, Warenkorb-Schublade, Mengen ändern und Demo-Checkout.
  Der Warenkorb bleibt über alle Seiten erhalten (`localStorage`).
- **Scroll-Animationen**, animierte Zähler und ein Lauftext-Band.
- **Responsive** inkl. mobilem Menü.
- **Demo-Formulare** (Kontakt + Newsletter) mit Bestätigung, ohne echten Versand.

## Seiten

| Datei                | Inhalt                                            |
|----------------------|---------------------------------------------------|
| `index.html`         | One-Pager-Startseite mit allen Sektionen          |
| `shop.html`          | Radio-Shop mit Filter und Warenkorb               |
| `restauration.html`  | Restaurations-Service, Ablauf und Pakete          |
| `ueber.html`         | Geschichte, Zeitleiste und Werte                  |
| `kontakt.html`       | Kontaktformular, Infos und Newsletter             |

## Aufbau

```
oldtimer-radio/
├── index.html · shop.html · restauration.html · ueber.html · kontakt.html
├── css/
│   └── style.css        Design-System + Tag/Nacht über CSS-Variablen
├── js/
│   ├── main.js          Produktdaten, Warenkorb, Theme, Animationen (alle Seiten)
│   └── shop.js          Filter + Produktgitter (nur Shop)
└── images/
    ├── porsche.png          freigestellter Porsche 356
    └── porsche-spiegel.png  gespiegelte Variante
```

### Wie der Tag/Nacht-Modus funktioniert
Alle Farben sind in `css/style.css` als **CSS-Variablen** definiert — einmal für
den Tag-Modus (`:root`) und einmal für den Nacht-Modus
(`html[data-theme="night"]`). Der Schalter ändert nur das `data-theme`-Attribut,
und die ganze Seite passt sich automatisch an.

### Produkte ändern
Alle Produkte stehen zentral oben in `js/main.js` im Array `PRODUCTS`
(Name, Marke, Preis, Kategorie, Beschreibung). Startseite und Shop bauen ihre
Karten daraus — eine Änderung dort wirkt überall.

## Hinweise

- Die Schriften (Bebas Neue, DM Sans, Pacifico, VT323) werden von Google Fonts
  geladen — dafür ist beim ersten Laden eine Internetverbindung nötig. Ohne
  Internet greifen saubere System-Schriften als Ersatz.
- Es ist ein **Demo-Shop**: Bestellungen und Formulare lösen keine echte
  Aktion aus. Für einen echten Shop bräuchte es ein Backend und einen
  Zahlungsanbieter.
