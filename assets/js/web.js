/* =======================================================================
   KRUŠNOHORSKÝ DVŮR – skript webu (společný pro všechny stránky)
   Vychází z redesignu Golf Club Teplice. Každá část si nejdřív ověří,
   že na stránce má své prvky – jinak se přeskočí.
   Část A: DATA a německé překlady krátkých textů
   Část B: LOGIKA (animace, slider, prohlížeč fotek, aktuality, galerie, jazyk…)
   ======================================================================= */
(async () => {
'use strict';

/* -----------------------------------------------------------------------
   A. DATA
   ----------------------------------------------------------------------- */
const IMG = 'assets/img/';          // fotky v plném rozlišení (max. 1920 px)
const THUMB = 'assets/img/thumbs/'; // náhledy 800 px
const EMAIL = 'info@krusnohorskydvur.cz';
const OPEN_FROM = 11, OPEN_TO = 22; // restaurace denně 11–22 h
const NEWS_INITIAL = 6;              // kolik aktualit je vidět před „Zobrazit starší“
const NEWS_FALLBACK_IMG = 'hotel-zima-noc';
let NEWS = [];
let GALLERY = [];

/* -----------------------------------------------------------------------
   A2. NĚMECKÁ VERZE (DE)
   Texty na stránkách mají překlad přímo v šabloně (atribut data-de, u obrázků
   data-alt-de). Slovník DE níže je pro krátké texty ze skriptu a popisky
   tlačítek (aria-label): klíčem je český text, hodnotou německý překlad.
   Aktuality a fotogalerie mají němčinu v data/obsah.json.
   ----------------------------------------------------------------------- */
const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const DE = {
  'Přeskočit na obsah': 'Zum Inhalt springen',
  'Hlavní navigace': 'Hauptnavigation',
  'Krušnohorský Dvůr – úvodní stránka': 'Krušnohorský Dvůr – Startseite',
  'Krušnohorský Dvůr – hotel a restaurace': 'Krušnohorský Dvůr – Hotel und Restaurant',
  'Jazyk': 'Sprache',
  'Rezervovat pobyt on-line': 'Zimmer online buchen',
  'Otevřít menu': 'Menü öffnen',
  'Zavřít menu': 'Menü schließen',
  'Menu': 'Menü',
  'Zavřít': 'Schließen',
  'Zavolat': 'Anrufen',
  'Úvod': 'Startseite',
  'Fotografie': 'Fotos',
  'Fotografie {k}: {c}': 'Foto {k}: {c}',
  'Posunout na obsah': 'Zum Inhalt scrollen',
  'Drobečková navigace': 'Brotkrümelnavigation',
  'Předchozí fotka': 'Vorheriges Foto',
  'Další fotka': 'Nächstes Foto',
  'Kategorie fotografií': 'Fotokategorien',
  '8 pokojů, 24 lůžek': '8 Zimmer, 24 Betten',
  'Otevřeno denně': 'Täglich geöffnet',
  'Dárkové poukazy': 'Geschenkgutscheine',
  'Sauna pro 1 až 4 osoby': 'Sauna für 1 bis 4 Personen',
  'Zvětšit: {x}': 'Vergrößern: {x}',
  'Zobrazit všechny fotky': 'Alle Fotos anzeigen',
  'Číst více': 'Weiterlesen',
  'Zobrazit starší aktuality': 'Ältere Beiträge anzeigen',
  'Zatím zde nejsou žádné aktuality.': 'Hier gibt es noch keine Neuigkeiten.',
  'Obsah se nepodařilo načíst. Zkuste prosím stránku obnovit.': 'Die Inhalte konnten nicht geladen werden. Bitte laden Sie die Seite neu.',
  'Restaurace denně 11–22 h': 'Restaurant täglich 11–22 Uhr',
  'Restaurace otevřena do 22:00': 'Restaurant geöffnet bis 22:00',
  'Restaurace otevírá v 11:00': 'Restaurant öffnet um 11:00',
  'Restaurace otevírá zítra v 11:00': 'Restaurant öffnet morgen um 11:00',
  'Právě otevřeno – do 22:00': 'Jetzt geöffnet – bis 22:00',
  'Teď zavřeno – otevíráme v 11:00': 'Jetzt geschlossen – wir öffnen um 11:00',
  'Mapa – Krušnohorský Dvůr, Cínovec 275': 'Karte – Krušnohorský Dvůr, Cínovec 275',
  'Vyplňte prosím toto pole.': 'Bitte füllen Sie dieses Feld aus.',
  'Poptávka': 'Anfrage',
  'Dobrý den,': 'Guten Tag,',
  'posílám nezávaznou poptávku z webu:': 'hier meine unverbindliche Anfrage über die Website:',
  'Mám zájem o': 'Ich interessiere mich für',
  'Jméno': 'Name',
  'Telefon': 'Telefon',
  'Termín': 'Termin',
  'Počet osob': 'Personen',
  'Zpráva': 'Nachricht',
  'Děkuji.': 'Vielen Dank.',
};

/* -----------------------------------------------------------------------
   B. LOGIKA
   ----------------------------------------------------------------------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const fmt = n => Math.round(n).toLocaleString('cs-CZ');
const isPath = f => String(f).includes('/');
const imgUrl = f => isPath(f) ? f : IMG + f + '.jpg';
const thumbUrl = f => isPath(f) ? f : THUMB + f + '.jpg';
const MONTHS = ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'];
const parseDate = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
const czDate = iso => {
  const d = parseDate(iso);
  return LANG === 'de'
    ? d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
};
const monthName = d => (LANG === 'de' ? MONTHS_DE : MONTHS)[d.getMonth()];

/* ---------- Jazyk: t() přeloží krátký český text, L() vybere jazykovou verzi z dat ---------- */
let LANG = 'cs';
const refreshers = []; // funkce, které po přepnutí jazyka znovu vykreslí dynamický obsah
const normKey = s => String(s).replace(/[\s ]+/g, ' ').trim();
function t(cs, vars) {
  let out = cs;
  if (LANG === 'de') {
    const hit = DE[normKey(cs)];
    out = hit !== undefined ? hit : String(cs).replace(/Kč/g, 'CZK');
  }
  if (vars) Object.keys(vars).forEach(k => { out = String(out).split('{' + k + '}').join(vars[k]); });
  return out;
}
const L = (item, key) => (LANG === 'de' && item.de && item.de[key]) ? item.de[key] : item[key];
const icon = (id, cls = '') => `<svg class="i ${cls}"><use href="#${id}"/></svg>`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const safeHref = h => /^(https?:\/\/|tel:|mailto:|#|[a-z0-9-]+\.html)/i.test(String(h || '').trim()) ? String(h).trim() : '';

/* Text aktuality → HTML: prázdný řádek = odstavec, **tučně**, řádky „- …“ = seznam,
   odkazy (https://…) a telefonní čísla (+420 …) se proklikají samy. */
function richText(src) {
  const inline = str => esc(str)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/https?:\/\/[^\s<]*[^\s<.,;:!?)]/g, u => `<a href="${u}" target="_blank" rel="noopener">${u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a>`)
    .replace(/[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, m => `<a href="mailto:${m}">${m}</a>`)
    .replace(/\+\d{2,3}(?:[  ]?\d{3}){3}\b/g, n => `<a href="tel:${n.replace(/[  ]/g, '')}">${n}</a>`);
  return String(src || '').replace(/\r/g, '').split(/\n[ \t]*\n/).map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return '';
    if (lines.every(l => /^[-•]\s/.test(l))) return '<ul class="modal-list">' + lines.map(l => `<li>${inline(l.replace(/^[-•]\s+/, ''))}</li>`).join('') + '</ul>';
    return '<p>' + lines.map(inline).join('<br>') + '</p>';
  }).join('');
}

