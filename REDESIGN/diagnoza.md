# Diagnóza „AI slop“ – Krušnohorský Dvůr

Seřazeno od nejhoršího. Podklady: screenshoty v `REDESIGN/pred/screenshoty/` (desktop 1440 px, mobil 390 px), CSS `assets/css/web.css`, šablony `sablony/`.
Čísla řádků platí pro stav v tagu `pred-redesignem-2026-11-17`.

## 1. Všechno je v kartě nebo dlaždici
Nejvýraznější znak. Skoro každý obsah má vlastní rámeček s pozadím, zaoblením a často stínem.
- **Pokoje:** 4 stejné bílé karty se stínem (`.room`, CSS sekce 28; `ubytovani.html`).
- **Balíčky:** tmavé karty s průhledným gradientem a „září“ v rohu (`.price-card` + `::before` radiální zlatá skvrna, ř. ~427–431; `cenik.html`).
- **Doplňky, storno a služby:** dlaždice v dlaždici (`.extra`, `.greenfee`, `.gf`; `cenik.html`).
- **Výlety:** 8 identických bílých karet s ikonou v rámečku (`.trip`; `okoli.html` #vylety).
- **Ostatní:**
  - kontakty: 4 dlaždice s ikonou v tmavém čtverci (`.contact-item`);
  - boxy otevírací doby: 5× (`.hours`);
  - formulář a odkazy v kartách (`.form-card`, `.links-card`);
  - boxy koupání (`.gf--light`);
  - služby recepce a vlastnosti jako dlaždice (`.amenity`);
  - aktuality jako karty se stínem (`.news-card`).
- **Zaoblení bez systému:** 19 různých hodnot (2, 6, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32 px, 50 %, 999 px…).

## 2. Opakovaná šablona „text vlevo + koláž dvou fotek s otáčejícím se odznakem vpravo“
Stejná kompozice je 6× a stránky pak vypadají stejně:
- `ubytovani.html` #ubytovani;
- `restaurace.html` #restaurace;
- `sauna.html` #sauna;
- `cenik.html` #poukazy;
- `okoli.html` #kolo a #koupani.

Ve čtyřech je otáčející se kruhový text (`.ring-badge`, `animation:spin 22s`, ř. 364). Malá fotka se navíc posouvá parallaxem (`data-parallax`).
Chybí rytmus: žádná sekce není výrazně větší, tišší ani jinak postavená.

## 3. Mřížky stejných karet s ikonkou, nadpisem a odstavcem
- **Svatby a akce:** 3 stejné karty Svatby / Firemní akce / Oslavy (ikona v rámečku, nadpis, 4 body s fajfkou, tlačítko), prostřední „featured“ se štítkem (`.train-card`).
- **Úvod:** 3 sloupce Na víkend / Na oběd i večeři / Na oslavu s vymyšlenými citacemi „Konečně klid.“, „Dáme si něco dobrého.“, „Slavíme u vás.“ (`index.html` .audience).
- **Výlety:** 8 karet 4 × 2.
- **Zima:** 3 dlaždice (`.ski`).
- **Doplňky v ceníku:** 4 dlaždice (`.extra`).

## 4. Typografie bez hierarchie a s „falešnou“ kurzívou
- **Nadpisy:** Baloo 2 je zaoblené dětsky působící písmo vybrané podle loga golfu. S patkovým logem hotelu (kapitálky) nemá nic společného.
- **Řezy:** skoro všechno je 700/800, v CSS 64× (H1, H2, H3, čísla, ceny, popisky, menu). Nadpisy se liší jen velikostí.
- **Kurzíva:** akcentní slova v H2 jsou kurzíva, kterou Baloo 2 nemá. Prohlížeč ji dopočítá (`font-synthesis:style`, ř. 948, 971, 975, 992), výsledek je šikmé tučné písmo.
- **Akcent v každém H2:** „za *příznivé ceny*“, „*jeden domov*“, „*chuť?*“, „*pro dva*“, „*v horách*“, „*vaši akci*“, „*nástupní bod*“…, navíc dvěma barvami (zelená na světlé, zlatá na tmavé). Akcent tím přestává být akcentem.
- **Popisky:** malé popisky velkými písmeny s čárkou („— NABÍDKA POKOJŮ“, `.eyebrow`) jsou nad skoro každým nadpisem (2–5× na stránku). Typický AI vzor.
- **Délka řádku:** text v kartách je malý (13–15 px) a šedý, v tmavých sekcích má nízký kontrast (průhlednost .6–.7).

## 5. Pilulky a štítky všude
- **Tlačítka:** všechna jsou pilulky (`border-radius:999px` 14×), včetně malých tlačítek uvnitř karet.
- **Štítky:** „Dvoulůžkový“ (`.tag`); vlastnosti pokojů jako pilulky (`.room__feats`); fakta u kola (`.facts`).
- **Stavy:** „Právě otevřeno – do 22:00“ jako zelená pilulka s pulzující tečkou (`.dot-live`, `@keyframes pulse`); v patičce pilulka „Návrh redesignu“.
- **Galerie:** 9 filtrů jako pilulky – tady to dává smysl, ale zbytek pilulek ne.

## 6. Sklo, lesky a záře
- **Glassmorphism (`backdrop-filter`):**
  - hlavička po scrollu (ř. 160);
  - průhledné tlačítko „ghost“ (ř. 122);
  - štítek data aktuality (ř. 398);
  - počet fotek u pokojů;
  - kulaté tlačítko u dlaždic Okolí (ř. 880);
  - zimní dlaždice (ř. 564);
  - mobilní lišta (ř. 646);
  - šipky prohlížeče.
- **Lesk na tlačítkách:** přes zlaté tlačítko přejíždí bílý lesk (`.btn--gold::after`, ř. 116–121) a tlačítko má zlatou „svítící“ stín.
- **Záře:** zlatá radiální skvrna v kartách ceníku a kruhy v rozích.

## 7. Příliš mnoho animací
- **Fotky:**
  - pomalý zoom (Ken Burns) na každé fotce slideru (ř. 265);
  - zoom úvodní fotky každé podstránky (ř. 849);
  - parallax koláží.
- **Text a čísla:**
  - podnadpis úvodu se skládá po slovech;
  - čísla se „načítají“ (8, 24, 865, 2011).
- **Neustálý pohyb:**
  - otáčející se kruhové texty;
  - pulzující tečka;
  - běžící čárka „Objevte“;
  - padající sníh.
- **Scroll:** každý prvek se při scrollu vysune (`.reveal`, 174× v šablonách), v mřížkách postupně se zpožděním.
- **Menu:** se otevírá kruhovým odhalením.
- **Patička:** obří průsvitný nápis „Krušnohorský Dvůr“ (`.footer__wordmark`).

## 8. Příliš mnoho akcentních barev
Na jednom webu je:
- zlatá (3 odstíny: `--gold`, `--gold-2`, `--gold-dark`);
- trávově zelená (`--grass`, `--grass-2`) pro kurzívu a ikony;
- ledově modrá a noční modrá v zimní sekci (`--ice`, `--night`);
- zelená tečka „živě“ (`#7fd88d`) a červená pro „uzavřeno“.

Barvy textu jsou psané natvrdo jako `rgba(245,240,230,.76)` a podobné průhlednosti (desítky variant místo tokenů).

## 9. Nekonzistentní mezery
Hodnoty od oka:
- rem: .45, .55, .6, .7, .85, .9, 1.1, 1.2, 1.3, 1.4, 1.6, 1.8, 2.2, 2.4, 2.6…;
- `clamp()` s různými kombinacemi;
- vlastní okraje karet (1.1rem 1.3rem, 1.5rem 1.6rem 1.7rem, 2.1rem 2rem…).

Neexistuje systém 4/8 px. Sekce mají skoro všude stejnou výšku mezer (`clamp(4.5rem, 9vw, 8.5rem)`), takže nevzniká rytmus.

## 10. Generický hero a marketingové fráze
- **Hero:** eyebrow, dvouřádkový nadpis s kurzívou, podnadpis a **dvě tlačítka vedle sebe** („Rezervovat pobyt“ + „Jídelní lístek“). Navíc tečky slideru, popisek fotky, stav restaurace a „Objevte“ – v jednom pásu je 8 prvků.
- **Prázdné fráze:**
  - „Jeden dům. Pro každého.“;
  - citace „Konečně klid.“, „Dáme si něco dobrého.“, „Slavíme u vás.“ (nikdo je neřekl);
  - „Čtyři kategorie, jeden domov“;
  - „Na co máte chuť?“;
  - „Tipy na každé počasí“;
  - „Co budeme slavit?“;
  - „Catering pro každou příležitost“;
  - „Dřevo, teplo a sníh“.
- **Fakta jsou v pořádku:** ceny, časy, kontakty i texty převzaté z webu hotelu jsou správně.

## 11. Ikony v rámečcích a vlajky
- **Jedna sada, ale v čtverečcích:** sada je obrysová a jednotná, často je ale zavřená v barevném čtverečku nebo kruhu (`.train-card__icon`, `.trip__icon`, `.extra__icon`, `.ski__icon`, `.contact-item__icon`, `.price-card__icon`). To je typický vzhled „features gridu“.
- **Vlajky:** přepínač jazyka používá vlajky. Hezčí a přístupnější je text CZ / DE.

## 12. Fotky
- **Kvalita je dobrá:** fotky jsou skutečné (web a Instagram hotelu), žádné stock fotky ani placeholdery.
- **Problémy:**
  - některé fotky z Instagramu mají jen 1080 px a na celou šířku obrazovky (úvodní pásy, fotopanely) jsou měkké;
  - ořezy jsou náhodné (4:5 koláže, 16:10 pokoje, 4:3 náhledy, 3:2 dlaždice) a zaoblené různými poloměry.
- **Výkon:** fotky jsou jen JPEG, bez WebP/AVIF a bez `srcset`.

## 13. Drobnosti
- **Kontrast:** hlavička po scrollu je poloprůhledná zelená a menu tmavý radiální gradient. Na tmavých sekcích jsou šedé texty s průhledností .6, kontrast je těsně kolem AA.
- **Výchozí barvy Tailwindu/Bootstrapu:** žádné nejsou (dobře).
- **Emoji:** žádné nejsou (dobře).
