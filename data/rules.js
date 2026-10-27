// Índices e valores funcionais resumidos a partir do Livro do Jogador 2014 (PDF fornecido).
// Descrições originais; conteúdos literários, tabelas extensas e magias não reproduzidos.
export const ABILITIES={str:'Força',dex:'Destreza',con:'Constituição',int:'Inteligência',wis:'Sabedoria',cha:'Carisma'};
export const SKILLS={Acrobacia:'dex',Arcanismo:'int',Atletismo:'str',Atuação:'cha',Enganação:'cha',Furtividade:'dex',História:'int',Intimidação:'cha',Intuição:'wis',Investigação:'int',Lidar_com_Animais:'wis',Medicina:'wis',Natureza:'int',Percepção:'wis',Persuasão:'cha',Prestidigitação:'dex',Religião:'int',Sobrevivência:'wis'};
export const RACES={
 'Anão':{bonus:{con:2},speed:7.5,size:'Médio',subs:{'Colina':{bonus:{wis:1},hpPerLevel:1},'Montanha':{bonus:{str:2}}}},
 'Elfo':{bonus:{dex:2},speed:9,size:'Médio',subs:{'Alto':{bonus:{int:1}},'Floresta':{bonus:{wis:1},speed:10.5},'Drow':{bonus:{cha:1}}}},
 'Halfling':{bonus:{dex:2},speed:7.5,size:'Pequeno',subs:{'Pés-Leves':{bonus:{cha:1}},'Robusto':{bonus:{con:1}}}},
 'Humano':{bonus:{str:1,dex:1,con:1,int:1,wis:1,cha:1},speed:9,size:'Médio',subs:{'Padrão':{}}},
 'Draconato':{bonus:{str:2,cha:1},speed:9,size:'Médio',subs:{'Padrão':{}}},
 'Gnomo':{bonus:{int:2},speed:7.5,size:'Pequeno',subs:{'Floresta':{bonus:{dex:1}},'Rochas':{bonus:{con:1}}}},
 'Meio-Elfo':{bonus:{cha:2},flex:2,speed:9,size:'Médio',subs:{'Padrão':{}}},
 'Meio-Orc':{bonus:{str:2,con:1},speed:9,size:'Médio',subs:{'Padrão':{}}},
 'Tiefling':{bonus:{int:1,cha:2},speed:9,size:'Médio',subs:{'Padrão':{}}}
};
export const CLASSES={
 'Bárbaro':{die:12,saves:['str','con']},'Bardo':{die:8,saves:['dex','cha']},
 'Bruxo':{die:8,saves:['wis','cha']},'Clérigo':{die:8,saves:['wis','cha']},
 'Druida':{die:8,saves:['int','wis']},'Feiticeiro':{die:6,saves:['con','cha']},
 'Guerreiro':{die:10,saves:['str','con']},'Ladino':{die:8,saves:['dex','int']},
 'Mago':{die:6,saves:['int','wis']},'Monge':{die:8,saves:['str','dex']},
 'Paladino':{die:10,saves:['wis','cha']},'Patrulheiro':{die:10,saves:['str','dex']}
};
export const BACKGROUNDS=['Acólito','Charlatão','Criminoso','Artista','Herói do Povo','Artesão de Guilda','Eremita','Nobre','Forasteiro','Sábio','Marinheiro','Soldado','Órfão'];
export const CONDITIONS=['Agarrado','Amedrontado','Atordoado','Caído','Cego','Enfeitiçado','Envenenado','Exausto','Impedido','Incapacitado','Inconsciente','Invisível','Paralisado','Petrificado','Surdo'];
export const mod=n=>Math.floor((Number(n)-10)/2);
export const prof=n=>2+Math.floor((Math.min(20,Math.max(1,Number(n)||1))-1)/4);
export const bonusLabel=n=>n>=0?`+${n}`:`${n}`;
export function abilityScores(c){let score={...c.base};const race=RACES[c.race];if(!race)return score;for(let [key,value] of Object.entries(race.bonus))score[key]+=value;let sub=race.subs[c.subrace]||{};for(let [key,value] of Object.entries(sub.bonus||{}))score[key]+=value;if(race.flex===2&&Array.isArray(c.flexible)){for(let key of new Set(c.flexible))if(key!=='cha'&&key in score)score[key]++;}return score;}
export function derived(c){const scores=abilityScores(c),classInfo=CLASSES[c.className]||CLASSES.Guerreiro;const pb=prof(c.level);const hpBonus=(RACES[c.race]?.subs[c.subrace]?.hpPerLevel||0)*(c.level||1);const startingHP=Math.max(1,classInfo.die+mod(scores.con)+hpBonus);return {scores,pb,initiative:mod(scores.dex),defaultAC:10+mod(scores.dex),startingHP,speed:RACES[c.race]?.subs[c.subrace]?.speed??RACES[c.race]?.speed??9,classInfo};}
export function roll(expression,random=Math.random){const normalized=String(expression).replace(/\s+/g,'').toLowerCase();const match=/^(\d{1,2})d(4|6|8|10|12|20|100)([+-]\d{1,3})?$/.exec(normalized);if(!match)throw new Error('Use uma expressão como 2d6+3 (até 30 dados).');const count=Number(match[1]);if(count<1||count>30)throw new Error('Limite: 1 a 30 dados.');const faces=Number(match[2]),modifier=Number(match[3]||0),rolls=Array.from({length:count},()=>1+Math.floor(random()*faces));return {notation:normalized,rolls,modifier,total:rolls.reduce((a,b)=>a+b,0)+modifier};}
export function rollAttributes(random=Math.random){return Array.from({length:6},()=>Array.from({length:4},()=>Math.floor(random()*6)+1).sort((a,b)=>a-b).slice(1).reduce((a,b)=>a+b,0));}