/* ---------- OBSAH Z data/obsah.json (aktuality, fotogalerie) ----------
   Stahuje se na pozadí – zbytek stránky (menu, jazyk, animace) na něj nečeká.
   Aktuality a galerie se vykreslí, až data dorazí (viz konec souboru). */
let contentOk = true;
const contentReady = (async () => {
  try {
    const c = await Promise.race([
      window.KD_OBSAH || Promise.reject(new Error('bez načítání')),
      new Promise((_, reject) => setTimeout(() => reject(new Error('časový limit')), 10000))
    ]);
    NEWS = (c.news || []).filter(n => n && n.date && n.title).sort((a, b) => b.date.localeCompare(a.date));
    GALLERY = (c.gallery || []).filter(g => g && g.f).map(g => ({ ...g, w: Number(g.w) || 1200, h: Number(g.h) || 900 }));
  } catch (err) {
    contentOk = false;
    console.warn('Obsah webu (data/obsah.json) se nepodařilo načíst:', err);
  }
})();
// interní odkaz s jazykem: v němčině nese ?lang=de (funguje i tam, kde prohlížeč volbu neuloží)
const langHref = h => {
  if (LANG !== 'de' || !/^(\.\/|[a-z0-9-]+\.html)/i.test(h) || /[?&]lang=/.test(h)) return h;
  const k = h.indexOf('#');
  const path = k < 0 ? h : h.slice(0, k), hash = k < 0 ? '' : h.slice(k);
  return path + (path.includes('?') ? '&' : '?') + 'lang=de' + hash;
};

