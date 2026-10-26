// ============================================
// EMULADOR D&D 5e PIXEL - 2014 PHB
// Modular • 2 Gêneros • Todas Raças & Classes
// ============================================

const RACES = {
  "Dragonborn": {
    desc: "Descendentes de dragões. Orgulhosos e fortes.",
    bonus: { str: 2, cha: 1 },
    traits: ["Respiração Dracônica", "Resistência a Dano", "Idioma: Dracônico"],
    speed: 30,
    size: "Médio",
    subraces: {
      "Padrão": { desc: "Sem sub-raça especial." }
    }
  },
  "Anão": {
    desc: "Resistentes e mestres da forja. Vivem nas montanhas.",
    bonus: { con: 2 },
    traits: ["Visão no Escuro", "Resiliência Anã", "Treinamento de Combate Anão", "Idioma: Anão"],
    speed: 25,
    size: "Médio",
    subraces: {
      "Anão da Colina": { bonus: { wis: 1 }, traits: ["Dureza Anã (+1 PV por nível)"] },
      "Anão da Montanha": { bonus: { str: 2 }, traits: ["Treinamento com Armaduras"] }
    }
  },
  "Elfo": {
    desc: "Gracejosos, longevos e conectados à magia.",
    bonus: { dex: 2 },
    traits: ["Visão no Escuro", "Ancestral Feérico", "Transe", "Idioma: Élfico"],
    speed: 30,
    size: "Médio",
    subraces: {
      "Elfo Alto": { bonus: { int: 1 }, traits: ["Treinamento com Armas Élficas", "Truque", "Idioma Extra"] },
      "Elfo da Floresta": { bonus: { wis: 1 }, traits: ["Pés Ligeiros", "Máscara da Natureza"] },
      "Elfo Negro (Drow)": { bonus: { cha: 1 }, traits: ["Visão no Escuro Superior", "Sensibilidade à Luz Solar", "Magia Drow"] }
    }
  },
  "Gnomo": {
    desc: "Pequenos inventores e ilusionistas cheios de curiosidade.",
    bonus: { int: 2 },
    traits: ["Visão no Escuro", "Esperteza Gnômica", "Idioma: Gnômico"],
    speed: 25,
    size: "Pequeno",
    subraces: {
      "Gnomo da Floresta": { bonus: { dex: 1 }, traits: ["Ilusionista Natural", "Falar com Animais Pequenos"] },
      "Gnomo das Rochas": { bonus: { con: 1 }, traits: ["Conhecimento de Artífice", "Engenhoca"] }
    }
  },
  "Meio-Elfo": {
    desc: "Versáteis e carismáticos, herdam o melhor dos dois mundos.",
    bonus: { cha: 2 },
    traits: ["Visão no Escuro", "Ancestral Feérico", "Versatilidade de Perícia", "Idiomas: Comum + Élfico + 1"],
    speed: 30,
    size: "Médio",
    subraces: {
      "Padrão": { bonus: { any: 1 }, traits: ["+1 em dois atributos à escolha"] }
    }
  },
  "Meio-Orc": {
    desc: "Fortes e intimidadores, com sede de batalha.",
    bonus: { str: 2, con: 1 },
    traits: ["Visão no Escuro", "Ameaçador", "Resistência Implacável", "Ataques Selvagens", "Idioma: Orc"],
    speed: 30,
    size: "Médio",
    subraces: {
      "Padrão": { desc: "Sem sub-raça especial." }
    }
  },
  "Halfling": {
    desc: "Pequenos, sortudos e corajosos.",
    bonus: { dex: 2 },
    traits: ["Sortudo", "Bravo", "Agilidade Halfling", "Idioma: Halfling"],
    speed: 25,
    size: "Pequeno",
    subraces: {
      "Pés-Leves": { bonus: { cha: 1 }, traits: ["Furtividade Natural"] },
      "Robusto": { bonus: { con: 1 }, traits: ["Resiliência Robusta"] }
    }
  },
  "Humano": {
    desc: "Adaptáveis e ambiciosos. A raça mais versátil.",
    bonus: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    traits: ["Idioma Extra"],
    speed: 30,
    size: "Médio",
    subraces: {
      "Padrão": { desc: "+1 em todos os atributos." },
      "Variante": { bonus: { any: 1 }, traits: ["+1 em dois atributos", "Perícia", "Talento"] }
    }
  },
  "Tiefling": {
    desc: "Marcados por herança infernal. Carismáticos e misteriosos.",
    bonus: { int: 1, cha: 2 },
    traits: ["Visão no Escuro", "Resistência Infernal", "Legado Infernal", "Idioma: Infernal"],
    speed: 30,
    size: "Médio",
    subraces: {
      "Padrão (Asmodeus)": { desc: "O legado clássico de Asmodeus." }
    }
  }
};

const CLASSES = {
  "Bárbaro": {
    hitDie: 12,
    primary: "FOR",
    saves: ["FOR", "CON"],
    desc: "Guerreiro primal movido pela fúria. Tanque de dano e resistência.",
    features: ["Fúria", "Defesa sem Armadura", "Ataque Temerário (Nv.2)"]
  },
  "Bardo": {

... 
