/* =================================================================
   Oldtimer-Radio.de  —  main.js
   Wird auf JEDER Seite geladen. Stellt bereit:
   - zentrale Produktdaten (PRODUCTS)
   - Warenkorb mit localStorage (auf allen Seiten gleich)
   - Tag/Nacht-Umschalter (gemerkt)
   - mobile Navigation, Scroll-Reveal, Sterne, Parallax, Zähler
   shop.js baut darauf auf (nutzt PRODUCTS, renderProducts, addToCart).
   ================================================================= */

/* ---------- Zentrale Produktdaten ----------
   Eine einzige Quelle: Startseite und Shop rendern daraus. So bleiben
   Name und Preis im Warenkorb immer korrekt, egal von welcher Seite. */
const PRODUCTS = [
  { id: 'becker-mexico',   brand: 'Becker',     name: 'Mexico 7945',     price: 289, cat: 'radio',     tag: 'Klassiker', tagGold: true,  freq: '102.5', desc: 'Legendäres Becker-Radio mit warmem Röhrenklang. Geprüft und spielbereit.' },
  { id: 'blaupunkt-ffm',   brand: 'Blaupunkt',  name: 'Frankfurt',       price: 229, cat: 'radio',     tag: 'Beliebt',                   freq: '98.4',  desc: 'Der Allrounder der 60er. Voller Klang, originale Skala, top erhalten.' },
  { id: 'telefunken-tn',   brand: 'Telefunken', name: 'Bajazzo TS',      price: 199, cat: 'radio',                                       freq: '94.2',  desc: 'Charaktervolles Radio mit Geschichte. Liebevoll aufgearbeitet.' },
  { id: 'becker-grandp',   brand: 'Becker',     name: 'Grand Prix',      price: 349, cat: 'radio',     tag: 'Rar',       tagGold: true,  freq: '101.1', desc: 'Selten und gesucht — ein Schmuckstück fürs gehobene Cabrio.' },
  { id: 'blende-rund',     brand: 'Universal',  name: 'Chrom-Blende rund',price: 39,  cat: 'blende',                                      freq: '—',     desc: 'Originalgetreue Blende in glänzendem Chrom. Passt zu vielen Modellen.' },
  { id: 'blende-eckig',    brand: 'Universal',  name: 'Blende eckig',    price: 34,  cat: 'blende',                                       freq: '—',     desc: 'Klassische eckige Blende, passgenau und sauber verarbeitet.' },
  { id: 'knopf-set',       brand: 'Universal',  name: 'Drehknopf-Set',   price: 24,  cat: 'ersatzteil', tag: 'Set',                       freq: '—',     desc: 'Zwei gerändelte Drehknöpfe im Stil der Zeit. Schwarz/Chrom.' },
  { id: 'tasten-set',      brand: 'Universal',  name: 'Stationstasten',  price: 18,  cat: 'ersatzteil',                                   freq: '—',     desc: 'Ersatztasten für die Senderwahl. Federleicht und präzise.' },
  { id: 'skala-glas',      brand: 'Universal',  name: 'Skalenglas',      price: 29,  cat: 'ersatzteil',                                   freq: '—',     desc: 'Klares Skalenglas als Ersatz für trübe oder gesprungene Originale.' },
  { id: 'wandler-6-12',    brand: 'Zubehör',    name: 'Spannungswandler 6V→12V', price: 49, cat: 'zubehoer', tag: 'Top',                  freq: '—',     desc: 'Betreibt dein 6V-Radio sauber im 12V-Bordnetz. Kompakt und stabil.' },
  { id: 'antenne-tele',    brand: 'Zubehör',    name: 'Teleskop-Antenne',price: 32,  cat: 'zubehoer',                                     freq: '—',     desc: 'Verchromte Antenne im Originallook. Voll ausziehbar.' },
  { id: 'lautsprecher',    brand: 'Zubehör',    name: 'Oval-Lautsprecher',price: 44, cat: 'zubehoer',                                     freq: '—',     desc: 'Passender ovaler Lautsprecher für klaren, warmen Ton.' }
];

const CATEGORIES = [
  { key: 'all',       label: 'Alle' },
  { key: 'radio',     label: 'Radios' },
  { key: 'blende',    label: 'Blenden' },
  { key: 'ersatzteil',label: 'Ersatzteile' },
  { key: 'zubehoer',  label: 'Zubehör' }
];