/* ---------- Toast (krátká oznámení) ---------- */
const toastBox = $('#toasts');
function toast(msg, iconId = 'i-check') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = icon(iconId) + `<span>${msg}</span>`;
  toastBox.appendChild(el);
  setTimeout(() => {
    el.classList.add('is-out');
    el.addEventListener('animationend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 500);
  }, 3200);
}

/* ---------- Dialogy (nativní <dialog> + animace zavření) ---------- */
function openDialog(d) {
  if (d.open) return;
  d.showModal();
  root.classList.add('is-locked');
}
function closeDialog(d) {
  if (!d.open || d.classList.contains('is-closing')) return;
  const finish = () => { d.classList.remove('is-closing'); d.close(); };
  if (reduceMotion) return finish();
  d.classList.add('is-closing');
  const onEnd = e => { if (e.target === d) { d.removeEventListener('animationend', onEnd); finish(); } };
  d.addEventListener('animationend', onEnd);
  setTimeout(() => { if (d.open) finish(); }, 450); // pojistka
}
$$('dialog').forEach(d => {
  d.addEventListener('cancel', e => { e.preventDefault(); closeDialog(d); });              // Esc
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) closeDialog(d); });
  d.addEventListener('close', () => { if (!$$('dialog').some(x => x.open)) root.classList.remove('is-locked'); });
});

/* ---------- Hlavička, průběh scrollu, parallax (jedna rAF smyčka) ---------- */
const header = $('#siteHeader');
const scrollLine = $('.scroll-line');
const mobileBook = $('#mobileBook');
const heroContent = $('#heroContent');
const parallaxEls = reduceMotion ? [] : $$('[data-parallax]');
const footer = $('.footer');
let ticking = false;

function onScrollFrame() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  header.classList.toggle('is-scrolled', y > 40);

  // průběh stránky 0–1 → linka pod hlavičkou
  const max = document.documentElement.scrollHeight - vh;
  const p = max > 0 ? clamp(y / max, 0, 1) : 0;
  scrollLine.style.setProperty('--p', p.toFixed(4));

  // mobilní lišta s rezervací – po úvodu, skrytá u patičky
  const nearFooter = footer.getBoundingClientRect().top < vh;
  mobileBook.classList.toggle('is-visible', y > vh * 0.8 && !nearFooter);

  // jemný parallax obsahu úvodu
  if (heroContent && !reduceMotion && y < vh) {
    heroContent.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
    heroContent.style.opacity = String(clamp(1 - y / (vh * 0.75), 0, 1));
  }

  // parallax vrstvy (data-parallax = rychlost)
  for (const el of parallaxEls) {
    const r = el.parentElement.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) continue;
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    const offset = (r.top + r.height / 2 - vh / 2) * speed;
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  }
}
const requestFrame = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); } };
window.addEventListener('scroll', requestFrame, { passive: true });
window.addEventListener('resize', requestFrame);
onScrollFrame();

/* ---------- Menu přes celou obrazovku ---------- */
const burger = $('.burger');
const mobileMenu = $('#mobileMenu');
function setMenu(open) {
  root.classList.toggle('nav-open', open);
  root.classList.toggle('is-locked', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', t(open ? 'Zavřít menu' : 'Otevřít menu'));
  const lbl = $('.burger__label', burger);
  if (lbl) lbl.textContent = t(open ? 'Zavřít' : 'Menu');
}
burger.addEventListener('click', () => setMenu(!root.classList.contains('nav-open')));
mobileMenu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('nav-open')) setMenu(false); });
refreshers.push(() => setMenu(root.classList.contains('nav-open')));

