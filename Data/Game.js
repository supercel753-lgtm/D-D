const $ = id => document.getElementById(id);

const abilityNames = [
  "Força",
  "Destreza",
  "Constituição",
  "Inteligência",
  "Sabedoria",
  "Carisma"
];

const abilityKeys = ["str", "dex", "con", "int", "wis", "cha"];

let hero = {
  name: "Aventureiro",
  gender: "Masculino",
  race: "Humano",
  className: "Guerreiro",
  level: 1,
  hp: 12,
  maxHp: 12,
  ac: 16,
  xp: 0,
  stats: {
    str: 15,
    dex: 13,
    con: 14,
    int: 10,
    wis: 12,
    cha: 8
  },
  flags: {}
};

let enemyHp = 12;
let combat = false;

function modifier(value) {
  return Math.floor((Number(value) - 10) / 2);
}

function rollDie(sides) {
  const result = Math.floor(Math.random() * sides) + 1;
  $("diceResult").textContent = `d${sides}: ${result}`;
  addLog(`Rolagem de d${sides}: ${result}`);
  return result;
}

function addLog(message) {
  const log = $("log");
  const entry = document.createElement("p");
  entry.textContent = "» " + message;
  log.prepend(entry);
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach(section => {
    section.classList.toggle("active", section.id === viewId);
  });
}

