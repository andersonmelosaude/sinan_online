/*
  Bookmarklet Autofill com Sessões e Painel Minimalista
  - Múltiplas sessões/abas de preenchimento
  - Painel de edição visível apenas ao clicar na engrenagem
  - Auto preencher sempre disponível
  - Selects dependentes, combo box e inputs com valor fixo ou variável
*/

(function(){
  if(window.__simple_autofill_loaded){alert('Autofill já ativo'); return;}
  window.__simple_autofill_loaded = true;

  const SESSIONS = {
    'Default': [

      { selector: '[name="form:notificacao_paciente_raca"]', value: '4', type: 'select' },
      { selector: '[name="form:notificacao_paciente_escolaridade"]', value: '9', type: 'select' },
      { selector: '[name="form:notificacao_paciente_endereco_municipio_uf_id"]', value: '16', type: 'select', waitForNext: 500, triggerBlur: true },
      { selector: '[name="form:notificacao_paciente_endereco_municipio_noMunicipiocomboboxxValue"]', value: 'CABO DE SANTO AGOSTINHO', type: 'input' },
      { selector: '[name="form:notificacao_paciente_endereco_municipio_noMunicipiocomboboxField"]', value: 'CABO DE SANTO AGOSTINHO', type: 'input' },
      { selector: '[name="form:notificacao_paciente_endereco_municipio_noMunicipiocomboboxField"]', value: 'CABO DE SANTO AGOSTINHO', type: 'select' },
      { selector: '[name="form:notificacao_paciente_endereco_municipio_id"]', value: '260290', type: 'input' },
      
      { selector: '[name="form:notificacao_paciente_endereco_bairro_noBairrocomboboxField"]', value: 'PONTE DOS CARVALHOS CENTRO - BAIRRO', type: 'input' },
      { selector: '[name="form:notificacao_paciente_endereco_bairro_noBairrocomboboxField"]', value: 'PONTE DOS CARVALHOS CENTRO - BAIRRO', type: 'select' },

      { selector: '[name="form:categoria_localidade_bairro_residencia"]', value: 'BAIRRO', type: 'input' },
      { selector: '[name="form:notificacao_paciente_endereco_bairro_id"]', value: '122', type: 'input' },

      { selector: '[name="form:notificacao_paciente_endereco_zona"]', value: '1', type: 'select' }
    ],
    'Sintomas': [
      { selector: '[name="form:chikungunya_sinaisFebre"]', value: '1', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisMialgia"]', value: '1', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisCefaleia"]', value: '1', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisExantema"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisVomito"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisNausea"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisDorCostas"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisConjuntivite"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisArtrite"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisArtralgia"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisPetequias"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisLeucopenia"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisProvaLaco"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_sinaisRetroorbital"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_doencasDiabete"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_doencasHematologicas"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_doencasHepatopatias"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_doencasRenal"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_doencasHipertensao"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_doencasAcido"]', value: '2', type: 'input' },
      { selector: '[name="form:chikungunya_doencasAutoimune"]', value: '2', type: 'input' },
      { selector: '[name="form:dengue_classificacao"]', value: '2', type: 'input' }
    ]
  };

  let currentSession = 'Default';
  let map = SESSIONS[currentSession].slice();

  function createEl(tag, attrs={}, txt){
    const e=document.createElement(tag);
    for(const k in attrs)e.setAttribute(k,attrs[k]);
    if(txt)e.textContent=txt;
    return e;
  }

  const style=createEl('style');
  style.textContent = '#sa-panel{position:fixed;right:12px;top:12px;width:400px;z-index:2147483647;background:#fff;border:1px solid rgba(0,0,0,.12);box-shadow:0 8px 30px rgba(0,0,0,.15);padding:10px;font-family:system-ui,Arial,sans-serif;font-size:13px;border-radius:8px}#sa-header{display:flex;justify-content:space-between;align-items:center;gap:4px}#sa-list{max-height:220px;overflow:auto;border-top:1px solid #eee;padding-top:8px;margin-top:8px;display:none}.sa-row{display:flex;gap:8px;align-items:center;margin-bottom:8px}.sa-row input[type=text]{flex:1;padding:6px;border:1px solid #ddd;border-radius:6px}.sa-row .sa-actions{display:flex;gap:6px}.sa-btn{padding:8px 10px;border-radius:6px;border:0;background:#0366d6;color:white;cursor:pointer}.sa-btn.ghost{background:#f3f4f6;color:#111;border:1px solid #ddd}.sa-small{font-size:12px;color:#666;margin-top:6px}.sa-picker-hint{font-size:12px;color:#b33;margin-top:6px}';
  document.head.appendChild(style);

  const panel=createEl('div',{id:'sa-panel'});
  panel.innerHTML = `
    <div id='sa-header'>
      <button id='sa-fill' class='sa-btn'>Auto Preencher</button>
      <select id='sa-session'>${Object.keys(SESSIONS).map(s=>`<option value='${s}'>${s}</option>`).join('')}</select>
      <button id='sa-gear' class='sa-btn ghost'>⚙</button>
      <button id='sa-close' class='sa-btn ghost'>✖</button>
    </div>
    <div id='sa-list'></div>
    <div class='sa-small'>Clique na engrenagem para editar campos da sessão atual.</div>
    <div id='sa-hint' class='sa-picker-hint' style='display:none'>Clique no elemento da página</div>
  `;
  document.body.appendChild(panel);

  const listEl = document.getElementById('sa-list');
  const sessionSelect = document.getElementById('sa-session');
  let panelVisible = false;

  function renderList(){
    listEl.innerHTML='';
    if(map.length===0){listEl.innerHTML='<div class="sa-small" style="padding:8px;color:#666">Nenhum mapeamento ainda</div>'; return;}
    map.forEach((m,idx)=>{
      const row=createEl('div',{class:'sa-row'});
      const s=createEl('input',{type:'text'}); s.value=m.selector||m.selectorField;
      const v=createEl('input',{type:'text'}); v.value=m.value;
      const t=createEl('input',{type:'text'}); t.value=m.type; t.style.width='60px';
      const actions=createEl('div',{class:'sa-actions'});
      const btnUpd=createEl('button',{class:'sa-btn ghost'},'Atualizar');
      const btnDel=createEl('button',{class:'sa-btn ghost'},'Remover');
      actions.appendChild(btnUpd); actions.appendChild(btnDel);
      row.appendChild(s); row.appendChild(v); row.appendChild(t); row.appendChild(actions);
      listEl.appendChild(row);

      btnUpd.onclick=()=>{map[idx].selector=s.value; map[idx].value=v.value; map[idx].type=t.value; SESSIONS[currentSession] = map.slice(); renderList();};
      btnDel.onclick=()=>{map.splice(idx,1); SESSIONS[currentSession] = map.slice(); renderList();};
    });
  }

  function fillAll(){
    let delay=0;
    map.forEach(f=>{
      setTimeout(()=>{
        const el=document.querySelector(f.selector||f.selectorField);
        if(!el) return;
        if(f.type==='combo'){
          const valueEl=document.querySelector(f.selectorValue);
          if(!valueEl) return;
          el.value=f.value; el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));
          valueEl.value=f.value; valueEl.dispatchEvent(new Event('input',{bubbles:true})); valueEl.dispatchEvent(new Event('change',{bubbles:true}));
        } else if(f.type==='select'){
          el.value=f.value; el.dispatchEvent(new Event('change',{bubbles:true})); el.dispatchEvent(new Event('input',{bubbles:true}));
          if(f.triggerBlur){ el.dispatchEvent(new Event('blur',{bubbles:true})); }
        } else {
          el.value=f.value; el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));
        }
      },delay);
      if(f.waitForNext) delay+=f.waitForNext;
    });
    //setTimeout(()=>alert('Preenchimento executado.'),delay+100);
  }

  sessionSelect.onchange = ()=>{currentSession = sessionSelect.value; map = SESSIONS[currentSession].slice(); if(panelVisible) renderList();};

  const gearBtn = document.getElementById('sa-gear');
  gearBtn.onclick = ()=>{panelVisible = !panelVisible; listEl.style.display = panelVisible ? 'block' : 'none'; if(panelVisible) renderList();};
  const closeBtn = document.getElementById('sa-close');
  closeBtn.onclick = () => {
      panel.remove();  // remove o painel da página
      window.__simple_autofill_loaded = false; // permite reinicializar se quiser
  };

  document.getElementById('sa-fill').onclick = fillAll;
})();