/* ---------- Úvod: prolínání fotek ---------- */
(function heroSlider() {
  const slides = $$('.hero__slide');
  const capOf = s => (LANG === 'de' ? (s.dataset.captionDe || s.dataset.caption) : s.dataset.caption) || '';
  const dotsBox = $('#heroDots');
  const caption = $('#heroCaption');
  if (!slides.length || !dotsBox) return;
  const DURATION = 6500;
  let current = 0, timer = null;
  dotsBox.style.setProperty('--slide-ms', DURATION + 'ms');

  const dots = slides.map((s, k) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hero__dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', t('Fotografie {k}: {c}', { k: k + 1, c: capOf(s) }));
    b.addEventListener('click', () => { go(k); restart(); });
    dotsBox.appendChild(b);
    return b;
  });

  function go(next) {
    const prev = slides[current];
    if (next !== current) {
      prev.classList.remove('is-active');
      prev.classList.add('is-leaving');
      setTimeout(() => prev.classList.remove('is-leaving'), 1900);
    }
    slides[next].classList.add('is-active');
    dots.forEach((d, k) => {
      d.classList.remove('is-active');
      d.classList.toggle('is-done', k < next);
      d.setAttribute('aria-selected', String(k === next));
    });
    void dots[next].offsetWidth; // restart animace výplně
    dots[next].classList.add('is-active');
    caption.style.opacity = 0;
    setTimeout(() => { caption.textContent = capOf(slides[next]); caption.style.opacity = ''; }, 300);
    current = next;
  }
  function restart() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => go((current + 1) % slides.length), DURATION);
  }
  // další fotky se načtou až po první (rychlejší start)
  window.addEventListener('load', () => $$('.hero__slide img').forEach(img => { img.loading = 'eager'; }));
  go(0);
  restart();
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : restart());
  refreshers.push(() => {
    caption.textContent = capOf(slides[current]);
    dots.forEach((d, k) => d.setAttribute('aria-label', t('Fotografie {k}: {c}', { k: k + 1, c: capOf(slides[k]) })));
  });
})();

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
const observeReveals = (ctx = document) => $$('.reveal:not(.is-visible)', ctx).forEach(el => revealObserver.observe(el));
observeReveals();

/* ---------- Animace čísel ---------- */
function animateNumber(el, from, to, duration = 1800, plain = false) {
  const write = v => { el.textContent = plain ? String(Math.round(v)) : fmt(v); };
  if (reduceMotion || from === to) return write(to);
  const start = performance.now();
  const ease = x => 1 - Math.pow(1 - x, 3);
  (function step(now) {
    const k = clamp((now - start) / duration, 0, 1);
    write(from + (to - from) * ease(k));
    if (k < 1) requestAnimationFrame(step);
  })(start);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    animateNumber(el, Number(el.dataset.from || 0), Number(el.dataset.count), 2000, el.hasAttribute('data-plain'));
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });
$$('[data-count]').forEach(el => {
  if (!reduceMotion) el.textContent = el.hasAttribute('data-plain') ? (el.dataset.from || '0') : '0';
  counterObserver.observe(el);
});

/* ---------- Otevírací doba restaurace: právě otevřeno / zavřeno (čas v Česku) ---------- */
function pragueHour() {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Prague', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const get = type => Number(parts.find(p => p.type === type).value);
    return get('hour') + get('minute') / 60;
  } catch { const d = new Date(); return d.getHours() + d.getMinutes() / 60; }
}
function openStatus() {
  const h = pragueHour();
  const open = h >= OPEN_FROM && h < OPEN_TO;
  $$('[data-open-status]').forEach(box => {
    box.classList.toggle('is-off', !open);
    box.lastElementChild.textContent = t(open ? 'Právě otevřeno – do 22:00' : 'Teď zavřeno – otevíráme v 11:00');
  });
  const badge = $('#openBadge');
  if (badge) {
    badge.textContent = t(open ? 'Restaurace otevřena do 22:00' : h >= OPEN_TO ? 'Restaurace otevírá zítra v 11:00' : 'Restaurace otevírá v 11:00');
  }
}
$('#year').textContent = new Date().getFullYear();
openStatus();
setInterval(openStatus, 60000);
refreshers.push(openStatus);

/* ---------- PROHLÍŽEČ FOTEK (lightbox) – galerie, pokoje, ochutnávky fotek ---------- */
const lb = $('#lightbox');
const lbImg = $('#lbImg');
let lbItems = [];   // [{ f, cs, de }]
let lbIndex = 0;
const lbCap = it => (LANG === 'de' ? (it.de || t(it.cs || '')) : it.cs) || '';
function lbShow(i, animate = true) {
  if (!lbItems.length) return;
  lbIndex = (i + lbItems.length) % lbItems.length;
  const it = lbItems[lbIndex];
  const apply = () => {
    lbImg.src = imgUrl(it.f);
    lbImg.alt = lbCap(it);
    $('#lbCaption').textContent = lbCap(it);
    $('#lbCounter').textContent = `${lbIndex + 1} / ${lbItems.length}`;
    lbImg.classList.remove('is-swapping');
    [lbIndex - 1, lbIndex + 1].forEach(j => { const s = lbItems[(j + lbItems.length) % lbItems.length]; if (s) new Image().src = imgUrl(s.f); });
  };
  if (!animate || reduceMotion) return apply();
  lbImg.classList.add('is-swapping');
  setTimeout(apply, 200);
}
function openLightbox(items, i = 0) {
  lbItems = items;
  lbShow(i, false);
  openDialog(lb);
}
$$('[data-lb-step]', lb).forEach(b => b.addEventListener('click', () => lbShow(lbIndex + Number(b.dataset.lbStep))));
lb.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
});
$('#lbStage').addEventListener('click', e => { if (e.target.id === 'lbStage') closeDialog(lb); });
let touchX = null;
lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});
refreshers.push(() => { if (lb.open) lbShow(lbIndex, false); });

