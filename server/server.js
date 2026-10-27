// Proxy de IA: Node.js 20+, sem dependências externas. Chave exclusiva no servidor.
import http from 'node:http';
const PORT=Number(process.env.PORT||8787);
const KEY=process.env.XAI_API_KEY||'';
const MODEL=process.env.XAI_MODEL||'';
const ORIGINS=(process.env.ALLOWED_ORIGINS||'http://localhost:8000,http://127.0.0.1:8000,http://localhost:5500,http://127.0.0.1:5500').split(',').map(x=>x.trim()).filter(Boolean);
const WINDOW=60_000,LIMIT=15,buckets=new Map();
function reply(res,status,data,extra={}){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra});res.end(JSON.stringify(data));}
const server=http.createServer(async(req,res)=>{
 const origin=req.headers.origin;
 if(origin){if(!ORIGINS.includes(origin)){reply(res,403,{error:'Origem não autorizada.'});return;}res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
 res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
 if(req.url==='/health'&&req.method==='GET'){reply(res,200,{status:'ok',aiConfigured:Boolean(KEY&&MODEL)});return;}
 if(req.url!=='/api/chat'||req.method!=='POST'){reply(res,404,{error:'Rota não encontrada.'});return;}
 if(!KEY||!MODEL){reply(res,503,{error:'IA não configurada no servidor: defina XAI_API_KEY e XAI_MODEL.'});return;}
 const ip=req.socket.remoteAddress||'unknown',now=Date.now(),b=buckets.get(ip)||[];const recent=b.filter(x=>now-x<WINDOW);
 if(recent.length>=LIMIT){reply(res,429,{error:'Limite temporário de consultas atingido.'});return;}recent.push(now);buckets.set(ip,recent);if(buckets.size>5000)buckets.clear();
 const chunks=[];let size=0;
 try{for await(const chunk of req){size+=chunk.length;if(size>16000){reply(res,413,{error:'Pedido muito grande.'});return;}chunks.push(chunk);}
 const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));const modes=['adventure','npc','names','encounter','explain','story','notes'];
 if(typeof body.prompt!=='string'||!body.prompt.trim()||body.prompt.length>2500||typeof body.mode!=='string'||!modes.includes(body.mode)||typeof body.context!=='string'&&body.context!==undefined||String(body.context||'').length>5500){reply(res,400,{error:'Dados do pedido inválidos.'});return;}
 const modeText={adventure:'Ideias de aventuras',npc:'NPCs originais',names:'Nomes e lugares originais',encounter:'Encontro narrativo',explain:'Explicação independente de uma mecânica',story:'História de personagem',notes:'Organização de notas'};
 const system='Você é um assistente de RPG de fantasia em português. Produza conteúdo original e claro. Separe regras oficiais, regras caseiras e sugestões criativas. Não atribua regras inventadas ao D&D 5e. Não reproduza trechos de livros protegidos. Não solicite credenciais e não tente alterar registros do jogador.';
 const user=`Categoria: ${modeText[body.mode]}\n${body.context?`Contexto informado pelo usuário:\n${body.context}\n`:''}Pedido:\n${body.prompt}`;
 const response=await fetch('https://api.x.ai/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:MODEL,input:[{role:'system',content:system},{role:'user',content:user}],max_output_tokens:1200,store:false}),signal:AbortSignal.timeout(24000)});
 if(!response.ok){reply(res,502,{error:`Serviço de IA indisponível (HTTP ${response.status}). Confira modelo, chave e limites.`});return;}
 const result=await response.json();const answer=(result?.output||[]).filter(item=>item?.type==='message').flatMap(item=>item?.content||[]).filter(item=>item?.type==='output_text'&&typeof item?.text==='string').map(item=>item.text).join('\n');
 if(typeof answer!=='string'||!answer.trim()){reply(res,502,{error:'A IA não retornou uma resposta de texto válida.'});return;}
 reply(res,200,{answer:answer.slice(0,16000)});
 }catch(e){reply(res,e instanceof SyntaxError?400:504,{error:e instanceof SyntaxError?'JSON inválido.':'Falha de rede ou tempo limite da IA.'});}
});
server.listen(PORT,()=>{process.stdout.write(`Pixel Realms backend na porta ${PORT} (${KEY&&MODEL?'configurado':'sem credenciais'}).\n`);});
