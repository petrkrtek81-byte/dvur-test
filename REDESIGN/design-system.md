# Design systém Krušnohorský Dvůr – návrh (ke schválení)

## Směr

**Klidný horský hotel s dobrou kuchyní.** Web má působit jako práce menšího designového studia, ne jako šablona:
- velké skutečné fotky domu, krbu a krajiny;
- střídmá sebevědomá typografie;
- hodně prázdného místa;
- tenké linky a seznamy místo karet;
- jeden teplý akcent.

**Vztah ke golfu:** hotel stojí u golfového hřiště a jeho web vznikl ze stejných šablon. Navazuju proto na směr, který navrhlo golfové sezení (`golf-teplice-redesign/REDESIGN/design-system.md`, vzor raphaelfaschang.at), aby oba weby působily jako jedna rodina. Odlišnosti hotelu:
- hotel má **patkové logo** s kapitálkami, takže patková kurzíva v nadpisech na něj přirozeně navazuje;
- akcent je **bronzový**, podle jídelního lístku hotelu (tmavý podklad, bronzové nápisy);
- golf používá zlatou.

**Co si beru ze vzoru** (změřeno golfovým sezením):
- nadpisy v řezu 500 se záporným prostrkáním;
- druhý řádek nadpisu jako skutečná patková kurzíva;
- popisky velkými písmeny jen výjimečně;
- žádné karty se stínem;
- obsah dělí fotky přes celou šířku, světlé a tmavé pásy a prázdné místo.

---

## 1. Typografie

**Písma** (2 rodiny, uložené přímo na webu, `font-display: swap`, latin + latin-ext):
1. **Manrope** – nadpisy 500, text 400, popisky a tlačítka 600. Už na webu je.
2. **Instrument Serif Italic 400** – jen akcentní slova v nadpisech (`<em>`). Nahradí dopočítanou kurzívu.

Baloo 2 se přestane používat, řezy 700 a 800 také.

**Škála (px):** 12 · 14 · 16 · 18 · 22 · 28 · 36 · 48 · 64 · 88

| Token | Použití | Velikost | Řez | Řádkování | Prostrkání |
|---|---|---|---|---|---|
| `--fs-display` | H1 úvodu | clamp(48 → 88) | 500 | 1.0 | −0.045em |
| `--fs-h1` | H1 podstránek | clamp(44 → 64) | 500 | 1.04 | −0.04em |
| `--fs-h2` | nadpisy sekcí | clamp(32 → 48) | 500 | 1.08 | −0.035em |
| `--fs-h3` | pokoje, výlety, položky | clamp(22 → 28) | 500 | 1.15 | −0.02em |
| `--fs-lead` | perex | clamp(18 → 22) | 400 | 1.45 | −0.005em |
| `--fs-body` | text | 16 (mobil) / 17 (desktop) | 400 | 1.6 | 0 |
| `--fs-small` | poznámky, gramáže | 14 | 400 | 1.5 | 0 |
| `--fs-label` | popisky velkými písmeny | 12 | 600 | 1.3 | +0.14em |
| čísla a ceny | jídelní lístek, balíčky | 18–64 | 500 | 1 | −0.02em, `tabular-nums` |

**Pravidla:**
- Kurzívní akcent má nejvýš **jeden nadpis na stránce**: hero, případně závěr. Ostatní H2 jsou bez akcentu.
- Popisek velkými písmeny jen tam, kde nese informaci (kategorie jídla, typ pokoje, datum). Nadpisy už nebudou mít „čárkový“ popisek nad sebou.
- Šířka textu max. 65 znaků (`--measure: 38rem`).

## 2. Barvy (design tokeny)