// pokoje: tlačítko s data-photos="a,b,c" a data-title / data-title-de
document.addEventListener('click', e => {
  const b = e.target.closest('[data-photos]');
  if (!b) return;
  const items = b.dataset.photos.split(',').map(f => ({ f: f.trim(), cs: b.dataset.title, de: b.dataset.titleDe }));
  openLightbox(items, 0);
});
// ochutnávky fotek: skupina [data-photo-group] s tlačítky [data-photo]
document.addEventListener('click', e => {
  const b = e.target.closest('[data-photo-group] [data-photo]');
  if (!b) return;
  const all = $$('[data-photo]', b.closest('[data-photo-group]'));
  openLightbox(all.map(x => ({ f: x.dataset.photo, cs: x.dataset.cap, de: x.dataset.capDe })), all.indexOf(b));
});

/* ---------- AKTUALITY: karty + detail (spustí se po načtení data/obsah.json) ---------- */
function initNews() {
  const grid = $('#newsGrid');
  const moreBtn = $('#newsMore');
  const modal = $('#newsModal');
  if (!grid) return;
  const LIMIT = Number(grid.dataset.limit) || 0; // 0 = všechny
  const img = $('#newsModalImg');
  let expanded = false;
  let openIndex = -1;

  function render(instant) {
    if (!NEWS.length) {
      grid.innerHTML = `<p class="news-empty">${t(contentOk ? 'Zatím zde nejsou žádné aktuality.' : 'Obsah se nepodařilo načíst. Zkuste prosím stránku obnovit.')}</p>`;
      if (moreBtn) moreBtn.hidden = true;
      return;
    }
    grid.innerHTML = (LIMIT ? NEWS.slice(0, LIMIT) : NEWS).map((n, k) => {
      const d = parseDate(n.date);
      const hidden = !LIMIT && !expanded && k >= NEWS_INITIAL;
      return `
      <article class="news-card reveal${instant ? ' is-visible' : ''} ${k === 0 && !LIMIT ? 'news-card--featured' : ''}" style="--d:${(k % 3) * 0.08}s" ${hidden ? 'hidden' : ''}>
        <div class="news-card__media">
          <span class="news-card__date"><b>${d.getDate()}</b><span>${monthName(d)} ${d.getFullYear()}</span></span>
          <img src="${esc(thumbUrl(n.img || NEWS_FALLBACK_IMG))}" alt="" loading="lazy" decoding="async">
        </div>
        <div class="news-card__body">
          <span class="tag">${esc(L(n, 'tag'))}</span>
          <h3 class="news-card__title">${esc(L(n, 'title'))}</h3>
          <p class="news-card__excerpt">${esc(L(n, 'excerpt'))}</p>
          <button class="link-arrow news-card__more" type="button" data-news="${k}">${t('Číst více')} ${icon('i-arrow')}</button>
        </div>
      </article>`;
    }).join('');
    if (!instant) observeReveals(grid);
    const hiddenCount = expanded ? 0 : Math.max(0, NEWS.length - NEWS_INITIAL);
    if (moreBtn) {
      moreBtn.hidden = LIMIT > 0 || !hiddenCount;
      moreBtn.firstChild.textContent = `${t('Zobrazit starší aktuality')} (${hiddenCount}) `;
    }
  }
  render(false);

  if (moreBtn) moreBtn.addEventListener('click', () => {
    expanded = true;
    $$('.news-card[hidden]', grid).forEach((c, i) => {
      c.hidden = false;
      c.classList.remove('is-visible');
      c.style.setProperty('--d', (i * 0.1) + 's');
      requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('is-visible')));
    });
    moreBtn.hidden = true;
  });

  function fillNews(k) {
    const n = NEWS[k];
    openIndex = k;
    $('#newsModalTitle').textContent = L(n, 'title');
    $('#newsModalTag').textContent = L(n, 'tag');
    const time = $('#newsModalDate');
    time.textContent = czDate(n.date);
    time.dateTime = n.date;
    $('#newsModalText').innerHTML = richText(L(n, 'body'));
    img.src = imgUrl(n.img || NEWS_FALLBACK_IMG);
    img.alt = L(n, 'title');
    const cta = n.cta;
    const href = cta ? langHref(safeHref(cta.href)) : '';
    const ext = /^https?:/i.test(href);
    const ctaIcon = /^mailto:/i.test(href) ? 'i-mail' : /^tel:/i.test(href) ? 'i-phone' : ext ? 'i-external' : 'i-arrow';
    $('#newsModalCta').innerHTML = href && cta.label
      ? `<a class="btn btn--dark" href="${esc(href)}" ${ext ? 'target="_blank" rel="noopener"' : ''}>${icon(ctaIcon)} ${esc(LANG === 'de' && cta.labelDe ? cta.labelDe : cta.label)}</a>`
      : '';
  }
  function openNews(k) {
    fillNews(k);
    openDialog(modal);
    $('.modal__scroll', modal).scrollTop = 0;
  }
  modal.addEventListener('close', () => { openIndex = -1; });
  grid.addEventListener('click', e => { const b = e.target.closest('[data-news]'); if (b) openNews(Number(b.dataset.news)); });
  refreshers.push(() => { render(true); if (modal.open && openIndex >= 0) fillNews(openIndex); });
}

