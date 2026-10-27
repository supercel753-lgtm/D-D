// Bestiário desta distribuição: criaturas e estatísticas ORIGINAIS da plataforma,
// NÃO pertencentes ao Manual dos Monstros. O livro é usado apenas para estrutura.
export const CREATURES=[
 {id:'original_1',name:'Sentinela de Musgo',type:'Planta',size:'Médio',cr:'1/4',ac:12,hp:13,speed:'6 m',desc:'Guardião lento de caminhos esquecidos; criação original Pixel Realms.'},
 {id:'original_2',name:'Luz-ladra',type:'Fada',size:'Miúdo',cr:'1/8',ac:14,hp:5,speed:'Voo 12 m',desc:'Ser cintilante que se diverte apagando lanternas; criação original.'},
 {id:'original_3',name:'Caranguejo de Cristal',type:'Besta',size:'Pequeno',cr:'1/2',ac:15,hp:18,speed:'6 m',desc:'Crustáceo de cavernas salinas com couraça translúcida; criação original.'},
 {id:'original_4',name:'Espreitador de Cinzas',type:'Elemental',size:'Médio',cr:'1',ac:13,hp:30,speed:'9 m',desc:'Forma de fuligem animada por tempestades vulcânicas; criação original.'},
 {id:'original_5',name:'Guardião de Argila Azul',type:'Constructo',size:'Grande',cr:'2',ac:16,hp:44,speed:'6 m',desc:'Protetor de um santuário lacrado; criação original.'},
 {id:'original_6',name:'Corvo das Ruínas',type:'Besta',size:'Pequeno',cr:'0',ac:12,hp:3,speed:'Voo 15 m',desc:'Ave vigilante que coleciona botões enferrujados; criação original.'},
 {id:'original_7',name:'Tecelão de Brumas',type:'Aberração',size:'Grande',cr:'3',ac:13,hp:57,speed:'9 m',desc:'Habitante de um vale sempre encoberto; criação original.'},
 {id:'original_8',name:'Cavaleiro das Marés',type:'Humanoide',size:'Médio',cr:'1',ac:16,hp:26,speed:'9 m',desc:'Protetor errante dos faróis costeiros; criação original.'}
];
// Índice conciso de referência: nomes apenas, sem descrição protegida. Filtragem por nome/nível/escola.
export const SPELLS=[
 {name:'Mísseis Mágicos',level:1,school:'Evocação',page:257},
 {name:'Armadura Arcana',level:1,school:'Abjuração',page:218},
 {name:'Escudo Arcano',level:1,school:'Abjuração',page:241},
 {name:'Bola de Fogo',level:3,school:'Evocação',page:221},
 {name:'Detectar Magia',level:1,school:'Adivinhação',page:237,ritual:true},
 {name:'Luz',level:0,school:'Evocação',page:253},
 {name:'Curar Ferimentos',level:1,school:'Evocação',page:234},
 {name:'Mãos Mágicas',level:0,school:'Conjuração',page:255},
 {name:'Sono',level:1,school:'Encantamento',page:281},
 {name:'Identificação',level:1,school:'Adivinhação',page:248,ritual:true}
];
export const EQUIPMENT=[
 {name:'Adaga',category:'Arma',page:149}, {name:'Cimitarra',category:'Arma',page:149},
 {name:'Arco Longo',category:'Arma',page:149}, {name:'Corda de Cânhamo',category:'Aventura',page:150},
 {name:'Escudo',category:'Armadura',page:147}, {name:'Tocha',category:'Aventura',page:150},
 {name:'Mochila',category:'Aventura',page:150}, {name:'Algibeira',category:'Aventura',page:150}
];
export const MONSTER_INDEX=[
 {name:'Abolete',page:14},{name:'Basilisco',page:26},{name:'Gárgula',page:149},{name:'Dragões',page:85},{name:'Goblin',page:172},{name:'Hidra',page:185},{name:'Mímico',page:229},{name:'Minotauro',page:230},{name:'Tarrasque',page:286},{name:'Vampiros',page:296},{name:'Urso-Coruja',page:295},{name:'Zumbis',page:315}
];
export const GUIDES=[
 {title:'Criação de personagem',source:'Livro do Jogador',page:11,summary:'Defina ancestralidade, classe, seis habilidades, antecedentes e os dados iniciais da ficha.'},
 {title:'Testes e perícias',source:'Livro do Jogador',page:175,summary:'Testes usam d20, modificador relevante e, quando cabível, proficiência.'},
 {title:'Vantagem e desvantagem',source:'Livro do Jogador',page:175,summary:'Role dois d20 e utilize o maior (vantagem) ou o menor (desvantagem).'},
 {title:'Combate e iniciativa',source:'Livro do Jogador',page:191,summary:'A iniciativa ordena turnos; cada combatente acompanha ações, deslocamento e recursos.'},
 {title:'Pontos de vida',source:'Livro do Jogador',page:198,summary:'PV acompanham dano e recuperação. A ficha oferece controle manual de condições especiais.'},
 {title:'Conjuração',source:'Livro do Jogador',page:203,summary:'Magias podem requerer tempo, alcance, componentes, duração e concentração.'},
 {title:'Blocos de estatísticas',source:'Manual dos Monstros',page:6,summary:'Criaturas são organizadas por tamanho, tipo, defesa, PV, deslocamento e demais capacidades.'},
 {title:'Ambientes de aventura',source:'Manual dos Monstros',page:4,summary:'Masmorras, territórios selvagens, cidades e outros planos servem de cenário aos encontros.'}
];