| Token | HEX | Použití |
|---|---|---|
| `--c-bg` | #F5F2EC | pozadí (teplá lomená bílá) |
| `--c-sand` | #EBE5DA | střídavé světlé pásy |
| `--c-ink` | #1A211D | text a nadpisy (kontrast ~15:1) |
| `--c-muted` | #545C55 | vedlejší text (~6,5:1) |
| `--c-line` | rgba(26,33,29,.14) | linky a oddělovače |
| `--c-forest` | #16241C | tmavé sekce, patička, menu (smrková téměř černá) |
| `--c-forest-2` | #22352A | jemný rozdíl v tmavých plochách |
| `--c-on-dark` | #F5F2EC | text na tmavé (~14:1) |
| `--c-muted-dark` | #A8B0A6 | vedlejší text na tmavé (~7:1) |
| `--c-bronze` | #B8925E | **jediný akcent**: hlavní tlačítko (tmavý text, ~6,5:1), kurzíva a ceny na tmavé (~6:1) |
| `--c-link` | #6B4F2A | textové odkazy na světlé (~7:1) |
| `--c-danger` | #9C3B31 | jen chyby formuláře a „zavřeno“ |

- Bronz se na světlém pozadí nikdy nepoužije jako barva textu, má jen ~2,5:1.
- Zelená tráva (`--grass`), ledová a noční modrá a zelená „živá“ tečka končí. Zimní sekce bude tmavá smrková se sněhem.
- V CSS nejsou žádné jiné barvy mimo tokeny. Výjimka: překryvy fotek přes `rgba` z `--c-forest`.

## 3. Mezery a rytmus