/* ---------- FOTOGALERIE: mřížka + filtry (prohlížeč je společný) ---------- */
function initGallery() {
  const wrap = $('#gallery');
  if (!wrap) return;
  let visible = [];
  const capOf = g => (LANG === 'de' ? (g.tDe || g.t) : g.t) || '';
  wrap.innerHTML = GALLERY.map((g, k) => `
    <figure class="g-item ${g.w / g.h > 2.2 ? 'is-pano' : ''}" data-cat="${esc(g.cat || '')}" data-k="${k}" tabindex="0" role="button">
      <img src="${esc(thumbUrl(g.f))}" alt="" width="${g.w}" height="${g.h}" loading="lazy" decoding="async">
      <figcaption><span></span>${icon('i-zoom')}</figcaption>
    </figure>`).join('');

  function labelGallery() {
    $$('.g-item', wrap).forEach(fig => {
      const caption = capOf(GALLERY[Number(fig.dataset.k)]);
      fig.setAttribute('aria-label', t('Zvětšit: {x}', { x: caption }));
      fig.querySelector('img').alt = caption;
      fig.querySelector('figcaption span').textContent = caption;
    });
  }
  labelGallery();
  $$('.g-item img', wrap).forEach(im => {
    const done = () => im.parentElement.classList.add('is-loaded');
    im.complete && im.naturalWidth ? done() : im.addEventListener('load', done, { once: true });
    im.addEventListener('error', done, { once: true });
  });

  // na telefonu nejdřív jen PHONE_LIMIT fotek, zbytek po kliknutí (prohlížeč ukazuje všechny)
  const PHONE_LIMIT = 12;
  const moreBtn = $('#galleryMore');
  let showAll = false;
  function applyLimit() {
    const limited = !showAll && visible.length > PHONE_LIMIT;
    wrap.classList.toggle('is-limited', limited);
    visible.forEach((item, i) => item.classList.toggle('is-over', i >= PHONE_LIMIT));
    moreBtn.hidden = !limited;
    moreBtn.textContent = `${t('Zobrazit všechny fotky')} (${visible.length})`;
  }
  function updateVisible() { visible = $$('.g-item:not([hidden])', wrap); applyLimit(); }
  moreBtn.addEventListener('click', () => { showAll = true; applyLimit(); });

  function filter(cat, animate = true) {
    $$('#galleryFilters [data-cat]').forEach(c => c.classList.toggle('is-active', c.dataset.cat === cat));
    let n = 0;
    $$('.g-item', wrap).forEach(item => {
      const show = cat === 'all' || item.dataset.cat === cat;
      item.hidden = !show;
      item.classList.remove('is-entering');
      if (show && animate && !reduceMotion) {
        item.style.setProperty('--d', Math.min(n++, 12) * 0.05 + 's');
        void item.offsetWidth;
        item.classList.add('is-entering');
      }
    });
    updateVisible();
  }
  $('#galleryFilters').addEventListener('click', e => {
    const chip = e.target.closest('[data-cat]');
    if (chip) filter(chip.dataset.cat);
  });
  // odkaz fotogalerie.html?kat=jidlo otevře rovnou kategorii
  let startCat = 'all';
  try { startCat = new URLSearchParams(location.search).get('kat') || 'all'; } catch { /* file:// */ }
  filter($(`#galleryFilters [data-cat="${CSS.escape(startCat)}"]`) ? startCat : 'all', false);

  const openAt = item => {
    updateVisible();
    const items = visible.map(fig => { const g = GALLERY[Number(fig.dataset.k)]; return { f: g.f, cs: g.t, de: g.tDe }; });
    openLightbox(items, visible.indexOf(item));
  };
  wrap.addEventListener('click', e => { const it = e.target.closest('.g-item'); if (it) openAt(it); });
  wrap.addEventListener('keydown', e => {
    const it = e.target.closest('.g-item');
    if (it && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openAt(it); }
  });
  refreshers.push(() => { labelGallery(); applyLimit(); });
}

