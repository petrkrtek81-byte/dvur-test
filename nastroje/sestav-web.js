#!/usr/bin/env node
/* =====================================================================
   SESTAVENÍ STRÁNEK WEBU (stejný postup jako u redesignu Golf Club Teplice)
   ---------------------------------------------------------------------
   Stránky (index.html, ubytovani.html, …) se skládají ze šablon ve složce sablony/:
     _hlava.html  – <head> (titulek, popis, odkazy na CSS/JS)
     _lista.html  – ikony, hlavička s tlačítkem Menu, menu přes celou obrazovku
     <stranka>.html – obsah konkrétní stránky
     _pata.html   – patička, dialogy
   Po úpravě šablon spusťte:   node nastroje/sestav-web.js
   Hotové stránky se zapíší do kořene webu (ty se nahrávají na hosting).
   Odkazy #ubytovani, #cenik… mezi stránkami se samy převedou na ubytovani.html, cenik.html…
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'sablony');
const SITE = 'https://www.krusnohorskydvur.cz/';
// on-line rezervace (Previo – stejný systém jako na současném webu)
const BOOKING = 'https://booking.previo.cz/?hotId=3355&theme=gold&lang=cs';
const BOOKING_DE = 'https://booking.previo.cz/?hotId=3355&theme=gold&lang=de';

// stránky webu: page = id sekce i název souboru; img = fotka v úvodním pásu (assets/img/<img>.jpg)
const PAGES = [
  { page: 'uvod', file: 'index.html', og: 'hotel-zima-noc',
    title: 'Krušnohorský Dvůr – horský hotel a restaurace na Cínovci',
    titleDe: 'Krušnohorský Dvůr – Berghotel und Restaurant in Cínovec (Erzgebirge)',
    description: 'Horský hotel a restaurace Krušnohorský Dvůr na Cínovci v Krušných horách, 865 m n. m.: 8 pokojů, restaurace s krbem a terasou, sauna, pobytové balíčky, svatby a firemní akce.',
    descriptionDe: 'Berghotel und Restaurant Krušnohorský Dvůr in Cínovec im Erzgebirge, 865 m ü. M.: 8 Zimmer, Restaurant mit Kamin und Terrasse, Sauna, Aufenthaltspakete, Hochzeiten und Firmenevents.' },
  { page: 'ubytovani', file: 'ubytovani.html', nav: 'Ubytování', navDe: 'Unterkunft', img: 'pokoj-komfort-2',
    title: 'Ubytování – pokoje | Krušnohorský Dvůr, Cínovec', titleDe: 'Unterkunft – Zimmer | Krušnohorský Dvůr, Cínovec',
    description: '8 pokojů ve 4 kategoriích (standardní, komfortní, exklusivní, rodinný), 24 lůžek, snídaně formou bufetu v ceně. Check-in od 14:00, check-out do 10:00.',
    descriptionDe: '8 Zimmer in 4 Kategorien (Standard, Komfort, Exklusiv, Familie), 24 Betten, Frühstücksbuffet inklusive. Check-in ab 14:00, Check-out bis 10:00.',
    lead: '8 pokojů ve 4 kategoriích, snídaně formou bufetu v ceně.', leadDe: '8 Zimmer in 4 Kategorien, Frühstücksbuffet inklusive.' },
  { page: 'restaurace', file: 'restaurace.html', nav: 'Restaurace', navDe: 'Restaurant', img: 'restaurace-krb',
    title: 'Restaurace a jídelní lístek | Krušnohorský Dvůr, Cínovec', titleDe: 'Restaurant und Speisekarte | Krušnohorský Dvůr, Cínovec',
    description: 'Stylová restaurace s krbem a terasou s výhledem na České středohoří. Otevřeno denně 11–22 h. Jídelní lístek 2026, týdenní speciality, catering.',
    descriptionDe: 'Stilvolles Restaurant mit Kamin und Terrasse mit Blick auf das Böhmische Mittelgebirge. Täglich 11–22 Uhr. Speisekarte 2026, Wochenspezialitäten, Catering.',
    lead: 'Krb, terasa s výhledem a česká kuchyně. Otevřeno denně 11–22 h.', leadDe: 'Kamin, Aussichtsterrasse und böhmische Küche. Täglich 11–22 Uhr.' },
  { page: 'cenik', file: 'cenik.html', nav: 'Ceník a balíčky', navDe: 'Preise & Pakete', img: 'pokoj-exklusiv-romanticky',
    title: 'Ceník a pobytové balíčky | Krušnohorský Dvůr, Cínovec', titleDe: 'Preise und Aufenthaltspakete | Krušnohorský Dvůr, Cínovec',
    description: 'Romantický pobytový balíček 3 990 Kč, gurmánský 5 990 Kč. Ceny ubytování a volné termíny v on-line rezervaci, storno podmínky, dárkové poukazy.',
    descriptionDe: 'Romantisches Aufenthaltspaket 3 990 CZK, Gourmet-Paket 5 990 CZK. Zimmerpreise und freie Termine in der Online-Buchung, Stornobedingungen, Gutscheine.',
    lead: 'Pobytové balíčky, ceny ubytování a dárkové poukazy.', leadDe: 'Aufenthaltspakete, Zimmerpreise und Geschenkgutscheine.' },
  { page: 'sauna', file: 'sauna.html', nav: 'Sauna', navDe: 'Sauna', img: 'sauna',
    title: 'Sauna | Krušnohorský Dvůr, Cínovec', titleDe: 'Sauna | Krušnohorský Dvůr, Cínovec',
    description: 'Finská sauna pro 1–4 osoby, otevřená denně pro hotelové hosty i veřejnost. Nutná rezervace předem na +420 778 051 970.',
    descriptionDe: 'Finnische Sauna für 1–4 Personen, täglich für Hotelgäste und Besucher geöffnet. Reservierung im Voraus unter +420 778 051 970.',
    lead: 'Finská sauna pro 1–4 osoby – pro hotelové hosty i veřejnost.', leadDe: 'Finnische Sauna für 1–4 Personen – für Hotelgäste und Besucher.' },
  { page: 'svatby-a-akce', file: 'svatby-a-akce.html', nav: 'Svatby a akce', navDe: 'Hochzeiten & Feiern', img: 'svatba-sal',
    title: 'Svatby, oslavy a firemní akce | Krušnohorský Dvůr, Cínovec', titleDe: 'Hochzeiten, Feiern und Firmenevents | Krušnohorský Dvůr, Cínovec',
    description: 'Svatební obědy, firemní akce, teambuildingy a oslavy na Cínovci. Konferenční sál s vybavením, sauna, kompletní catering a raut na přání.',
    descriptionDe: 'Hochzeitsessen, Firmenevents, Teambuildings und Feiern in Cínovec. Ausgestatteter Konferenzraum, Sauna, komplettes Catering und Buffet nach Wunsch.',
    lead: 'Svatební obědy, firemní akce, teambuildingy i oslavy – s cateringem na přání.', leadDe: 'Hochzeitsessen, Firmenevents, Teambuildings und Feiern – mit Catering nach Wunsch.' },
  { page: 'okoli', file: 'okoli.html', nav: 'Okolí', navDe: 'Umgebung', img: 'bezky-hotel',
    title: 'Okolí – běžky, kolo, golf a výlety | Krušnohorský Dvůr, Cínovec', titleDe: 'Umgebung – Langlauf, Rad, Golf und Ausflüge | Krušnohorský Dvůr, Cínovec',
    description: 'Běžkařské tratě Cínovec a Altenberg, cyklistický ráj Krušných hor, golfové hřiště u hotelu, termální lázně Raupennest, bobová dráha, rašeliniště a koupání.',
    descriptionDe: 'Loipen Cínovec und Altenberg, Radparadies Erzgebirge, Golfplatz am Hotel, Therme Raupennest, Sommerrodelbahn, Hochmoor und Baden.',
    lead: 'Běžky, kolo, golf, koupání i výlety do Saska – přímo od hotelu.', leadDe: 'Langlauf, Rad, Golf, Baden und Ausflüge nach Sachsen – direkt vom Hotel.' },
  { page: 'aktuality', file: 'aktuality.html', nav: 'Aktuality', navDe: 'Aktuelles', img: 'terasa-kola',
    title: 'Aktuality | Krušnohorský Dvůr, Cínovec', titleDe: 'Aktuelles | Krušnohorský Dvůr, Cínovec',
    description: 'Novinky z hotelu a restaurace Krušnohorský Dvůr na Cínovci: otevírací doba, sauna, poukazy, firemní akce a dění v okolí.',
    descriptionDe: 'Neuigkeiten aus dem Hotel und Restaurant Krušnohorský Dvůr in Cínovec: Öffnungszeiten, Sauna, Gutscheine, Firmenevents und Veranstaltungen.',
    lead: 'Novinky z hotelu, restaurace a okolí.', leadDe: 'Neuigkeiten aus Hotel, Restaurant und Umgebung.' },
  { page: 'fotogalerie', file: 'fotogalerie.html', nav: 'Fotogalerie', navDe: 'Fotogalerie', img: 'restaurace-sal',
    title: 'Fotogalerie | Krušnohorský Dvůr, Cínovec', titleDe: 'Fotogalerie | Krušnohorský Dvůr, Cínovec',
    description: 'Fotografie hotelu, pokojů, restaurace, jídla, svateb a akcí, sauny a okolí Cínovce v létě i v zimě.',
    descriptionDe: 'Fotos von Hotel, Zimmern, Restaurant, Essen, Hochzeiten und Feiern, Sauna und der Umgebung von Cínovec im Sommer und Winter.',
    lead: 'Hotel, pokoje, restaurace a Cínovec v létě i v zimě.', leadDe: 'Hotel, Zimmer, Restaurant und Cínovec im Sommer und Winter.' },
  { page: 'kontakty', file: 'kontakty.html', nav: 'Kontakty', navDe: 'Kontakt', img: 'hotel-zima-slunce',
    title: 'Kontakty | Krušnohorský Dvůr, Cínovec', titleDe: 'Kontakt | Krušnohorský Dvůr, Cínovec',
    description: 'Krušnohorský Dvůr, Cínovec 275, Dubí-Cínovec. Telefon +420 778 051 970, e-mail info@krusnohorskydvur.cz, mapa, cesta a poptávka.',
    descriptionDe: 'Krušnohorský Dvůr, Cínovec 275, Dubí-Cínovec. Telefon +420 778 051 970, E-Mail info@krusnohorskydvur.cz, Karte, Anfahrt und Anfrage.',
    lead: 'Cínovec 275, Dubí-Cínovec – jak nás najít a kontaktovat.', leadDe: 'Cínovec 275, Dubí-Cínovec – so finden und erreichen Sie uns.' },
];
const SECTION_PAGES = PAGES.filter(p => p.nav).map(p => p.page);

const read = f => fs.readFileSync(path.join(SRC, f), 'utf8').replace(/\r\n/g, '\n');
const hash = f => crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, f))).digest('hex').slice(0, 8);
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const head = read('_hlava.html');
const bar = read('_lista.html');
const foot = read('_pata.html');
const common = {
  site: SITE, booking: escAttr(BOOKING), bookingDe: escAttr(BOOKING_DE),
  cssVersion: hash('assets/css/web.css'), jsVersion: hash('assets/js/web.js'),
};

// úvodní pás podstránky: fotka, drobečková navigace, nadpis, krátký popis (CZ + DE v data-de)
const pageHero = p => `<!-- =====================================================================
     ${p.nav.toUpperCase()} – úvodní pás stránky
     ===================================================================== -->
<section class="page-hero" id="top" aria-labelledby="pageTitle">
  <div class="page-hero__bg" aria-hidden="true"><img src="assets/img/${p.img}.jpg" alt="" fetchpriority="high"></div>
  <div class="container page-hero__inner">
    <nav class="crumbs reveal" aria-label="Drobečková navigace"><a href="./" data-de="Startseite">Úvod</a><span aria-hidden="true">/</span><span aria-current="page" data-de="${escAttr(p.navDe)}">${p.nav}</span></nav>
    <h1 class="page-hero__title reveal" id="pageTitle" style="--d:.08s" data-de="${escAttr(p.navDe)}">${p.nav}</h1>
    <p class="page-hero__lead reveal" style="--d:.16s" data-de="${escAttr(p.leadDe)}">${p.lead}</p>
  </div>
</section>

`;

// Fotky jako <picture>: prohlížeč dostane WebP (nastroje/webp.js), JPEG zůstává jako záloha.
// U velkých fotek nabídne i náhled 800 px – podle šířky na obrazovce (atribut sizes u <img>, jinak 100vw).
const DIMS = JSON.parse(fs.readFileSync(path.join(__dirname, 'fotky.json'), 'utf8'));
const THUMB_W = 800;
const pictures = html => html.replace(/<img\b([^>]*?)\ssrc="assets\/img\/(thumbs\/)?([a-z0-9-]+)\.jpg"([^>]*)>/g, (m, pre, thumb, name, post) => {
  const dir = 'assets/img/' + (thumb || '');
  if (!fs.existsSync(path.join(ROOT, dir, name + '.webp'))) return m;
  const sizes = ((pre + post).match(/\ssizes="([^"]+)"/) || [])[1] || '100vw';
  const w = DIMS[name] && DIMS[name][0];
  const both = !thumb && w > THUMB_W && fs.existsSync(path.join(ROOT, 'assets/img/thumbs', name + '.webp'));
  const srcset = both ? `assets/img/thumbs/${name}.webp ${THUMB_W}w, assets/img/${name}.webp ${w}w" sizes="${sizes}` : `${dir}${name}.webp`;
  return `<picture><source type="image/webp" srcset="${srcset}">${m.replace(/\ssizes="[^"]+"/, '')}</picture>`;
});

let built = 0;
for (const p of PAGES) {
  const url = SITE + (p.file === 'index.html' ? '' : p.file);
  const vars = {
    ...common, page: p.page, url, ogImage: p.og || p.img,
    title: escAttr(p.title), titleDe: escAttr(p.titleDe), description: escAttr(p.description), descriptionDe: escAttr(p.descriptionDe),
  };
  let html = fill(head, vars);
  // menu: zvýraznit aktuální stránku
  html += fill(bar, vars).replace(/(<a )(href="[^"]*" data-page="([^"]+)")/g, (m, a, rest, pg) =>
    pg === p.page ? `${a}class="is-active" aria-current="page" ${rest}` : m);
  html += '\n' + (p.nav ? pageHero(p) : '') + fill(read(p.file), vars) + '\n' + fill(foot, vars);

  // odkazy na sekce jiných stránek: #cenik → cenik.html
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  html = html.replace(/href="#([a-z0-9-]+)"/g, (m, id) =>
    (!ids.has(id) && SECTION_PAGES.includes(id)) ? `href="${id}.html"` : m);
  const broken = [...html.matchAll(/href="#([a-z0-9-]+)"/g)].map(m => m[1]).filter(id => !ids.has(id));
  if (broken.length) console.warn(`⚠ ${p.file}: odkazy na neexistující kotvy: ${[...new Set(broken)].join(', ')}`);
  const left = [...html.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);
  if (left.length) console.warn(`⚠ ${p.file}: nevyplněné proměnné: ${[...new Set(left)].join(', ')}`);
  // chybějící fotky
  const missing = [...html.matchAll(/assets\/img\/([^"')\s]+\.jpg)/g)].map(m => m[1]).filter(f => !fs.existsSync(path.join(ROOT, 'assets/img', f)));
  if (missing.length) console.warn(`⚠ ${p.file}: chybí fotky: ${[...new Set(missing)].join(', ')}`);

  html = pictures(html);
  html = '<!-- Vygenerováno skriptem nastroje/sestav-web.js ze šablon ve složce sablony/ – upravujte šablony, ne tento soubor. -->\n' + html;
  fs.writeFileSync(path.join(ROOT, p.file), html);
  built++;
}

// fotky v data-photos / data-photo (prohlížeč fotek)
for (const f of fs.readdirSync(SRC)) {
  const t = read(f);
  const names = [...t.matchAll(/data-photos?="([^"]+)"/g)].flatMap(m => m[1].split(','));
  const miss = names.filter(n => !fs.existsSync(path.join(ROOT, 'assets/img', n.trim() + '.jpg')));
  if (miss.length) console.warn(`⚠ ${f}: chybí fotky v prohlížeči: ${miss.join(', ')}`);
}

// mapa webu pro vyhledávače (web je zatím návrh s noindex – sitemap se hodí až po spuštění)
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${PAGES.map(p => {
  const url = SITE + (p.file === 'index.html' ? '' : p.file);
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="cs" href="${url}"/>
    <xhtml:link rel="alternate" hreflang="de" href="${url}?lang=de"/>
  </url>`;
}).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log(`Hotovo: ${built} stránek + sitemap.xml (css ${common.cssVersion}, js ${common.jsVersion})`);