function populateSelect(id, values) {
  const select = $(id);
  select.innerHTML = "";

  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function buildAbilityInputs() {
  const grid = $("abilityGrid");
  grid.innerHTML = "";

  abilityNames.forEach((name, index) => {
    const key = abilityKeys[index];
    const box = document.createElement("div");
    box.className = "ability";

    box.innerHTML = `
      <label>${name}</label>
      <input type="number" id="stat-${key}" min="3" max="20"
             value="${hero.stats[key]}">
      <div id="mod-${key}"></div>
    `;

    grid.appendChild(box);

    const input = $(`stat-${key}`);
    const update = () => {
      $(`mod-${key}`).textContent =
        "Modificador: " + modifier(input.value);
    };

    input.addEventListener("input", update);
    update();
  });
}

function randomizeStats() {
  abilityKeys.forEach(key => {
    const value = rollDie(6) + rollDie(6) + rollDie(6);
    $(`stat-${key}`).value = value;
    $(`mod-${key}`).textContent =
      "Modificador: " + modifier(value);
  });
}

function saveGame() {
  localStorage.setItem("pixelRealmsSave", JSON.stringify(hero));
}

function loadGame() {
  try {
    const saved = localStorage.getItem("pixelRealmsSave");
    if (!saved) return;

    const parsed = JSON.parse(saved);
    hero = { ...hero, ...parsed };
  } catch (error) {
    console.warn("Não foi possível carregar o salvamento.", error);
  }
}

function render() {
  $("heroName").textContent = hero.name;
  $("heroRaceClass").textContent =
    `${hero.race} • ${hero.className} • ${hero.gender}`;

  $("level").textContent = hero.level;
  $("hp").textContent = hero.hp;
  $("maxHp").textContent = hero.maxHp;
  $("ac").textContent = hero.ac;
  $("enemyHp").textContent = enemyHp;
}

function updateCharacter() {
  hero.name = $("nameInput").value.trim() || "Aventureiro";
  hero.gender = $("genderInput").value;
  hero.race = $("raceInput").value;
  hero.className = $("classInput").value;

  abilityKeys.forEach(key => {
    hero.stats[key] = Math.max(
      3,
      Math.min(20, Number($(`stat-${key}`).value) || 10)
    );
  });

  const cls = CLASSES[hero.className];
  hero.maxHp = Math.max(1, cls.hp + modifier(hero.stats.con));
  hero.hp = Math.min(hero.hp, hero.maxHp);

  if (hero.className === "Monge") {
    hero.ac = 10 + modifier(hero.stats.dex) + modifier(hero.stats.wis);
  } else if (hero.className === "Bárbaro") {
    hero.ac = 10 + modifier(hero.stats.dex) + modifier(hero.stats.con);
  } else {
    hero.ac = 16;
  }

  saveGame();
  render();
  addLog(`${hero.name} está pronto para a aventura.`);
  showView("game");
}

function beginCombat() {
  combat = true;
  enemyHp = 12;
  $("combatBox").classList.remove("hidden");
  $("choices").classList.add("hidden");
  $("sceneCaption").textContent =
    "Uma sombra se ergue da chuva e bloqueia a estrada!";
  addLog("Combate iniciado: Sombra Errante.");
  render();
}

function enemyTurn() {
  if (!combat || enemyHp <= 0) return;

  const damage = Math.max(1, rollDie(6) - 1);
  hero.hp = Math.max(0, hero.hp - damage);
  addLog(`A sombra causa ${damage} de dano.`);

  if (hero.hp <= 0) {
    hero.hp = 1;
    combat = false;
    $("combatBox").classList.add("hidden");
    $("choices").classList.remove("hidden");
    addLog("Uma viajante misteriosa resgata você.");
  }

  saveGame();
  render();
}

function attack() {
  if (!combat) return;

  const key = ["Ladino", "Monge"].includes(hero.className)
    ? "dex"
    : "str";

  const total = rollDie(20) + modifier(hero.stats[key]) + 2;
  addLog(`Ataque: resultado total ${total}.`);

  if (total >= 12) {
    const damage = rollDie(8) + Math.max(0, modifier(hero.stats[key]));
    enemyHp -= damage;
    addLog(`Você acerta e causa ${damage} de dano.`);
  } else {
    addLog("Seu ataque errou.");
  }

  if (enemyHp <= 0) {
    enemyHp = 0;
    finishCombat();
  } else {
    enemyTurn();
  }

  saveGame();
  render();
}

function castSpell() {
  if (!combat) return;

  const result = rollDie(20);
  addLog(`Teste de magia: ${result}.`);

  if (result >= 10) {
    const damage = rollDie(8) + Math.max(0, modifier(hero.stats.cha));
    enemyHp -= damage;
    addLog(`A magia causa ${damage} de dano.`);
  } else {
    addLog("A magia falhou.");
  }

  if (enemyHp <= 0) {
    enemyHp = 0;
    finishCombat();
  } else {
    enemyTurn();
  }

  saveGame();
  render();
}

function finishCombat() {
  combat = false;
  hero.flags.shadowDefeated = true;
  hero.xp += 100;

  $("combatBox").classList.add("hidden");
  $("choices").classList.remove("hidden");
  $("sceneTitle").textContent = "A luz sob a ponte";
  $("storyText").textContent =
    "A sombra se desfaz em partículas azuis. Você encontra " +
    "um medalhão com o símbolo de uma estrela partida.";
  $("sceneCaption").textContent = "O medalhão pulsa com luz fraca.";

  $("choices").innerHTML = `
    <button onclick="choose('north')">Seguir para o norte</button>
    <button onclick="choose('inn')">Entrar na estalagem</button>
  `;

  addLog("Vitória! Você ganhou 100 XP.");
  saveGame();
}

function runAway() {
  combat = false;
  $("combatBox").classList.add("hidden");
  $("choices").classList.remove("hidden");
  $("storyText").textContent =
    "Você recua para um lugar seguro. A luz azul continua brilhando.";
  addLog("Você recuou do combate.");
  saveGame();
  render();
}

function choose(choice) {
  if (choice === "investigate") {
    if (hero.flags.shadowDefeated) {
      $("storyText").textContent =
        "Dentro da estalagem, você encontra um mapa apontando para o norte.";
      hero.xp += 25;
    } else {
      beginCombat();
    }
  }

  if (choice === "bridge") {
    const result = rollDie(20) + modifier(hero.stats.wis);
    addLog(`Teste de percepção: ${result} contra CD 12.`);

    if (result >= 12) {
      hero.xp += 50;
      hero.gold = (hero.gold || 0) + 8;
      $("storyText").textContent =
        "Você encontra uma bolsa com 8 peças de ouro.";
    } else {
      $("storyText").textContent =
        "A chuva apagou quase todas as marcas da ponte.";
    }
  }

  if (choice === "camp") {
    hero.hp = hero.maxHp;
    $("storyText").textContent =
      "Você descansa sob as árvores e recupera seus PV.";
    addLog("Descanso: PV restaurados.");
  }

  if (choice === "north" || choice === "inn") {
    $("sceneTitle").textContent =
      choice === "north" ? "A Floresta dos Sinos" : "A Estalagem do Corvo";

    $("storyText").textContent =
      choice === "north"
        ? "Sinos sem badalo ecoam entre árvores antigas. Uma trilha leva a um arco de pedra."
        : "Um diário no balcão menciona viajantes desaparecidos e uma torre ao norte.";

    addLog("Nova área descoberta.");
    hero.xp += 25;
  }

  saveGame();
  render();
}

$("characterForm").addEventListener("submit", event => {
  event.preventDefault();
  updateCharacter();
});

populateSelect("raceInput", Object.keys(RACES));
populateSelect("classInput", Object.keys(CLASSES));

loadGame();

$("nameInput").value = hero.name;
$("genderInput").value = hero.gender;
$("raceInput").value = hero.race;
$("classInput").value = hero.className;

buildAbilityInputs();
render();
