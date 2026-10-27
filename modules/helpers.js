export const esc=(s='')=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const uid=()=>crypto.randomUUID?.()||String(Date.now())+'-'+Math.random().toString(36).slice(2);
export const option=(v,selected='',label=v)=>`<option value="${esc(v)}" ${String(v)===String(selected)?'selected':''}>${esc(label)}</option>`;
export const fmtDate=v=>v?new Date(v).toLocaleDateString('pt-BR'):'—';
export const field=(label,name,value='',type='text',other='')=>`<label class="field">${esc(label)}<input name="${esc(name)}" type="${type}" value="${esc(value)}" ${other}></label>`;
export const area=(label,name,value='',other='')=>`<label class="field">${esc(label)}<textarea name="${esc(name)}" ${other}>${esc(value)}</textarea></label>`;
export function safeInt(v,min,max){const n=Number(v);if(!Number.isInteger(n)||n<min||n>max)throw new Error(`Informe um número entre ${min} e ${max}.`);return n;}
export function nonempty(v,label='Nome',max=140){const s=String(v||'').trim();if(!s)throw new Error(`Preencha ${label.toLowerCase()}.`);if(s.length>max)throw new Error(`${label}: limite de ${max} caracteres.`);return s;}
export const selectOptions=(items,selected)=>items.map(item=>option(item,selected)).join('');
export const empty=(text)=>`<div class="empty"><span aria-hidden="true">✦</span><p>${esc(text)}</p></div>`;
export function on(el,selector,event,fn){el.querySelector(selector)?.addEventListener(event,fn);}
export function setMessage(node,msg,type='notice'){if(node){node.className=`inline-message ${type}`;node.textContent=msg;}}
