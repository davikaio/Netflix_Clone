/**
 * Os dois formulários usam a mesma estrutura data-email-form.
 * Não há fetch, armazenamento ou cadastro: este arquivo demonstra validação local.
 */
(() => {
  'use strict';
  // Regra didática, não uma implementação completa do padrão internacional de e-mail.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validationMessage(value) {
    const email = value.trim();
    if (!email) return 'Informe seu e-mail.';
    if (email.length > 254 || !emailPattern.test(email)) return 'Insira um e-mail válido, como voce@exemplo.com.';
    return '';
  }

  document.querySelectorAll('[data-email-form]').forEach(form => {
    const input = form.querySelector('input[type="email"]');
    const submit = form.querySelector('button[type="submit"]');
    const error = form.querySelector('.field-error');
    const feedback = form.querySelector('.form-feedback');
    if (!input || !submit || !error || !feedback) return;

    // Só substituímos a validação HTML depois de conectar a alternativa em JS.
    form.noValidate = true;
    submit.disabled = false;

    /** O texto associado por aria-describedby explica o mesmo erro mostrado na borda. */
    function showError(message) {
      error.textContent = message;
      input.setAttribute('aria-invalid', String(Boolean(message)));
    }

    input.addEventListener('blur', () => showError(validationMessage(input.value)));
    input.addEventListener('input', () => {
      feedback.textContent = '';
      feedback.classList.remove('is-error');
      input.classList.remove('is-valid');
      if (input.getAttribute('aria-invalid') === 'true') showError(validationMessage(input.value));
    });

    form.addEventListener('submit', event => {
      // Interrompe a navegação/submissão padrão. Nenhum dado sai do navegador.
      event.preventDefault();
      const message = validationMessage(input.value);
      showError(message);
      feedback.classList.toggle('is-error', Boolean(message));
      input.classList.toggle('is-valid', !message);
      if (message) {
        feedback.textContent = 'Revise o e-mail antes de continuar.';
        input.focus();
        return;
      }
      input.value = input.value.trim();
      feedback.textContent = 'Formato válido. Esta demonstração não cria uma assinatura nem envia seu e-mail.';
    });
  });
})();
