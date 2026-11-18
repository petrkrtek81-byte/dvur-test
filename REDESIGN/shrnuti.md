# Shrnutí redesignu – Krušnohorský Dvůr

Redesign podle zadání „aby web NEVYPADAL vibe-coded“. Práce je ve větvi `redesign`, větev `main` (GitHub Pages) je beze změny.

- **Záloha:**
  - tag `pred-redesignem-2026-11-17`;
  - kopie složky `C:\Users\fild0\Documents\krusnohorsky-dvur-redesign-zaloha-2026-11-17`.
- **Podklady:**
  - `inventura.md` – stav před redesignem;
  - `diagnoza.md` – 13 znaků „AI vzhledu“;
  - `design-system.md` – schválený směr A;
  - `pred/` a `po/` – výpisy textů, odkazů a obrázků, screenshoty (screenshoty jsou jen na disku, ne v gitu).

## Schválený směr

- **Písmo:** Manrope (nadpisy 500, text 400, popisky a tlačítka 600). Akcent nejvýš jednou na stránce skutečnou patkovou kurzívou Instrument Serif Italic.
- **Barvy:**
  - teplá lomená bílá a písková;
  - tmavá smrková;
  - **jediný akcent bronz** podle jídelního lístku hotelu.
- **Plochy:** linky, seznamy a velké fotky místo karet. Zaoblení 4 px (pilulka jen u tlačítek a filtrů galerie), mezery po 8 px, mřížka 12 sloupců.
- **Odebrané efekty:**
  - otáčející se odznaky (údaje zůstaly jako text);
  - přibližování fotek;
  - podnadpis skládaný po slovech;
  - „načítající se“ čísla;
  - pulzující tečka;
  - lesk tlačítek;
  - obří nápis v patičce;
  - kruhové otevírání menu;
  - parallax malých fotek.
- **Zůstalo:**
  - fotopanely na úvodu;
  - slider;
  - padající sníh;
  - linka průběhu scrollu.

## Co se změnilo (1 oblast = 1 commit)

| Commit | Oblast | Hlavní změny |
|---|---|---|
| `6a5f9aa` | tokeny a typografie | CSS proměnné pro barvy, písmo, mezery, zaoblení a pohyb. Manrope + Instrument Serif místo Baloo 2. Řezy 700/800 a dopočítaná kurzíva pryč. |
| `4528def` | navigace | Hlavička po scrollu světlá s tmavým logem, „CZ / DE“ místo vlajek, menu se objeví prolnutím. |
| `3dca868` | úvodní fotky | Jedno hlavní tlačítko a Jídelní lístek jako textový odkaz. Bez zoomu, skládání po slovech a pulzování. |
| `51bfce1` | typografie | Kurzívní akcent nejvýš v jednom nadpisu na stránce, velké texty na škále tokenů. |
| `b8ad76c` | úvodní stránka | Pro koho jako řádky, čísla bez animace, aktuality jako řádky, otevírací doba jako seznam s linkami. |
| `db55577` | ubytování a koláže | Pokoje jako střídavé řádky „fotka + text“, recepce jako tmavá sekce s číslovaným seznamem, koláže bez překrývání a odznaků. |
| `153ca28` | restaurace | Jídelní lístek s plnými linkami, ceny v tabulkových číslicích. |
| `9d6bca3` | ceník | Balíčky ve dvou sloupcích s linkou místo karet se září, doplňky a storno jako tabulky. |
| `2981299` | svatby a akce | Tři stejné karty → řádky s linkami. |
| `682afe4` | okolí | Rozcestník s popisem pod fotkou, zima tmavě smrková místo modré, výlety jako číslovaný seznam. |
| `419e5ed` | kontakty | Údaje jako „popisek → údaj“, odkazy a provozovatelé bez tmavé karty. |
| `05dc07a` | obrázky | WebP s JPEG zálohou a 800px varianta podle šířky obrazovky. Galerie a prohlížeč bez zoomu, skla a skeletonu. |
| `7cefc06` | tlačítka | Bronzové jen pro hlavní akci, jinak obrysová; stavy hover, active, focus a disabled. |
| `1be08d1` | formulář | Popisek nad polem, pole 48 px, chyba červeně pod polem (CZ i DE). |
| `33b37c8` | patička | Sloupce s linkami, poznámka „Návrh redesignu“ prostým textem. |
| `ed105d8` | mobil | Spodní lišta s rezervací plná, bez skla a stínu; ověřeno na šířce 360 a 390 px. |
| `d572168` | mikrodetaily | Objevení při scrollu 12 px / 500 ms bez zpoždění, dialogy a toast na tokenech, staré proměnné pryč. |
| `33446a5` | přístupnost | Popisky náhledů fotek, pořadí nadpisů, kontrast fokusu a textu na fotkách. |

## Závěrečná kontrola

### Obsah a funkce (porovnání `pred/texty` × `po/texty`, všech 10 stránek česky i německy)

- **Odkazy:** všechny zůstaly, žádný nechybí.
- **Fotky:** všechny zůstaly. Pokoje se teď načítají z plné fotky místo náhledu, náhledy jídel, sauny a svateb mají nově popis.
- **Texty:** beze ztrát. Rozdíly jsou jen schválené nebo technické:
  - údaje z kruhových odznaků jsou teď prostý text (např. „výška 865 m · 8 pokojů · 24 lůžek…“);
  - datum aktuality je zapsané jako „13. 9. 2024“ místo štítku „13 / zář 2024“;
  - podnadpis úvodu už není rozdělený na slova;
  - zmizel ozdobný nápis „Krušnohorský Dvůr“ v patičce (byl skrytý pro čtečky);
  - zmizela nápověda „Posuňte do strany“ – ceník se už do strany neposouvá;
  - stav restaurace se liší jen podle času, kdy výpis vznikl.
