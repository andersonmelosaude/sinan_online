/*
Bookmarklet Autofill Completo - Atualizado
- Inputs normais
- Selects dependentes com waitForNext
- Combo box com função de validação
- Simula blur no select UF para disparar AJAX
- Painel flutuante editável
*/


(function(){
if(window.__simple_autofill_loaded){alert('Autofill já ativo'); return;}
window.__simple_autofill_loaded = true;


const FIELD_MAP = [
{ selectorField: '[name="form:notificacao_paciente_endereco_municipio_noMunicipiocomboboxField"]', selectorValue: '[name="form:notificacao_paciente_endereco_municipio_noMunicipiocomboboxValue"]', value: 'CABO DE SANTO AGOSTINHO', type: 'combo' },
{ selector: '[name="form:richagravocomboboxField"]', value: '1', type: 'select' },
{ selector: '[name="form:notificacao_paciente_raca"]', value: '4', type: 'select' },
{ selector: '[name="form:notificacao_paciente_escolaridade"]', value: '9', type: 'select' },
{ selector: '[name="form:notificacao_paciente_endereco_municipio_uf_id"]', value: '16', type: 'select', waitForNext: 500, triggerBlur: true }
];


const map = FIELD_MAP.slice();


function createEl(tag, attrs={}, txt){
const e=document.createElement(tag);
for(const k in attrs)e.setAttribute(k,attrs[k]);
if(txt)e.textContent=txt;
return e;
}


const style=createEl('style');
style.textContent = '#sa-panel{position:fixed;right:12px;top:12px;width:380px;z-index:2147483647;background:#fff;border:1px solid rgba(0,0,0,.12);box-shadow:0 8px 30px rgba(0,0,0,.15);padding:10px;font-family:system-ui,Arial,sans-serif;font-size:13px;border-radius:8px}#sa-panel h4{margin:0 0 8px 0;font-size:14px}#sa-list{max-height:220px;overflow:auto;border-top:1px solid #eee;padding-top:8px;margin-top:8px}.sa-row{display:flex;gap:8px;align-items:center;margin-bottom:8px}.sa-row input[type=text]{flex:1;padding:6px;border:1px solid #ddd;border-radius:6px}.sa-row .sa-actions{display:flex;gap:6px}.sa-btn{padding:8px 10px;border-radius:6px;border:0;background:#0366d6;color:white;cursor:pointer}.sa-btn.ghost{background:#f3f4f6;color:#111;border:1px solid #ddd}.sa-small{font-size:12px;color:#666;margin-top:6px}.sa-picker-hint{font-size:12px;color:#b33;margin-top:6px}';
document.head.appendChild(style);


const panel=createEl('div',{id:'sa-panel'});
panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><h4>AutoFill rápido</h4><div style="display:flex;gap:8px;align-items:center"><button id="sa-close" class="sa-btn ghost">Fechar</button></div></div><div style="display:flex;gap:8px;margin-top:8px"><input id="sa-selector" type="text" placeholder="seletor CSS (ex: input[name=email])"/><input id="sa-value" type="text" placeholder="valor padrão" style="width:120px"/><select id="sa-type"><option value="input">input</option><option value="select">select</option><option value="combo">combo</option></select></div><div style="display:flex;gap:8px;margin-top:8px"><button id="sa-add" class="sa-btn">Adicionar</button><button id="sa-pick" class="sa-btn ghost">Pegar elemento</button><button id="sa-fill" class="sa-btn">Preencher</button><button id="sa-clear" class="sa-btn ghost">Limpar</button></div><div id="sa-list"></div><div class="sa-small">Use "Pegar elemento" e clique no campo da página para gerar seletor. Esc para cancelar.</div><div id="sa-hint" class="sa-picker-hint" style="display:none">Clique no elemento da página</div>';
document.body.appendChild(panel);


const listEl=document.getElementById('sa-list');
const selInput=document.getElementById('sa-selector');
const valInput=document.getElementById('sa-value');
const typeSelect=document.getElementById('sa-type');


function renderList(){
listEl.innerHTML='';
if(map.length===0){listEl.innerHTML='<div class="sa-small" style="padding:8px;color:#666">Nenhum mapeamento ainda</div>';return;}
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


btnUpd.onclick=()=>{if(m.type==='combo'){map[idx].selectorField=s.value;}else{map[idx].selector=s.value;}map[idx].value=v.value; map[idx].type=t.value; renderList();};
btnDel.onclick=()=>{map.splice(idx,1); renderList();};
});
}


