// Animations d'entrée. Sans ce script, la page s'affiche complète et immobile.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // Apparition des blocs au défilement, une seule fois
  const blocks = document.querySelectorAll('[data-reveal]');
  if (reduced || !hasIO) {
    blocks.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    blocks.forEach((el) => io.observe(el));
  }

  // Indicateurs : chaque chiffre défile jusqu'à sa valeur ; le texte réel reste lu par les lecteurs d'écran
  const figures = [...document.querySelectorAll('[data-roll]')];
  figures.forEach((el) => {
    const value = el.textContent.trim();
    const said = Object.assign(document.createElement('span'), { className: 'sr-only', textContent: value });
    const shown = Object.assign(document.createElement('span'), { className: 'roll__digits' });
    shown.setAttribute('aria-hidden', 'true');
    let i = 0;
    for (const ch of value) {
      if (!/\d/.test(ch)) { shown.append(ch); continue; }
      const col = Object.assign(document.createElement('span'), { className: 'roll__col' });
      const strip = Object.assign(document.createElement('span'), { className: 'roll__strip' });
      strip.style.setProperty('--d', ch);
      strip.style.setProperty('--i', i++);
      for (let n = 0; n < 10; n++) strip.append(Object.assign(document.createElement('span'), { textContent: n }));
      col.append(strip);
      shown.append(col);
    }
    el.classList.add('roll');
    el.replaceChildren(said, shown);
  });
  if (reduced || !hasIO) { figures.forEach((el) => el.classList.add('is-in')); return; }
  const io2 = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io2.unobserve(e.target); }
  }, { rootMargin: '0px 0px -15% 0px' });
  figures.forEach((el) => io2.observe(el));
});
