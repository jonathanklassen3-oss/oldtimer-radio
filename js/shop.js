/* =================================================================
   Oldtimer-Radio.de  —  shop.js
   Läuft nur auf shop.html. Baut die Filter-Chips und rendert das
   Produktgitter. Nutzt PRODUCTS, CATEGORIES und renderProducts aus
   main.js (wird davor geladen, daher hier verfügbar).
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const bar  = document.getElementById('filterBar');
  const grid = document.getElementById('shopGrid');
  if (!bar || !grid) return;

  let activeCat = 'all';

  // Filter-Chips aus den Kategorien bauen
  bar.innerHTML = CATEGORIES.map((c) =>
    `<button class="chip ${c.key === 'all' ? 'is-active' : ''}" data-cat="${c.key}">${c.label}</button>`
  ).join('');

  function show(cat) {
    activeCat = cat;
    const list = cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);
    renderProducts(grid, list);
    bar.querySelectorAll('.chip').forEach((ch) =>
      ch.classList.toggle('is-active', ch.dataset.cat === cat));
  }

  bar.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip) show(chip.dataset.cat);
  });

  show('all');   // Start: alles zeigen
});