/* ---------- SNĚŽENÍ v zimní sekci (stránka Okolí, canvas) ---------- */
(function snow() {
  const canvas = $('#snow');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, flakes = [], raf = null;
  const make = anywhere => ({
    x: Math.random() * w, y: anywhere ? Math.random() * h : -10,
    r: Math.random() * 2.4 + 0.6, s: Math.random() * 0.7 + 0.35,
    d: Math.random() * Math.PI * 2, o: Math.random() * 0.5 + 0.35
  });
  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    flakes = Array.from({ length: Math.round(clamp(w / 9, 40, 150)) }, () => make(true));
  }
  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const f of flakes) {
      f.d += 0.012; f.y += f.s; f.x += Math.sin(f.d) * 0.45;
      if (f.y > h + 6) Object.assign(f, make(false));
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.o})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !raf) { if (!w) resize(); tick(); }
    else if (!entry.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
  }).observe(canvas);
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
})();

/* ---------- POPTÁVKA – formulář připraví e-mail (web nic neodesílá, funguje i na GitHub Pages) ---------- */
(function inquiry() {
  const card = $('#poptavka');
  const form = $('#inquiryForm');
  if (!form) return;
  const select = $('#if-type');
  try {
    const want = new URLSearchParams(location.search).get('poptavka');
    if (want && $(`option[value="${CSS.escape(want)}"]`, select)) select.value = want;
  } catch { /* file:// */ }
  const name = $('#if-name');
  name.addEventListener('invalid', () => name.setCustomValidity(name.validity.valueMissing ? t('Vyplňte prosím toto pole.') : ''));
  name.addEventListener('input', () => name.setCustomValidity(''));
  refreshers.push(() => name.setCustomValidity(''));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const opt = select.options[select.selectedIndex];
    const typeLabel = LANG === 'de' ? (opt.dataset.de || opt.text) : opt.text;
    const val = id => $('#' + id).value.trim();
    const rows = [
      [t('Mám zájem o'), typeLabel], [t('Jméno'), val('if-name')], [t('Telefon'), val('if-phone')],
      [t('Termín'), val('if-date')], [t('Počet osob'), val('if-people')],
    ].filter(r => r[1]).map(r => `${r[0]}: ${r[1]}`);
    const msg = val('if-msg');
    const body = [t('Dobrý den,'), '', t('posílám nezávaznou poptávku z webu:'), '', ...rows, ...(msg ? ['', `${t('Zpráva')}:`, msg] : []), '', t('Děkuji.'), val('if-name')].join('\n');
    const subject = `${t('Poptávka')}: ${typeLabel}`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    card.classList.add('is-sent');
  });
  $('#formReset').addEventListener('click', () => { card.classList.remove('is-sent'); form.reset(); });
})();

/* ---------- MAPA – iframe Google se vloží až po kliknutí ---------- */
const mapSrc = () => 'https://maps.google.com/maps?q=Kru%C5%A1nohorsk%C3%BD%20Dv%C5%AFr%2C%20C%C3%ADnovec%20275&z=14&output=embed&hl=' + (LANG === 'de' ? 'de' : 'cs');
refreshers.push(() => {
  const frame = $('#mapEmbed iframe');
  if (frame) { frame.src = mapSrc(); frame.title = t('Mapa – Krušnohorský Dvůr, Cínovec 275'); }
});
if ($('#mapLoad')) $('#mapLoad').addEventListener('click', () => {
  const frame = document.createElement('iframe');
  frame.title = t('Mapa – Krušnohorský Dvůr, Cínovec 275');
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  frame.src = mapSrc();
  $('#mapEmbed .map-consent').replaceWith(frame);
});

/* ---------- ZÁSADY OCHRANY OSOBNÍCH ÚDAJŮ ---------- */
const privacyModal = $('#privacyModal');
document.addEventListener('click', e => {
  if (!e.target.closest('[data-open-privacy]')) return;
  e.preventDefault();
  openDialog(privacyModal);
  $('.modal__scroll', privacyModal).scrollTop = 0;
});

/* ---------- JAZYKOVÁ VERZE CZ / DE ----------
   1) Statické texty se při startu uloží (česky). Při přepnutí se použije překlad
      z atributu data-de rodičovského prvku, jinak slovník DE.
   2) Atributy: alt → data-alt-de, ostatní (aria-label, title, placeholder) přes slovník.
   3) Části vykreslované skriptem (aktuality, galerie, otevírací doba…) se znovu
      vykreslí přes funkce v poli refreshers.
   Volba jazyka se pamatuje v prohlížeči; odkaz s ?lang=de otevře rovnou němčinu. */