function fillAll(){
let delay=0;
map.forEach(f=>{
setTimeout(()=>{
if(f.type==='combo'){
const field=document.querySelector(f.selectorField);
const valueEl=document.querySelector(f.selectorValue);
if(!field||!valueEl) return;
field.value=f.value;
field.dispatchEvent(new Event('input',{bubbles:true}));
field.dispatchEvent(new Event('change',{bubbles:true}));
valueEl.value=f.value;
valueEl.dispatchEvent(new Event('input',{bubbles:true}));
valueEl.dispatchEvent(new Event('change',{bubbles:true}));
if(typeof verCampoMunResiVazio==='function'){verCampoMunResiVazio();}
}else if(f.type==='select'){
const el=document.querySelector(f.selector); if(!el) return;
el.value=f.value; el.dispatchEvent(new Event('change',{bubbles:true}));
el.dispatchEvent(new Event('input',{bubbles:true}));
if(f.triggerBlur){
el.dispatchEvent(new Event('blur',{bubbles:true}));
}
}else{
const el=document.querySelector(f.selector); if(!el) return;
el.value=f.value; el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));
}
},delay);
if(f.waitForNext) delay+=f.waitForNext;
});
setTimeout(()=>alert('Preenchimento executado.'),delay+100);
}


function clearAll(){
map.forEach(f=>{
const el=document.querySelector(f.selector||f.selectorField);
if(!el) return;
if('value' in el){el.value=''; el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));}
else el.textContent='';
});
alert('Campos limpos.');
}


document.getElementById('sa-add').onclick=()=>{
const s=selInput.value.trim(); const v=valInput.value; const t=typeSelect.value;
if(!s){alert('Informe um seletor CSS');return;}
map.push({selector:s,value:v,type:t}); selInput.value=''; valInput.value=''; renderList();
};
document.getElementById('sa-fill').onclick=fillAll;
document.getElementById('sa-clear').onclick=clearAll;
document.getElementById('sa-close').onclick=()=>{panel.remove(); window.__simple_autofill_loaded=false; style.remove();};


let picking=false; const hint=document.getElementById('sa-hint');
function cssPath(el){if(!el) return ''; if(el.id) return '#'+el.id; const parts=[]; while(el&&el.nodeType===1&&el!==document.body){let selector=el.nodeName.toLowerCase(); if(el.className){const cls=String(el.className).trim().split(/\s+/).filter(Boolean)[0]; if(cls) selector+='.'+cls;} const parent=el.parentNode; if(parent){const siblings=Array.from(parent.children).filter(c=>c.nodeName===el.nodeName); if(siblings.length>1){const idx=Array.from(parent.children).indexOf(el)+1; selector+=`:nth-child(${idx})`;}} parts.unshift(selector); el=el.parentNode;} return parts.join(' > ');}
function startPicker(){if(picking) return; picking=true; hint.style.display='block'; document.body.style.cursor='crosshair';
    function onMove(ev){ev.preventDefault(); ev.stopPropagation();}
    function onClick(ev){ev.preventDefault(); ev.stopPropagation(); const el=ev.target; selInput.value=cssPath(el)||prompt('Seletor não gerado')||''; picking=false; hint.style.display='none'; document.body.style.cursor=''; document.removeEventListener('click',onClick,true); document.removeEventListener('mousemove',onMove,true); window.removeEventListener('keydown',onKey);}
    function onKey(e){if(e.key==='Escape'){picking=false; hint.style.display='none'; document.body.style.cursor=''; document.removeEventListener('click',onClick,true); document.removeEventListener('mousemove',onMove,true); window.removeEventListener('keydown',onKey);}}
    document.addEventListener('click',onClick,true); document.addEventListener('mousemove',onMove,true); window.addEventListener('keydown',onKey);}
  document.getElementById('sa-pick').onclick=startPicker;
  renderList();
})();
