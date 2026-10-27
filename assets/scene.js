// Scène Wazuh : le schéma se construit en 5 étapes, piloté par le défilement (GSAP + ScrollTrigger).
// Sans GSAP, sans script ou avec « réduire les animations », le schéma reste complet et statique.
document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('.scene');
  if (!scene || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const svg = scene.querySelector('.scene-svg');
  const steps = [...scene.querySelectorAll('.scene-step')];
  const count = scene.querySelector('.scene-count');
  const countText = count.textContent; // « Étape 1 sur 5 » / « Step 1 of 5 »
  const q = (s) => svg.querySelectorAll(s);

  const mm = gsap.matchMedia();
  // Sur téléphone, le schéma serait illisible une fois réduit : il reste statique et se fait défiler au doigt
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 56rem)', () => {
    scene.classList.add('is-live');

    // Traits « dessinés » : on masque chaque ligne par un tiret de sa propre longueur
    q('.draw:not(.rmm-link)').forEach((el) => {
      const len = Math.hypot(el.x2.baseVal.value - el.x1.baseVal.value, el.y2.baseVal.value - el.y1.baseVal.value);
      gsap.set(el, { attr: { 'stroke-dasharray': `${len} ${len}` }, strokeDashoffset: len });
    });
    gsap.set(q('.site'), { opacity: 0.25 });
    gsap.set([q('.rmm'), q('.rmm-link'), q('.wan'), q('.cluster'), q('.outputs'), q('.total')], { opacity: 0 });
    gsap.set(q('.agent'), { scale: 0, transformOrigin: '50% 50%' });

    const setStep = (i) => {
      steps.forEach((el, k) => el.classList.toggle('is-active', k === i));
      count.textContent = countText.replace(/\d+/, String(i + 1));
    };
    setStep(0);

    const packets = q('.packet');
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    // 1. Les sites
    tl.to(q('.site'), { opacity: 1, stagger: 0.25, duration: 0.6 }, 0)
      .to(q('.total'), { opacity: 1, duration: 0.5 }, 0.8)
    // 2. Le RMM déploie les agents
      .to(q('.rmm'), { opacity: 1, duration: 0.5 }, 2)
      .to(q('.rmm-link'), { opacity: 1, stagger: 0.15, duration: 0.6 }, 2.3)
      .to(q('.agent'), { scale: 1, stagger: 0.03, duration: 0.3 }, 2.9)
    // 3. Remontée via le WAN
      .to(q('.wan'), { opacity: 1, duration: 0.5 }, 4)
      .to(q('.wan-link'), { strokeDashoffset: 0, stagger: 0.1, duration: 0.6 }, 4.2)
      .set(packets, { opacity: 1 }, 4.9)
      .to(packets, { attr: { cx: 414, cy: 320 }, stagger: 0.08, duration: 0.8 }, 4.9)
    // 4. Le serveur Wazuh sur vSphere/vSAN
      .to(q('.cluster'), { opacity: 1, duration: 0.6 }, 6)
      .to(q('.core-link'), { strokeDashoffset: 0, duration: 0.5 }, 6.4)
      .to(packets, { attr: { cx: 730, cy: 285 }, stagger: 0.08, duration: 0.8 }, 6.8)
      .to(packets, { opacity: 0, duration: 0.2 }, 7.7)
    // 5. Vulnérabilités et alertes
      .to(q('.out-link'), { strokeDashoffset: 0, duration: 0.5 }, 8)
      .to(q('.outputs'), { opacity: 1, duration: 0.6 }, 8.4)
      .to({}, { duration: 0.6 }, 9.4); // un temps d'arrêt sur le schéma complet

    const st = ScrollTrigger.create({
      trigger: scene.querySelector('.scene-stage'),
      start: 'top 96px', // sous l'en-tête collant
      end: () => `+=${Math.round(innerHeight * 3)}`,
      pin: true,
      scrub: true,
      animation: tl,
      invalidateOnRefresh: true,
      onUpdate: (self) => setStep(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))),
    });

    return () => { st.kill(); tl.kill(); scene.classList.remove('is-live'); steps.forEach((el) => el.classList.remove('is-active')); count.textContent = countText; };
  });
});