- **Základ 8 px:** `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 24 · `--s-6` 32 · `--s-7` 48 · `--s-8` 64 · `--s-9` 96 · `--s-10` 128 · `--s-11` 160.
- **Sekce:** hlavní 128–160 px na desktopu, doplňkové 96 px, na mobilu 64–80 px. Střídá se velká a menší mezera a na každé stránce je jeden výrazný moment (fotka přes celou šířku nebo tmavý pás).
- **Okraje:** 24 px mobil, 48 px desktop.

## 4. Mřížka a šířky

- **Šířky:** obsah max. 1240 px, galerie a fotky „wide“ 1440 px, fotopanely přes celou šířku.
- **Mřížka:** 12 sloupců s mezerou 24 px, na mobilu 4 sloupce.
- **Typické kompozice** místo opakované koláže s odznakem:
  - **nadpis vlevo (5 sloupců), text vpravo (7 sloupců)** – úvody stránek;
  - **velká fotka 7 sloupců + text 5 sloupců**, strany se střídají – pokoje (4 řádky místo 4 karet);
  - **číslovaný seznam s linkami** (01–08) ve dvou sloupcích – výlety, služby recepce, rozcestník;
  - **tabulka s linkami** – jídelní lístek (už je), balíčky (položky a cena v řádcích), storno, otevírací doba, kontakty („popisek → údaj“);
  - **jedna velká fotka přes celou šířku** jako předěl.

## 5. Komponenty

**Tlačítka** (výška 48 px):
- **primární:** bronzová výplň a tmavý text. Na obrazovce nejvýš jedno (rezervace).
- **sekundární:** obrys 1 px (ink na světlé, papír na tmavé).
- **textový odkaz se šipkou:** podtržení s odsazením, šipka se při najetí posune o 4 px.
- **stavy:**
  - hover: o stupeň tmavší, 200 ms;
  - focus-visible: obrys 2 px bronz s odsazením 3 px;
  - active: posun o 1 px;
  - disabled: průhlednost 0,4.
- **Zaoblení:** tlačítka pilulková (jediná pilulka na webu); bez lesku a záře.

**Hlavička:**
- logo vlevo; vpravo text „CZ / DE“ (bez vlajek), malé primární „Rezervovat“ a obrysové „Menu“;
- po scrollu plné pozadí `--c-bg`, tmavé logo a linka dole, bez rozmazání.

**Menu:** celoobrazovkové, tmavé, velké odkazy Manrope 500 (40–56 px) s malým číslem. Objeví se rychlým prolnutím (200 ms), ne kruhem.

**Hero úvodu:**
- fotka (slider zůstává, bez zoomu), nadpis, jedna věta, **jedno** primární tlačítko;
- „Jídelní lístek“ jako textový odkaz;
- stav restaurace jako prostý text dole.

**Pokoje:** 4 řádky „fotka + text“, typ pokoje jako popisek, vlastnosti jako prostý seznam oddělený tečkami. Tlačítko „6 fotek“ zůstane, jako textový odkaz pod fotkou.

**Balíčky:** dva sloupce oddělené svislou linkou, cena velkým číslem, položky jako seznam s linkami. Bez karet a záře.

**Formuláře:**
- popisek nad polem, pole 48 px, rámeček 1 px a zaoblení `--radius`;
- chyba = červený rámeček a text pod polem;
- focus jako u tlačítek;
- výběr „Mám zájem o“ jako normální select s popiskem.

**Patička:**
- tmavá smrková, sloupce oddělené linkami;
- všechny údaje, odkazy, provozovatelé a poznámka „Návrh redesignu“ zůstávají (poznámka jako prostý text);
- obří průsvitný nápis odpadne (po schválení).

**Obrázky:**
- poměry stran 3:2 (na šířku), 4:5 (na výšku), 16:9 (pásy), pruh přes celou šířku 21:9;
- `object-fit: cover`, líné načítání, alt texty;
- fotky z Instagramu (1080 px) jen tam, kde nejsou přes celou šířku.

**Ikony:**
- jedna stávající obrysová sada, tah 1,5, velikost 18–20 px;
- jen vedle textu (telefon, e-mail, adresa, šipky), nikdy v barevném čtverečku;
- u výletů a karet ikony odpadnou, nahradí je čísla.

## 6. Zaoblení a stíny

- `--radius: 4px` pro fotky, pole a dialogy. `--radius-pill` jen pro tlačítka.
- Stíny nejsou, kromě dialogů: `--shadow-dialog: 0 24px 64px -24px rgba(22,36,28,.35)`.
- Žádné záře, sklo (`backdrop-filter`), lesky ani svítící stíny.

## 7. Pohyb

- Přechody 150–250 ms, `cubic-bezier(.2,.7,.2,1)`.
- Prvky se při scrollu objeví jen jednou a jemně: průhlednost a posun 12 px za 500 ms, bez postupného zpoždění v mřížkách.
- Žádné poskakování, pulzování ani nekonečné otáčení.
- `prefers-reduced-motion` vypne vše kromě nutných změn stavu.

## 8. Zakázané po celou dobu

- emoji;
- fialovo-modré gradienty, záře, glassmorphism;
- karty se stínem jako výchozí obal obsahu;
- 3 stejné karty vedle sebe;
- vymyšlená čísla, citace a lorem ipsum;
- barvy mimo tokeny;
- řezy 700 a 800.

---

## Ke schválení

1. **Písmo:**
   - **A) Manrope 500 + Instrument Serif Italic** – doporučuju; stejně jako golf, oba weby budou jedna rodina;
   - **B) celé nadpisy patkové (Fraunces 400) + Manrope na text** – „hotelovější“, víc navazuje na logo, ale od golfu se oddálí.
2. **Barva akcentu:**
   - **bronz #B8925E** podle jídelního lístku hotelu – doporučuju;
   - nebo **zlatá #C9A961** jako u golfu.
3. **Efekty, které bych odebral nebo zjemnil.** Nic z toho nezmizí bez tvého souhlasu:
   - otáčející se kruhové odznaky (4×) – údaje z nich zůstanou jako text;
   - pomalý zoom fotek v slideru a v úvodních pásech;
   - podnadpis úvodu skládaný po slovech;
   - čísla, která se „načítají“ (zůstanou čísla bez animace);
   - pulzující zelená tečka;
   - lesk přejíždějící přes tlačítka;
   - obří průsvitný nápis v patičce;
   - kruhové odhalení menu (nahradí ho rychlé prolnutí);
   - parallax malých fotek v kolážích.

   **Zůstává:**
   - 3 fotopanely přes celou obrazovku na úvodu (jsou silné);
   - slider fotek;
   - padající sníh v zimní sekci;
   - tenká linka průběhu scrollu.
4. **Vlajky** u přepínače jazyka nahradím textem „CZ / DE“.
5. **Texty (fáze 6, samostatně ke schválení):** vymyšlené citace „Konečně klid.“ ap. a fráze typu „Jeden dům. Pro každého.“ bych přepsal věcně. Fakta zůstanou beze změny.