const I18N_SKIP = [
  'script', 'style', 'svg', 'code', '[data-i18n-skip]',
  '.burger__label', '.hero__slides', '[data-count]', '#openBadge', '[data-open-status]',
  '#galleryMore', '#heroCaption', '#heroDots', '#newsGrid', '#newsMore', '#newsModal .modal__body',
  '#gallery', '#lbCounter', '#lbCaption', '#toasts'
].join(', ');
const I18N_ATTRS = ['aria-label', 'placeholder', 'alt', 'title'];
const i18nTexts = [];
const i18nAttrs = [];
const metaDesc = $('meta[name="description"]');
const META = { title: document.title, desc: metaDesc.content, titleDe: root.dataset.titleDe, descDe: root.dataset.descDe };
const ringText = $('#ringText');
const RING_CS = ringText ? ringText.textContent : '';

(function captureI18n() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!/[A-Za-zÀ-ž]/.test(node.textContent) || node.parentElement.closest(I18N_SKIP)) continue;
    i18nTexts.push({ node, cs: node.textContent, de: node.parentElement.dataset.de });
  }
  $$(I18N_ATTRS.map(a => `[${a}]`).join(', ')).forEach(el => {
    if (el.closest(I18N_SKIP)) return;
    I18N_ATTRS.forEach(a => {
      if (!el.hasAttribute(a) || !el.getAttribute(a)) return;
      i18nAttrs.push({ el, a, cs: el.getAttribute(a), de: el.getAttribute(`data-${a}-de`) || undefined });
    });
  });
})();

// přeloží text uzlu a zachová mezery kolem něj
function translateNode(cs, own) {
  const m = cs.match(/^(\s*)([\s\S]*?)(\s*)$/);
  return m[1] + (own !== undefined ? own : t(m[2])) + m[3];
}

function setLang(lang, remember = true) {
  LANG = lang === 'de' ? 'de' : 'cs';
  root.lang = LANG;
  i18nTexts.forEach(({ node, cs, de }) => { node.textContent = LANG === 'de' ? translateNode(cs, de) : cs; });
  i18nAttrs.forEach(({ el, a, cs, de }) => el.setAttribute(a, LANG === 'de' ? (de !== undefined ? de : t(cs)) : cs));
  document.title = LANG === 'de' && META.titleDe ? META.titleDe : META.title;
  metaDesc.content = LANG === 'de' && META.descDe ? META.descDe : META.desc;
  if (ringText) ringText.textContent = LANG === 'de' && ringText.dataset.de ? ringText.dataset.de : RING_CS;
  // odkazy s německou variantou (rezervace v němčině…)
  $$('[data-href-de]').forEach(a => {
    if (!a.dataset.hrefCs) a.dataset.hrefCs = a.getAttribute('href');
    a.setAttribute('href', LANG === 'de' ? a.dataset.hrefDe : a.dataset.hrefCs);
  });
  // odkazy na další stránky webu si v němčině nesou ?lang=de
  $$('a[href]:not([data-href-de])').forEach(a => {
    if (a.dataset.hrefBase === undefined) a.dataset.hrefBase = a.getAttribute('href');
    a.setAttribute('href', langHref(a.dataset.hrefBase));
  });
  $$('.lang [data-lang]').forEach(b => {
    const on = b.dataset.lang === LANG;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  refreshers.forEach(fn => fn());
  if (remember) {
    try { localStorage.setItem('kd-lang', LANG); } catch { /* bez úložiště */ }
    try {
      const url = new URL(location.href);
      if (LANG === 'de') url.searchParams.set('lang', 'de'); else url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    } catch { /* např. file:// */ }
  }
}

document.addEventListener('click', e => {
  const b = e.target.closest('.lang [data-lang]');
  if (b && b.dataset.lang !== LANG) setLang(b.dataset.lang);
});

// výchozí jazyk: ?lang=de v adrese, jinak poslední volba v prohlížeči
let startLang = 'cs';
try { startLang = new URLSearchParams(location.search).get('lang') || localStorage.getItem('kd-lang') || 'cs'; } catch { /* bez úložiště */ }
if (startLang === 'de') setLang('de', false);
root.classList.remove('lang-pending'); // stránka se ukáže až v cílovém jazyce (viz _hlava.html)

// aktuality a fotogalerie – vykreslí se, až dorazí data/obsah.json (už ve zvoleném jazyce)
await contentReady;
initNews();
initGallery();

})();
