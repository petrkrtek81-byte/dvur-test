# Krušnohorský Dvůr – návrh nového webu

**Návrh redesignu** webu hotelu a restaurace Krušnohorský Dvůr (Cínovec, https://krusnohorskydvur.cz/).
Stejný styl a stejná stavba jako redesign Golf Club Teplice – jen bez videí, místo nich fotky.
Stránky mají `<meta name="robots" content="noindex">` a v patičce poznámku „Návrh redesignu“.

Web má deset stránek (úvod + Ubytování, Restaurace, Ceník a balíčky, Sauna, Svatby a akce, Okolí,
Aktuality, Fotogalerie, Kontakty), funguje česky i německy (přepínač CZ/DE) a nepotřebuje databázi ani PHP.

## Struktura

| Soubor / složka | Co obsahuje |
|---|---|
| `index.html`, `ubytovani.html`, `restaurace.html`… | hotové stránky (vygenerované ze šablon – needitovat ručně) |
| `sablony/` | šablony: `_hlava.html`, `_lista.html` (hlavička a menu), `_pata.html` (patička, dialogy), obsah každé stránky |
| `nastroje/sestav-web.js` | složí stránky ze šablon, doplní titulky (CZ i DE) a `sitemap.xml` |
| `nastroje/zpracuj-fotky.js` | zmenší vybrané fotky z podkladů na max. 1920 px a udělá náhledy 800 px (potřebuje ffmpeg) |
| `nastroje/webp.js` | ke každé fotce a náhledu vytvoří menší kopii WebP (spustit po `zpracuj-fotky.js`, potřebuje ffmpeg s libwebp); stránky ji při sestavení nabídnou přes `<picture>`, JPEG zůstává jako záloha |
| `REDESIGN/` | redesign bez „AI“ vzhledu: inventura, diagnóza, design systém (barvy, písmo, mezery jako CSS proměnné v `web.css`) a shrnutí |
| `nastroje/server.js` | jednoduchý server pro náhled na počítači (`node nastroje/server.js` → http://localhost:5530) |
| `assets/css/web.css`, `assets/js/web.js` | styly a skript (vychází z golfu; videa, jamky, turnaje a partneři odstraněni) |
| `assets/img/`, `assets/img/thumbs/` | fotky (max. 1920 px) a náhledy (800 px) |
| `assets/menu/` | jídelní a nápojový lístek 2026 jako obrázky (převzaté z webu hotelu) |
| `assets/logo.png`, `assets/logo-bila.png` | logo hotelu s průhledným pozadím (tmavé a bílé) |
| `data/obsah.json` | aktuality (CZ + DE) a seznam fotek fotogalerie s popisky (CZ + DE) |
| `podklady/` | pracovní podklady (fotky pokojů, logo…) – nejsou v gitu |

## Úpravy

Texty stránek se upravují v šablonách ve složce `sablony/` a stránky se pak složí příkazem:

```
node nastroje/sestav-web.js
```

- **Němčina:** každý text v šabloně má německý překlad hned vedle v atributu `data-de` (u fotek `data-alt-de`).
  Krátké texty ze skriptu jsou ve slovníku `DE` na začátku `assets/js/web.js` (klíčem je český text).
- **Titulky a popisy stránek** (CZ i DE) a úvodní fotky stránek – seznam `PAGES` v `nastroje/sestav-web.js`.
- **Aktuality a fotogalerie** – `data/obsah.json` (u aktuality `de` = německá verze; fotka = název souboru v `assets/img` bez `.jpg`).
- **Jídelní lístek** – `sablony/restaurace.html` (sekce „Jídelní lístek 2026“), obrázky lístků v `assets/menu/`.
- **Rezervace** – tlačítka „Rezervovat pobyt“ vedou do rezervačního systému Previo (stejný jako na současném webu),
  adresa je v `BOOKING` / `BOOKING_DE` v `nastroje/sestav-web.js`.
- **Poptávkový formulář** (Kontakty) nic neodesílá přes web – připraví e-mail na info@krusnohorskydvur.cz
  v poštovním programu návštěvníka. Funguje proto i na GitHub Pages. Odkaz `kontakty.html?poptavka=romanticky`
  předvyplní druh poptávky.
- Odkaz `#cenik`, `#sauna`… v šabloně se při sestavení sám změní na `cenik.html`, `sauna.html`…

## Odkud je obsah

Texty, ceny, otevírací doba a kontakty jsou převzaté z krusnohorskydvur.cz (stav 11/2026):
O nás, Ubytování a detaily pokojů, Restaurace (+ jídelní lístek 2026 přepsaný z obrázku, česky i německy),
Pobytové balíčky, Aktivity, Aktuality, Kontakty a storno podmínky z rezervačního systému Previo.
Ceny pokojů web hotelu neuvádí (jsou podle sezóny v systému Previo), proto stránka Ceník odkazuje na on-line rezervaci.
Fotky jsou z fotogalerie a podstránek krusnohorskydvur.cz a z Instagramu @krusnohorskydvur (bez detailů lidí, plakátů a textů).

## Před spuštěním ověřit u hotelu

- Romantický balíček: na přehledu balíčků je „láhev sektu na pokoj“, na detailu balíčku „dvě hodiny v sauně“ – web teď uvádí sekt.
- DIČ provozovatele hotelu: současný web uvádí u GREEN hotel s.r.o. stejné DIČ jako u restaurace (CZ14106892) – na novém webu je u hotelu jen IČO.
- Souhlas s použitím fotek z Instagramu, kontrola německých textů rodilým mluvčím a zásad ochrany osobních údajů.
- Po spuštění: odstranit `noindex` (šablona `_hlava.html`, `.htaccess`), upravit `robots.txt`, smazat poznámku „Návrh redesignu“ v patičce.

## Nasazení

Na GitHub Pages stačí nahrát obsah repozitáře (`.nojekyll` je přiložený). Na hostingu s Apache
se použije i `.htaccess` (HTTPS, přesměrování starých adres `/ubytovani`, `/aktivity`, `index.php?mutace=de`…).
