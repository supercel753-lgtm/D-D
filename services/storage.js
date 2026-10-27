export const STORAGE_KEY='pixel-realms.v1';
const blank=()=>({version:1,characters:[],campaigns:[],sessions:[],notes:[],encounters:[],creatures:[],favorites:[],settings:{backendUrl:''},updatedAt:null});
export class StorageError extends Error {}
export function validateData(data){
 if(!data||typeof data!=='object'||Array.isArray(data)||data.version!==1)throw new StorageError('Arquivo inválido: versão não reconhecida.');
 for(const k of ['characters','campaigns','sessions','notes','encounters','creatures','favorites']){
  if(!Array.isArray(data[k])||data[k].length>20000)throw new StorageError(`Arquivo inválido: campo ${k}.`);
 }
 for(const k of ['characters','campaigns','sessions','notes','encounters','creatures'])for(const item of data[k]){
  if(!item||typeof item!=='object'||Array.isArray(item)||typeof item.id!=='string'||item.id.length>120)throw new StorageError(`Registro inválido em ${k}.`);
 }
 const isStr=x=>typeof x==='string';
 const isInt=x=>Number.isInteger(x);
 for(const c of data.characters){
  if(!isStr(c.name)||!isStr(c.race)||!isStr(c.subrace)||!isStr(c.className)||!isInt(c.level)||c.level<1||c.level>20||!c.base||typeof c.base!=='object')throw new StorageError('Ficha de personagem inválida.');
  for(const k of ['str','dex','con','int','wis','cha'])if(!isInt(c.base[k])||c.base[k]<3||c.base[k]>20)throw new StorageError('Atributos da ficha inválidos.');
  for(const k of ['skills','inventory','spells','conditions','resources'])if(!Array.isArray(c[k]))throw new StorageError(`Ficha inválida: ${k}.`);
 }
 for(const c of data.campaigns)if(!isStr(c.name))throw new StorageError('Nome de campanha inválido.');
 for(const c of data.encounters){
  if(!isStr(c.name)||!Array.isArray(c.participants)||!isInt(c.round)||!isInt(c.turn))throw new StorageError('Encontro inválido.');
  for(const p of c.participants)if(!p||!isStr(p.id)||!isStr(p.name)||!isInt(p.hp)||!isInt(p.maxHP)||!Array.isArray(p.conditions))throw new StorageError('Participante de encontro inválido.');
 }
 for(const c of data.creatures)if(!isStr(c.name)||!isStr(c.type)||!isInt(c.hp)||!isInt(c.ac))throw new StorageError('Criatura personalizada inválida.');
 if(!data.favorites.every(isStr))throw new StorageError('Favoritos inválidos.');
 if(!data.settings||typeof data.settings!=='object'||Array.isArray(data.settings)||!isStr(data.settings.backendUrl))throw new StorageError('Preferências inválidas.');
 return data;
}
export function load(){
 let raw;
 try{raw=localStorage.getItem(STORAGE_KEY)}catch{throw new StorageError('O navegador bloqueou o armazenamento. Ative-o para salvar dados.');}
 if(!raw)return blank();
 try{return validateData(JSON.parse(raw))}catch(e){throw new StorageError('Dados salvos inválidos ou corrompidos. Nada foi apagado. Faça um backup manual do armazenamento antes de reparar. Detalhes: '+e.message);}
}
export function persist(data){
 validateData(data);data.updatedAt=new Date().toISOString();
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}catch(e){throw new StorageError('Não foi possível salvar: armazenamento bloqueado ou sem espaço. Exporte seus dados, se possível.');}
}
export function exportData(data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`pixel-realms-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
export function importData(text){if(text.length>3e6)throw new StorageError('Backup acima do limite de 3 MB.');return validateData(JSON.parse(text));}