const euro = (n) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const productById = (id) => PRODUCTS.find((p) => p.id === id);

/* ===================== WARENKORB ===================== */
const CART_KEY = 'or_cart_v1';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

let cart = loadCart();   // Form: { productId: quantity }

function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }
function cartTotal() { return Object.entries(cart).reduce((sum, [id, q]) => sum + (productById(id)?.price || 0) * q, 0); }

function addToCart(id, qty = 1) {
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
  syncCartUI();
  showToast(`„${productById(id).name}" im Warenkorb`);
}
function setQty(id, qty) {
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart(cart);
  syncCartUI();
}
function removeFromCart(id) { delete cart[id]; saveCart(cart); syncCartUI(); }

/* Aktualisiert Badge, Schubladen-Inhalt und Summe überall auf der Seite */
function syncCartUI() {
  const count = cartCount();
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('is-visible', count > 0);
  }
  const total = document.getElementById('cartTotal');
  if (total) total.textContent = euro(cartTotal());

  const wrap = document.getElementById('drawerItems');
  if (!wrap) return;

  const ids = Object.keys(cart);
  if (ids.length === 0) {
    wrap.innerHTML = `<div class="drawer__empty"><span class="big">🛒</span>Dein Warenkorb ist noch leer.<br>Stöber doch im <a href="shop.html">Radio-Shop</a>.</div>`;
    return;
  }
  wrap.innerHTML = ids.map((id) => {
    const p = productById(id); const q = cart[id];
    return `
      <div class="cart-item">
        <div class="cart-item__thumb">📻</div>
        <div>
          <div class="cart-item__name">${p.name}</div>
          <div class="cart-item__price">${euro(p.price)}</div>
          <div class="qty">
            <button data-act="dec" data-id="${id}" aria-label="weniger">−</button>
            <span>${q}</span>
            <button data-act="inc" data-id="${id}" aria-label="mehr">+</button>
          </div>
        </div>
        <button class="cart-item__remove" data-act="rm" data-id="${id}" aria-label="entfernen">🗑️</button>
      </div>`;
  }).join('');
}

/* Klicks in der Schublade (Mengen ändern / entfernen) */
function wireDrawerActions() {
  const wrap = document.getElementById('drawerItems');
  if (!wrap) return;
  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.act === 'inc') setQty(id, (cart[id] || 0) + 1);
    if (btn.dataset.act === 'dec') setQty(id, (cart[id] || 0) - 1);
    if (btn.dataset.act === 'rm')  removeFromCart(id);
  });
}

/* Schublade öffnen/schließen */
function openDrawer()  { document.getElementById('drawer')?.classList.add('is-open'); document.getElementById('drawerBackdrop')?.classList.add('is-open'); }
function closeDrawer() { document.getElementById('drawer')?.classList.remove('is-open'); document.getElementById('drawerBackdrop')?.classList.remove('is-open'); }

function wireCart() {
  document.getElementById('cartBtn')?.addEventListener('click', openDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', closeDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cartCount() === 0) { showToast('Dein Warenkorb ist leer.'); return; }
    showToast('Danke! Das ist ein Demo — keine echte Bestellung.', 2600);
    cart = {}; saveCart(cart); syncCartUI();
    setTimeout(closeDrawer, 600);
  });

  // "In den Warenkorb"-Buttons (per Delegation, funktioniert auch für nachgerenderte Karten)
  document.addEventListener('click', (e) => {
    const add = e.target.closest('.add');
    if (!add) return;
    addToCart(add.dataset.id);
    add.classList.add('added');
    add.textContent = '✓ Hinzugefügt';
    setTimeout(() => { add.classList.remove('added'); add.textContent = 'In den Warenkorb'; }, 1300);
  });
}

/* ===================== PRODUKTKARTEN ===================== */
/* Baut HTML für eine Karte. Statt Fotos zeigen wir ein stilisiertes
   CSS-Autoradio mit „Sender"-Display — passt zum Thema und braucht keine Bilder. */
