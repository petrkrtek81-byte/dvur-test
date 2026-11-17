# Inventura webu Krušnohorský Dvůr (stav před redesignem)

Tag `pred-redesignem-2026-11-17`, commit `d3127de`. Tento seznam je závazný: po redesignu musí všechno existovat a fungovat.
Doslovné texty, odkazy, obrázky a formulářové prvky každé stránky (CZ i DE) jsou v `REDESIGN/pred/texty/*.txt`.
Celostránkové screenshoty (desktop 1440 px v polovičním měřítku, mobil 390 px) jsou v `REDESIGN/pred/screenshoty/`.

## 1. Technologie

- **Statický web** bez frameworku a bez knihoven. HTML se skládá ze šablon skriptem `nastroje/sestav-web.js` (Node, bez závislostí).
- **CSS:** jeden soubor `assets/css/web.css` (~1 130 řádků), vlastní proměnné v `:root`, bez Tailwindu/Bootstrapu.
- **JS:** jeden soubor `assets/js/web.js` (vanilla JS, async IIFE).
- **Písma:** uložená na webu (`assets/fonts/`): Baloo 2 (nadpisy, čísla, popisky) a Manrope (text). `font-display: swap`.
- **Ikony:** vlastní SVG sprite v `_lista.html` (~55 obrysových ikon, tah 1,7) + vlajky CZ/DE.
- **Obsah z dat:** `data/obsah.json` – aktuality (10, CZ + DE) a fotogalerie (107 fotek, popisky CZ + DE).
- **Fotky:** `assets/img/*.jpg` (max. 1920 px) a `assets/img/thumbs/*.jpg` (800 px); vyrábí `nastroje/zpracuj-fotky.js`.
- **Hosting:** GitHub Pages (repo `dvur-test`, větev `main`), `.nojekyll`; pro Apache `.htaccess`.
- **Náhled:** `nastroje/server.js` (port 5530), `.claude/launch.json`.

## 2. Stránky (10) a jejich sekce

Každá podstránka má úvodní pás: fotka, drobečková navigace „Úvod / název“, H1 a perex (CZ + DE z `PAGES` v `sestav-web.js`).

