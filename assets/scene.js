// Scènes animées au défilement (GSAP + ScrollTrigger) : chaque .scene se construit étape par étape.
// Sans GSAP, sans script ou avec « réduire les animations », chaque schéma reste complet et statique.
// Le builder est choisi par l'attribut data-scene (défaut : wazuh).
document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  const scenes = [...document.querySelectorAll('.scene')];
  if (!scenes.length) return;
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();
  // Sur téléphone, les schémas seraient illisibles une fois réduits : ils restent statiques et se font défiler au doigt
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 56rem)', () => {
    const cleanups = scenes.map(initScene).filter(Boolean);
    return () => cleanups.forEach((fn) => fn());
  });

  function initScene(scene) {
    const svg = scene.querySelector('.scene-svg');
    const steps = [...scene.querySelectorAll('.scene-step')];
    const count = scene.querySelector('.scene-count');
    if (!svg || !steps.length || !count) return null;
    const countText = count.textContent; // « Étape 1 sur 5 » / « Step 1 of 5 »
    const q = (s) => svg.querySelectorAll(s);
    scene.classList.add('is-live');

    // Traits « dessinés » : on masque chaque ligne par un tiret de sa propre longueur
    q('.draw:not(.rmm-link)').forEach((el) => {
      const len = Math.hypot(el.x2.baseVal.value - el.x1.baseVal.value, el.y2.baseVal.value - el.y1.baseVal.value);
      gsap.set(el, { attr: { 'stroke-dasharray': `${len} ${len}` }, strokeDashoffset: len });
    });

    const tl = (scene.dataset.scene === 'ad' ? buildAd : buildWazuh)(q);

    const setStep = (i) => {
      steps.forEach((el, k) => el.classList.toggle('is-active', k === i));
      count.textContent = countText.replace(/\d+/, String(i + 1));
    };
    setStep(0);

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
  }

  // Scène Wazuh : les 4 sites, le déploiement RMM, la remontée WAN, le serveur vSphere, les sorties.
  function buildWazuh(q) {
    gsap.set(q('.site'), { opacity: 0.25 });
    gsap.set([q('.rmm'), q('.rmm-link'), q('.wan'), q('.cluster'), q('.outputs'), q('.total')], { opacity: 0 });
    gsap.set(q('.agent'), { scale: 0, transformOrigin: '50% 50%' });

    const packets = q('.packet');
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to(q('.site'), { opacity: 1, stagger: 0.25, duration: 0.6 }, 0)
      .to(q('.total'), { opacity: 1, duration: 0.5 }, 0.8)
      .to(q('.rmm'), { opacity: 1, duration: 0.5 }, 2)
      .to(q('.rmm-link'), { opacity: 1, stagger: 0.15, duration: 0.6 }, 2.3)
      .to(q('.agent'), { scale: 1, stagger: 0.03, duration: 0.3 }, 2.9)
      .to(q('.wan'), { opacity: 1, duration: 0.5 }, 4)
      .to(q('.wan-link'), { strokeDashoffset: 0, stagger: 0.1, duration: 0.6 }, 4.2)
      .set(packets, { opacity: 1 }, 4.9)
      .to(packets, { attr: { cx: 414, cy: 320 }, stagger: 0.08, duration: 0.8 }, 4.9)
      .to(q('.cluster'), { opacity: 1, duration: 0.6 }, 6)
      .to(q('.core-link'), { strokeDashoffset: 0, duration: 0.5 }, 6.4)
      .to(packets, { attr: { cx: 730, cy: 285 }, stagger: 0.08, duration: 0.8 }, 6.8)
      .to(packets, { opacity: 0, duration: 0.2 }, 7.7)
      .to(q('.out-link'), { strokeDashoffset: 0, duration: 0.5 }, 8)
      .to(q('.outputs'), { opacity: 1, duration: 0.6 }, 8.4)
      .to({}, { duration: 0.6 }, 9.4); // un temps d'arrêt sur le schéma complet
    return tl;
  }

  // Scène AD (OLYMPE.FR) : la chaîne d'attaque monte de boîte en boîte jusqu'à la prise du DC.
  function buildAd(q) {
    gsap.set([q('.b1'), q('.b2'), q('.b3'), q('.b4'), q('.b5'), q('.dc-crit'), q('.loot'), q('.total')], { opacity: 0 });

    // Chaque saut : on dessine le lien, un paquet file vers la boîte suivante, puis la boîte apparaît.
    const hops = [
      { line: '.e1', pkt: '.p1', to: { cx: 176, cy: 192 }, box: '.b2', at: 2 },
      { line: '.e2', pkt: '.p2', to: { cx: 340, cy: 292 }, box: '.b3', at: 4 },
      { line: '.e3', pkt: '.p3', to: { cx: 504, cy: 192 }, box: '.b4', at: 6 },
      { line: '.e4', pkt: '.p4', to: { cx: 668, cy: 292 }, box: '.b5', at: 8 },
    ];
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to(q('.b1'), { opacity: 1, duration: 0.6 }, 0.2);
    hops.forEach((h) => {
      tl.to(q(h.line), { strokeDashoffset: 0, duration: 0.6 }, h.at - 1.2)
        .set(q(h.pkt), { opacity: 1 }, h.at - 1.2)
        .to(q(h.pkt), { attr: h.to, duration: 0.8 }, h.at - 1.2)
        .to(q(h.pkt), { opacity: 0, duration: 0.2 }, h.at - 0.4)
        .to(q(h.box), { opacity: 1, duration: 0.6 }, h.at);
    });
    // Pass-the-hash : le dernier paquet atteint le DC, qui bascule en « compromis », puis le butin apparaît.
    tl.to(q('.e5'), { strokeDashoffset: 0, duration: 0.6 }, 8.6)
      .set(q('.p5'), { opacity: 1 }, 8.6)
      .to(q('.p5'), { attr: { cx: 832, cy: 240 }, duration: 0.8 }, 8.6)
      .to(q('.p5'), { opacity: 0, duration: 0.2 }, 9.3)
      .to(q('.dc-crit'), { opacity: 1, duration: 0.5 }, 9.3)
      .to([q('.loot'), q('.total')], { opacity: 1, duration: 0.6 }, 9.6)
      .to({}, { duration: 0.6 }, 10); // un temps d'arrêt sur la chaîne complète
    return tl;
  }
});