- **Funkce:** všechny fungují (prověřeno v prohlížeči):
  - jazyk CZ/DE;
  - menu;
  - slider;
  - prohlížeč fotek (fotky ve WebP);
  - filtry galerie;
  - aktuality a jejich detail;
  - poptávka (připraví e-mail, chyby pod polem);
  - mapa po kliknutí;
  - sníh;
  - spodní lišta na mobilu.

### Diagnóza po redesignu

| Znak z diagnózy | Před | Po |
|---|---|---|
| hodnoty zaoblení | 19 různých | 3: 4 px, pilulka (tlačítka a filtry), kruh (ikonová tlačítka) |
| stíny (`box-shadow`) | 30× | 1 – jen dialogy |
| sklo (`backdrop-filter`) | 22× | 0 |
| řezy 700 / 800 | 64× | 0 |
| dopočítaná kurzíva | 4× | 0 |
| nekonečné animace | otáčení, pulz, běžící čárka, skeleton | 0 v CSS (zůstal jen sníh v canvasu, při omezení pohybu vypnutý) |
| barvy mimo tokeny | 152× `rgba(...)` | 0 (vše přes proměnné v `:root`) |
| karty se stínem / tři stejné karty | pokoje, balíčky, výlety, svatby, kontakty… | 0 – řádky, linky a seznamy |
| emoji, fialovo-modré gradienty | 0 | 0 |

### Přístupnost (WCAG 2.1 AA)

- **Kontrast textu:**

  | Dvojice barev | Kontrast |
  |---|---|
  | text na pozadí | 14,7 : 1 |
  | vedlejší text | 6,2 : 1 |
  | odkazy | 6,8 : 1 |
  | chyby | 6,1 : 1 |
  | text na tmavé | 14,4 : 1 |
  | vedlejší text na tmavé | 7,2 : 1 |
  | bronz na tmavé | 5,6 : 1 |
  | text tlačítka | 5,7 : 1 (při najetí 4,7 : 1) |
  | rámeček formulářového pole | 3,4 : 1 |

  Bronz se jako barva textu na světlém pozadí nepoužívá (měl by jen 2,6 : 1).
- **Text na fotkách:** závoj je pod textem tmavší, ve spodní části až 85 %.
- **Fokus:**
  - viditelný rámeček 2 px;
  - na světlých plochách tmavý (14 : 1), na tmavých bronzový (5,6 : 1);
  - ověřeno procházením klávesou Tab.
- **Struktura:**
  - každá stránka má jeden H1 a nadpisy bez přeskočených úrovní;
  - všechny obrázky mají `alt`, tlačítka a odkazy mají název;
  - pole formuláře mají popisek, chyby mají `aria-invalid` a `aria-describedby`;
  - ověřeno česky i německy.
- **Omezení pohybu:** `prefers-reduced-motion` vypne animace i sníh.

### Výkon

- **Fotky:** WebP je o 23 % menší než JPEG (20,9 MB oproti 27,3 MB celé knihovny). Velké fotky v menších blocích si na mobilu berou 800px variantu.
- **Úvodní stránka** (místní server, desktop):

  | Část | Velikost |
  |---|---|
  | HTML | 42 kB |
  | CSS | 72 kB |
  | JS | 65 kB |
  | písma | 73 kB |
  | fotky (6 souborů, všechny WebP) | 1,1 MB |

  Načtení trvá 0,5 s.
- **Písma:** Baloo 2 (60 kB) odpadlo, přibyl Instrument Serif (34 kB).

### Konzole a technika

- Všech 10 stránek česky i německy: konzole bez chyb a bez chybějících souborů.
- Bez vodorovného posouvání na šířce 360 a 390 px.

### Screenshoty

- **Na disku:** `po/screenshoty/` – celé stránky, desktop 1440 px i mobil 390 px.
- **Porovnání před a po:** `po/screenshoty/srovnani-*.jpg` (ubytování, ceník, svatby, okolí).

## Fáze 6 – texty (schváleno a provedeno 2026-11-18)

Fakta zůstala. Změnily se jen vymyšlené citace a prázdné fráze z diagnózy, česky i německy (německy např. „Hotel, Restaurant und Saal unter einem Dach.“, „Aufenthaltspakete“, „Vier Zimmerkategorien“, „Ausflüge in der Umgebung“).

| Kde | Dřív | Nově |
|---|---|---|
| Úvod – tmavý pás, nadpis | Jeden dům. Pro každého. | Hotel, restaurace a sál pod jednou střechou. |
| Úvod – „Na víkend“ | „Konečně klid.“ | Pobytové balíčky |
| Úvod – „Na oběd i večeři“ | „Dáme si něco dobrého.“ | Restaurace denně 11–22 h |
| Úvod – „Na oslavu“ | „Slavíme u vás.“ | Svatby, oslavy a firemní akce |
| Ubytování – nadpis | Čtyři kategorie, jeden domov | Čtyři kategorie pokojů |
| Restaurace – nadpis lístku | Na co máte chuť? | Stálý jídelní lístek |
| Restaurace – pás | Catering pro každou příležitost | Catering a svatební obědy |
| Sauna – fotky | Dřevo, teplo a sníh | Sauna v létě i v zimě |
| Okolí – výlety | Tipy na každé počasí | Výlety v okolí |
| Svatby – závěr | Co budeme slavit? | Poptávka svatby nebo akce |

## Co zbývá / k rozhodnutí

1. Sloučit větev `redesign` do `main` a tím ji zveřejnit na GitHub Pages – jen po souhlasu.
2. Ověřit u hotelu (beze změny od původního návrhu):
   - romantický balíček: sekt, nebo sauna;
   - DIČ hotelu;
   - souhlas s fotkami z Instagramu.