### index.html – Úvod
1. **Hero** přes celou obrazovku: slider 5 fotek (prolínání + pomalý zoom), popisek fotky, 5 „teček“ s průběhem, eyebrow „Hotel & restaurace · Cínovec · 865 m n. m.“, H1 „Horský hotel / *v Krušných horách.*“, podnadpis rozdělený na slova, tlačítka „Rezervovat pobyt“ (Previo) a „Jídelní lístek“ (→ restaurace.html#jidelni-listek), stav restaurace (otevřeno do 22:00 / otevírá v 11:00), odkaz „Objevte“ (scroll).
2. **Rozcestník** – 8 řádků se šipkou: Ubytování a pokoje, Restaurace a jídelní lístek, Rezervace pobytu on-line (externí), Ceník a pobytové balíčky, Finská sauna, Svatby, oslavy a firemní akce, Okolí: běžky, kolo, golf, Fotogalerie; pod tím Aktuality · Kontakty a mapa.
3. **Příběh** – 3 fotopanely přes celou obrazovku, které se při scrollu překrývají: „865 metrů / nad mořem.“, „Večer / u krbu.“, „Ráno / na běžky.“
4. **Tmavá sekce** „Jeden dům. / Pro každého.“ – 3 sloupce (Na víkend / Na oběd i večeři / Na oslavu, každý s citací, textem a odkazem) + 4 čísla s animací: 8 pokojů ve 4 kategoriích, 24 lůžek, 865 m nad mořem, od 2011 nová budova hotelu.
5. **Aktuality** – 3 nejnovější z `obsah.json` + tlačítko „Všechny aktuality“; detail v dialogu.
6. **Závěr** „Kdy k nám / přijedete?“ – text o on-line rezervaci, tlačítka Rezervovat on-line + Zavolat, box Otevírací doba (stav otevřeno/zavřeno, restaurace po–ne 11–22, snídaně 8–10, check-in od 14, check-out do 10).

### ubytovani.html – Ubytování
1. Úvod: H2 „Nově zařízené pokoje / za příznivé ceny“, 3 odstavce (8 pokojů, 24 lůžek, 7 dvoulůžkových + 1 rodinný, dětská postýlka, vybavení, budova 2011, biatlonová reprezentace), box „Váš pobyt“ (check-in, check-out, snídaně, snídaňový balíček), koláž 2 fotek + otáčející se kruhový odznak „8 POKOJŮ • 24 LŮŽEK…“ / 865 m.
2. Nabídka pokojů (#pokoje): 4 karty (Standardní, Komfortní, Exklusivní, Rodinný) – fotka s počtem fotek (otevře prohlížeč se 6/8/10/5 fotkami), štítek typu, popis, 3 vlastnosti; tlačítko „Volné termíny a ceny“ (Previo).
3. Pás s fotkou „V ceně je / bohatá snídaně“ + Ceník a balíčky, O restauraci.
4. Tmavá karta „Na přání vám zajistíme“ – fotka, text, 6 služeb (Tereziny lázně/Teplice, Raupennest, bobová dráha, lyže Bouřňák, úschova kol, snídaňový balíček), tlačítko Tipy na výlety.

### restaurace.html – Restaurace
1. Úvod: H2 „Útulná restaurace / s hořícím krbem“, 3 odstavce, box Otevírací doba (stav, po–ne 11–22, snídaně 8–10), tlačítka Rezervovat stůl (tel.) + Poslat poptávku (→ kontakty.html?poptavka=restaurace#poptavka), koláž + kruhový odznak „denně 11–22“.
2. **Jídelní lístek 2026** (#jidelni-listek, tmavá sekce): Polévky (3), Předkrmy (2), České speciality (4), Doporučujeme (9), Dezerty (3) – název, gramáž, cena; CZ i DE názvy; tlačítka „Lístek jako obrázek“ a „Nápojový lístek“ (assets/menu/*.jpg); poznámka o týdenních nabídkách.
3. „Z naší kuchyně“ – 8 fotek jídla (otevřou prohlížeč), odkaz Další fotky (→ fotogalerie.html?kat=jidlo).
4. Pás „Catering pro / každou příležitost“ + Svatby a akce, Pobytové balíčky.

### cenik.html – Ceník a balíčky
1. Tmavá sekce (#cenik, #balicky): H2 „Víkend / pro dva“, perex; 2 karty balíčků – Romantický (2 os., 1 noc, 3 990 Kč, 6 položek), Gurmánský (2 os., 2 noci, 5 990 Kč, 6 položek), tlačítka Poptat balíček (→ kontakty s předvyplněním); na mobilu posun do strany s nápovědou.
2. 4 doplňky: Check-in/out, Snídaně v ceně, Wi-Fi zdarma, Dětská postýlka.
3. Box Ceny ubytování (#ceny-ubytovani): text o sezónních cenách v Previo, tlačítko Ceník a rezervace on-line; Storno podmínky (7+ dní zdarma, méně než 7 dní 100 %); Další služby (golfová lekce 400 Kč, sauna – cena na recepci); poznámka o storno e-mailem a skupinách.
4. Poukazy (#poukazy): H2 „Poukaz / jako dárek“, text, 4 položky (restaurace, hotel, sauna, golf), tlačítka Objednat poukaz + e-mail, koláž + kruhový odznak „24 h“.

### sauna.html – Sauna
1. Úvod: H2 „Sauna / v horách“, 3 odstavce, box Finská sauna (kapacita 1–4, pro koho, rezervace, ceny), tlačítka Rezervovat saunu (tel.) + Napsat e-mail, koláž + kruhový odznak „pro 1–4“.
2. Fotky: 4 fotky sauny (prohlížeč).
3. Pás „Dvě hodiny v sauně / v gurmánském balíčku“ + Pobytové balíčky, Zima na Cínovci.

### svatby-a-akce.html – Svatby a akce
1. H2 „Místo pro / vaši akci“, perex; 3 karty – Svatby, Firemní akce (zvýrazněná, štítek Teambuilding), Oslavy – každá se 4 body a tlačítkem poptávky.
2. Tmavá sekce „Slavnostně prostřeno – / uvnitř i venku“: 8 fotek (prohlížeč) + Další fotky (→ fotogalerie.html?kat=akce).
3. Tmavá karta Konferenční sál – fotka, text, 6 vlastností, e-mail.
4. Závěr „Co budeme / slavit?“ – text, Poslat poptávku + telefon, fotka.

### okoli.html – Okolí
1. H2 „Ideální / nástupní bod“, perex; 5 fotodlaždic s odkazem na kotvy (Běžky, Kolo, Golf, Výlety, Koupání).
2. **Zima** (#zima, noční modrá + padající sníh): text o tratích, odkazy Mapa tras (PDF na krusnohorskydvur.cz) a Po běžkách do sauny, 2 fotky, 3 dlaždice (Skiareál Altenberg, Bouřňák, Na sníh), poznámka.
3. **Kolo** (#kolo): 2 odstavce, 3 štítky (Cyklisté vítáni, úschova kol, křižovatka cyklotras), odkaz Cyklotoulky (ČT), koláž.
4. **Golf** (#golf): tmavá karta – fotka, 2 odstavce, 2 vlastnosti, Rezervovat lekci (golf@golf-teplice.cz) + Golf Club Teplice (web).
5. **Výlety** (#vylety): 8 karet s ikonou (Raupennest, bobová dráha, lanový park, Wildpark Geising, Hochmoor, vodopád Tiefenbach, Pramenáč, Kahleberg), u 5 externí odkaz.
6. **Koupání** (#koupani): koláž + 2 boxy (Dlouhý rybník, Malý Galgenteich).

### aktuality.html – Aktuality
- H2 „Novinky a / zajímavosti“, tlačítka Facebook + Instagram; 10 aktualit z `obsah.json` (první velká), 6 viditelných + „Zobrazit starší aktuality (4)“; detail v dialogu (fotka, štítek, datum, text s odkazy, tlačítko akce).

### fotogalerie.html – Fotogalerie
- H2 „Krušnohorský dvůr / objektivem“, 9 filtrů (Vše, Hotel a terasa, Pokoje, Restaurace, Jídlo, Svatby a akce, Sauna, Okolí v létě, Okolí v zimě), 107 fotek v mřížce (načítání s efektem), popisky při najetí, prohlížeč se šipkami/klávesnicí/swipe; `?kat=` předvybere kategorii; na mobilu nejdřív 12 fotek + „Zobrazit všechny fotky“.

### kontakty.html – Kontakty
- H2 „Těšíme se / na vás“; 4 kontaktní položky (adresa → Google Maps, telefon, e-mail, otevírací doba + check-in/out); mapa Google až po kliknutí „Zobrazit mapu“ + Navigovat; Jak k nám (z Teplic, z Drážďan).
- Formulář „Nezávazná poptávka“ (#poptavka): výběr (8 možností), jméno (povinné), telefon, termín, počet osob, zpráva → připraví e-mail na info@krusnohorskydvur.cz; potvrzení „Skoro hotovo!“ + Nová poptávka; `?poptavka=` předvyplní výběr.
- Najdete nás také: Previo, Booking.com, Tripadvisor, Facebook, Instagram, YouTube, Webkamera; Provozovatelé (GREEN hotel s.r.o. IČO 17855004; GREEN gastro s.r.o. IČO 14106892, DIČ CZ14106892; adresa).

## 3. Společné prvky (všechny stránky)

- **Hlavička:** logo (bílé, → úvod), přepínač CZ/DE (vlajky), zlaté tlačítko Rezervovat pobyt (Previo, v DE `lang=de`), tlačítko Menu; po scrollu rozmazané tmavé pozadí; tenká linka průběhu scrollu; „Přeskočit na obsah“.
- **Menu přes celou obrazovku:** 9 odkazů s čísly 01–09 (aktuální stránka zvýrazněná), Rezervovat pobyt on-line, telefon, e-mail, „Restaurace denně 11–22 h“, Facebook, Instagram, Google Maps; zavření Esc/klikem; animace kruhového odhalení.
- **Patička:** logo, popis, provozovatelé (IČO), sociální sítě (FB, IG, YouTube, Maps); sloupce Hotel (Ubytování, Ceník a balíčky, Sauna, Svatby a akce, Rezervace on-line), Více (Restaurace, Okolí, Aktuality, Fotogalerie, Kontakty), Kontakt (adresa, telefon, e-mail, otevírací doba); velký průsvitný nápis „Krušnohorský Dvůr“; © rok, Ochrana osobních údajů (dialog CZ/DE), štítek „Návrh redesignu – nejde o oficiální web hotelu“, přepínač CZ/DE, Nahoru.
- **Mobilní lišta** (po odscrollování): telefon + Rezervovat pobyt.
- **Dialogy:** detail aktuality, prohlížeč fotek (počítadlo, popisek, šipky, klávesy, swipe, předčítání sousedních fotek), ochrana osobních údajů.
- **Toasty** (oznámení), obecný mechanismus.

## 4. Funkce v JS

- Jazyk CZ/DE: `data-de`, `data-alt-de`, slovník `DE`, `t()`; titulek a popis stránky; odkazy s DE variantou (`data-href-de`); `?lang=de` v adrese i v interních odkazech; volba v `localStorage` (`kd-lang`); stránka v DE se ukáže až přeložená (`lang-pending`).
- Hero slider (6,5 s, tečky s průběhem, popisky CZ/DE, pauza ve skryté kartě), podnadpis rozdělený na slova.
- Stav restaurace podle času v Praze (každou minutu): hero, boxy otevírací doby.
- Hlavička při scrollu, linka průběhu, mobilní lišta, parallax obsahu hero a vrstev `data-parallax`.
- Scroll reveal (`.reveal`), animace čísel (`data-count`).
- Aktuality (karty, starší, detail, CTA s jazykem), fotogalerie (filtry, limit na mobilu, `?kat=`), prohlížeč fotek pro galerii, pokoje (`data-photos`) a skupiny fotek (`data-photo-group`).
- Sněžení (canvas) v zimní sekci.
- Poptávka přes `mailto:` s validací jména a hláškami CZ/DE.
- Mapa Google po kliknutí (jazyk mapy podle webu).
- `prefers-reduced-motion` vypíná animace.

## 5. SEO a meta

- `<title>` a `description` pro každou stránku (CZ, DE přes `data-title-de` / `data-desc-de`), `robots: noindex, nofollow`, canonical, Open Graph (title, description, image, url), hreflang cs/de/x-default, favicon, JSON-LD `Hotel` (adresa, telefon, e-mail, check-in/out, 8 pokojů, restaurace s otevírací dobou).
- `sitemap.xml`, `robots.txt` (Disallow – návrh), `.htaccess` (HTTPS, přesměrování starých adres, X-Robots-Tag noindex, cache).
- Analytika: žádná (záměrně).

## 6. Externí odkazy a integrace

Previo (rezervace CZ/DE), Booking.com, Tripadvisor, Facebook, Instagram, YouTube, webkamera ipcamlive, Google Maps (odkaz + iframe po souhlasu), golf-teplice.cz, golf@golf-teplice.cz, cyklotoulky.cz, raupennest.de, sommerrodelbahn-altenberg.de (+ kletterlabyrinth), wildpark-osterzgebirge.de, altenberg.de, PDF Loipenplan na krusnohorskydvur.cz, skilifte-geising.de (text), uoou.gov.cz.
