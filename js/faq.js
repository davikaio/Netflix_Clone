/**
 * Acordeão com uma resposta aberta por vez.
 * A função autoexecutável cria um escopo próprio: nomes daqui não vazam para
 * trending.js ou form.js, embora todos sejam scripts clássicos com defer.
 */
(() => {
  'use strict';
  const list = document.querySelector('.faq-list');
  if (!list) return;

  const entries = [...list.querySelectorAll('.faq-item')].map(item => ({
    item,
    button: item.querySelector('.faq-trigger'),
    panel: item.querySelector('.faq-panel')
  })).filter(entry => entry.button && entry.panel);

  /**
   * Uma única função mantém visual e acessibilidade sincronizados.
   * A classe controla o Grid no CSS; aria-expanded anuncia o estado do botão;
   * inert impede foco no conteúdo fechado durante a transição.
   */
  function setOpen(entry, open) {
    entry.item.classList.toggle('aberto', open);
    entry.button.setAttribute('aria-expanded', String(open));
    entry.panel.setAttribute('aria-hidden', String(!open));
    entry.panel.inert = !open;
  }

  list.classList.add('faq-ready');
  entries.forEach((entry, index) => {
    setOpen(entry, false);
    entry.button.disabled = false;
    entry.button.addEventListener('click', () => {
      const shouldOpen = entry.button.getAttribute('aria-expanded') !== 'true';
      // A resposta clicada abre ou fecha; todas as outras são fechadas.
      entries.forEach(candidate => setOpen(candidate, candidate === entry && shouldOpen));
    });

    // Botões já recebem Tab, Enter e Espaço nativamente. As setas são um extra.
    entry.button.addEventListener('keydown', event => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      let destination;
      if (event.key === 'ArrowDown') destination = (index + 1) % entries.length;
      else if (event.key === 'ArrowUp') destination = (index - 1 + entries.length) % entries.length;
      else if (event.key === 'Home') destination = 0;
      else if (event.key === 'End') destination = entries.length - 1;
      else if (event.key === 'Escape') { setOpen(entry, false); return; }
      else return;
      event.preventDefault();
      entries[destination].button.focus();
    });
  });
})();
