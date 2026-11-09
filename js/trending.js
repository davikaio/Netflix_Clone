/**
 * A lista e os cartazes já existem no HTML. Este módulo só acrescenta setas
 * e atalhos, preservando toque, trackpad e rolagem nativa sem JavaScript.
 */
(() => {
  'use strict';
  const list = document.getElementById('trending-list');
  const previous = document.querySelector('.trending-prev');
  const next = document.querySelector('.trending-next');
  const status = document.getElementById('trending-status');
  if (!list || !previous || !next) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let framePending = false;
  let announcementTimer;

  /** Medir o card real evita manter no JS uma cópia das larguras do CSS. */
  function cardStride() {
    const card = list.firstElementChild;
    if (!card) return 1;
    const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function scrollBehavior() { return motion.matches ? 'auto' : 'smooth'; }

  /** Avança aproximadamente uma tela, alinhando o deslocamento ao tamanho dos cards. */
  function move(direction) {
    const stride = cardStride();
    const visibleCards = Math.max(1, Math.floor(list.clientWidth / stride));
    list.scrollBy({ left: direction * visibleCards * stride, behavior: scrollBehavior() });
  }

  /** A posição real, inclusive após toque, decide quais botões ficam disponíveis. */
  function updateControls() {
    framePending = false;
    const maximum = Math.max(0, list.scrollWidth - list.clientWidth);
    const canScroll = maximum > 2;
    previous.hidden = next.hidden = !canScroll;
    previous.disabled = !canScroll || list.scrollLeft <= 2;
    next.disabled = !canScroll || list.scrollLeft >= maximum - 2;
  }

  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateControls);
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  list.addEventListener('keydown', event => {
    if (event.target !== list || event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.key === 'ArrowLeft') move(-1);
    else if (event.key === 'ArrowRight') move(1);
    else if (event.key === 'Home') list.scrollTo({ left: 0, behavior: scrollBehavior() });
    else if (event.key === 'End') list.scrollTo({ left: list.scrollWidth, behavior: scrollBehavior() });
    else return;
    event.preventDefault();
  });

  list.addEventListener('scroll', () => {
    scheduleUpdate();
    // O anúncio espera a rolagem terminar para não falar a cada quadro.
    window.clearTimeout(announcementTimer);
    announcementTimer = window.setTimeout(() => {
      if (!status) return;
      const first = Math.min(list.children.length, Math.round(list.scrollLeft / cardStride()) + 1);
      status.textContent = `Lista a partir do título ${first} de ${list.children.length}.`;
    }, 180);
  }, { passive: true });

  if ('ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(list);
  else window.addEventListener('resize', scheduleUpdate, { passive: true });
  updateControls();
})();
