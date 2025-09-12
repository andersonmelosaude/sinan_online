// inject.js
// Versão simples: cria um painel flutuante que preenche campos mapeados
// PERSONALIZE o objeto "FIELD_MAP" para o site alvo

(function () {
  if (window.__autofill_panel_installed) return;
  window.__autofill_panel_installed = true;

  // --- CONFIG: mapeie campos aqui (querySelector => valor padrão)
  // Exemplo: '#nome' ou 'input[name="email"]' ou '.form-class input[type=text]'
  const FIELD_MAP = {
    'input[name="form:nuNotificacao"]': '5412240',
    'input[name="lastName"]': 'Melo',
    'input[name="email"]': 'meuemail@example.com',
    'input[name="phone"]': '11999990000'
  };

  // --- Helper: cria o painel flutuante
  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'autofill-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      right: '12px',
      top: '12px',
      width: '320px',
      zIndex: 2147483647,
      background: 'white',
      border: '1px solid rgba(0,0,0,0.12)',
      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
      padding: '10px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      color: '#111',
      borderRadius: '8px'
    });

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <strong>AutoFill</strong>
        <button id="autofill-close" title="Fechar" style="border:0;background:transparent;cursor:pointer">✕</button>
      </div>
      <div style="max-height:220px;overflow:auto;margin-bottom:8px">
        <div style="margin-bottom:6px"><small><b>Campos detectados / mapeamento</b></small></div>
        <div id="autofill-list"></div>
      </div>
      <div style="display:flex;gap:6px">
        <button id="autofill-fill" style="flex:1;padding:6px">Preencher</button>
        <button id="autofill-clear" style="flex:1;padding:6px">Limpar</button>
      </div>
      <div style="margin-top:8px;text-align:center"><small><i>Altere FIELD_MAP no inject.js conforme necessário.</i></small></div>
    `;

    document.body.appendChild(panel);

    document.getElementById('autofill-close').onclick = () => panel.remove();
    document.getElementById('autofill-fill').onclick = () => fillAll();
    document.getElementById('autofill-clear').onclick = () => clearAll();

    renderList();
  }

  function renderList() {
    const list = document.getElementById('autofill-list');
    if (!list) return;
    list.innerHTML = '';
    for (const selector in FIELD_MAP) {
      const display = document.createElement('div');
      display.style.marginBottom = '6px';
      const el = document.querySelector(selector);
      display.innerHTML = `<div style="font-size:12px;color:#222">${selector}</div>
                           <div style="font-size:12px;color:#555">valor: <code>${FIELD_MAP[selector]}</code> — ${el ? '<span style="color:green">encontrado</span>' : '<span style="color:crimson">não encontrado</span>'}</div>`;
      list.appendChild(display);
    }
  }

  function fillAll() {
    for (const selector in FIELD_MAP) {
      const nodes = document.querySelectorAll(selector);
      if (!nodes || nodes.length === 0) continue;
      nodes.forEach((n) => {
        try {
          // Most common: inputs, selects, textareas
          if ('value' in n) {
            n.focus();
            n.value = FIELD_MAP[selector];
            n.dispatchEvent(new Event('input', { bubbles: true }));
            n.dispatchEvent(new Event('change', { bubbles: true }));
          } else {
            n.textContent = FIELD_MAP[selector];
          }
        } catch (e) {
          console.warn('Autofill failed for', selector, e);
        }
      });
    }
    alert('Preenchimento automático executado (verifique os campos antes de enviar).');
  }

  function clearAll() {
    for (const selector in FIELD_MAP) {
      const nodes = document.querySelectorAll(selector);
      if (!nodes || nodes.length === 0) continue;
      nodes.forEach((n) => {
        try {
          if ('value' in n) {
            n.focus();
            n.value = '';
            n.dispatchEvent(new Event('input', { bubbles: true }));
            n.dispatchEvent(new Event('change', { bubbles: true }));
          } else {
            n.textContent = '';
          }
        } catch (e) {
          console.warn('Clear failed for', selector, e);
        }
      });
    }
    alert('Campos limpos.');
  }

  // inicia
  createPanel();
  // re-render se DOM mudar (opcional)
  const obs = new MutationObserver(() => renderList());
  obs.observe(document, { childList: true, subtree: true });
})();