function productCard(p) {
  const tag = p.tag ? `<span class="product__tag ${p.tagGold ? 'product__tag--gold' : ''}">${p.tag}</span>` : '';
  return `
    <article class="product reveal">
      <div class="product__media">
        ${tag}
        <div class="radio-face">
          <span class="knob"></span>
          <span class="screen">${p.freq !== '—' ? p.freq + ' FM' : p.brand}</span>
          <span class="knob"></span>
        </div>
      </div>
      <div class="product__body">
        <span class="product__brand">${p.brand}</span>
        <h3 class="product__name">${p.name}</h3>
        <p class="product__desc">${p.desc}</p>
        <div class="product__foot">
          <span class="product__price">${euro(p.price)}<small>inkl. MwSt.</small></span>
        </div>
        <button class="btn add" data-id="${p.id}">In den Warenkorb</button>
      </div>
    </article>`;
}
function renderProducts(container, list) {
  if (!container) return;
  container.innerHTML = list.map(productCard).join('');
  revealObserve(container.querySelectorAll('.reveal'));   // neue Karten animieren
}

/* ===================== TAG / NACHT ===================== */
const THEME_KEY = 'or_theme';
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const knob = document.getElementById('themeKnob');
  if (knob) knob.textContent = theme === 'night' ? '🌙' : '☀️';
}
function initTheme() {
  // gespeicherte Wahl > Systemeinstellung > Tag
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'night' : 'day'));

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'night' ? 'day' : 'night';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

/* ===================== NAVIGATION ===================== */
function initNav() {
  const nav = document.getElementById('nav');
  document.getElementById('navToggle')?.addEventListener('click', () => nav.classList.toggle('is-open'));
  // Menü auf Mobil schließen, wenn ein Link geklickt wird
  document.querySelectorAll('#navLinks a').forEach((a) =>
    a.addEventListener('click', () => nav.classList.remove('is-open')));

  // aktiven Link anhand des Dateinamens markieren
  const file = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navLinks a').forEach((a) => {
    const href = a.getAttribute('href');
    a.classList.toggle('is-active', href === file || (file === '' && href === 'index.html'));
  });
}

/* ===================== SCROLL-REVEAL ===================== */
let revealObserver;
function revealObserve(nodes) {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('reveal-in'); revealObserver.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
  }
  nodes.forEach((n) => revealObserver.observe(n));
}

/* ===================== STAT-ZÄHLER ===================== */
function animateCount(el) {
  const target = +el.dataset.count;
  const dur = 1400; const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);           // sanftes Auslaufen
    el.textContent = Math.round(target * eased).toLocaleString('de-DE');
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { animateCount(en.target); obs.unobserve(en.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => obs.observe(el));
}

/* ===================== STERNE (Nachthimmel) ===================== */
function initStars() {
  const box = document.getElementById('stars');
  if (!box) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 70; i++) {
    const s = document.createElement('span');
    const size = Math.random() * 2 + 1;
    Object.assign(s.style, {
      position: 'absolute',
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      width: size + 'px', height: size + 'px',
      borderRadius: '50%', background: '#fff',
      animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`
    });
    frag.appendChild(s);
  }
  box.appendChild(frag);
}

/* ===================== PARALLAX im Hero =====================
   Bewegt Auto-Bühne und Himmelskörper beim Scrollen unterschiedlich
   schnell -> Tiefenwirkung. Läuft auf der Bühne, nicht auf den Autos,
   damit es nicht mit deren Animation kollidiert. */
function initParallax() {
  const stage = document.querySelector('.hero__stage');
  const sky   = document.getElementById('celestial');
  if (!stage && !sky) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (stage) stage.style.transform = `translateY(${y * 0.18}px)`;
      if (sky)   sky.style.transform   = `translateY(${y * 0.32}px)`;
      ticking = false;
    });
  }, { passive: true });
}

/* ===================== FORMULARE (Demo) =====================
   Kein echter Versand. Bei gültiger Eingabe zeigen wir eine
   Bestätigung (.form__ok) und setzen das Formular zurück. */
function initForms() {
  document.querySelectorAll('form.form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const ok = form.querySelector('.form__ok');
      if (ok) ok.classList.add('is-visible');
      form.reset();
      showToast('Danke! (Demo — es wird nichts versendet.)');
    });
  });
}

/* ===================== TOAST ===================== */
let toastTimer;
function showToast(msg, ms = 1800) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), ms);
}

/* ===================== START ===================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initStars();
  initParallax();
  initCounters();
  wireCart();
  wireDrawerActions();
  initForms();
  syncCartUI();

  revealObserve(document.querySelectorAll('.reveal'));

  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Startseite: Auswahl beliebter Produkte einsetzen
  const featured = document.getElementById('featuredGrid');
  if (featured) renderProducts(featured, PRODUCTS.filter((p) => p.cat === 'radio'));
});
