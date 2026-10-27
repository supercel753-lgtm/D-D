# PIXEL REALMS — RPG Digital Modular

**Versão 1.0 — aplicação web estática com backend opcional de IA**

Projeto funcional, em português, de apoio a jogadores e Mestres de RPG de fantasia. Construído a partir da auditoria do ZIP `D-D-main`, das orientações do script e da consulta aos PDFs do *Livro do Jogador (D&D 5e 2014)* e *Manual dos Monstros* fornecidos pelo usuário.

> **Importante:** não é uma reprodução digital dos livros oficiais. Os exemplos de monstros com estatísticas são criações originais do Pixel Realms. Regras e índices são apresentados em referências concisas. O usuário deve consultar seus próprios livros para detalhes completos de mecânicas, magias e criaturas oficiais.

## O que funciona

| Área | Recursos disponíveis |
|---|---|
| Painel | Resumo de personagens, campanhas, criaturas e encontros; atalhos |
| Personagens | Assistente de 4 etapas, 9 raças (seleções resumidas), 12 classes, antecedentes, bônus raciais, conjunto padrão e 4d6, atributos, PV iniciais, CA base, proficiência, perícias manuais, ficha editável, condições, inventário, habilidades/magias, anotações e exclusão confirmada |
| Campanhas | Criar, consultar, editar e excluir campanhas; registrar, editar e excluir sessões; anotações classificadas por NPC, local, facção, missão, tesouro, evento etc. |
| Bestiário | 8 criaturas **originais**, criaturas personalizadas com criação/edição/exclusão, favoritos, busca, filtros por tipo/tamanho/ND, índice bibliográfico de criaturas do livro; envio para encontros |
| Encontros | Criar, salvar e excluir encontros; vincular a campanha; adicionar participantes de bestiário, fichas e avulsos; quantidades; rolagem/ordenação de iniciativa; acompanhamento de turnos, rodadas, PV e condições |
| Biblioteca | Resumos de conceitos, índices concisos de magias (nível e escola) e itens; busca/filtros |
| Dados | Rolagem de expressões NdX±modificador, histórico, vantagem/desvantagem, geração 4d6 descartando menor |
| Backup | Exportação JSON, importação validada, confirmação antes de substituição e aviso de armazenamento indisponível/corrompido |
| IA (opcional) | Formulário para ideias de aventuras, NPCs e regras; envio de contexto autorizado de uma campanha a backend separado e resposta de texto, sem modificar dados |

## Origem e auditoria

O ZIP original continha somente `index.html`, `script.js` e `style.css`, **todos com exatamente 4.102 bytes e encerrados abruptamente**. O `script.js` original falha em `node --check` por `Unexpected end of input`. Não havia backend, base de dados, testes, arquivos de módulos nem README. A aparência pixelada, o fluxo de criação de personagem e a intenção de catálogo de raças e classes foram aproveitados no desenho da solução, mas não havia aplicação executável completa a preservar.

Os arquivos originais, sem alterações no conteúdo, estão preservados na pasta `legacy/` como arquivos `.original.txt` para auditoria. O novo aplicativo não depende deles. Consulte `AUDITORIA.md` para as decisões.

## Arquitetura e arquivos

```text
Pixel-Realms/
├── index.html             # Layout principal e navegação
├── style.css              # Tema visual e responsividade
├── app.js                 # Coordenação das telas e estados
├── data/
│   ├── rules.js           # Cálculos puros: modificadores, proficiência, rolagens etc.
│   └── catalog.js         # Conteúdo original e índices concisos
├── modules/
│   ├── characters.js      # Criador e fichas
│   ├── campaigns.js       # Campanhas, sessões, notas
│   ├── bestiary.js        # Catálogo e criaturas personalizadas
│   ├── encounters.js      # Controle de encontros
│   ├── library.js         # Consultas bibliográficas
│   ├── dice.js            # Rolagens
│   ├── ai.js              # Cliente da IA
│   ├── settings.js        # Backup, importação e configurações
│   └── helpers.js         # Sanitização e utilitários
├── services/storage.js    # Persistência e validação de backup
├── server/
│   ├── server.js          # Proxy seguro para a API xAI
│   ├── package.json       # Node 20+, sem dependências externas
│   └── .env.example       # Exemplo de configuração
├── tests/
│   ├── test_rules.mjs
│   ├── test_backend.py
│   └── smoke_browser.py
├── legacy/                # Arquivos originais incompletos
├── AUDITORIA.md
└── README.md
```

### Executar o site localmente

É um site estático, **não exige Node para o front-end**. Use um servidor HTTP para resolver corretamente módulos ES. Exemplo com Python:

```bash
cd Pixel-Realms
python -m http.server 8000
```

Abra `http://localhost:8000/` no Chrome ou outro navegador moderno. Não abra diretamente como `file://`, pois as políticas de segurança de módulos podem impedir o carregamento. Nenhum login, banco de dados remoto ou Internet é necessário para os módulos básicos.

Os dados ficam no `localStorage` do navegador, na chave `pixel-realms.v1`. **Não há sincronização automática entre dispositivos.** Faça backup JSON frequentemente. Um backup só pode substituir os dados atuais após confirmação explícita.

### Publicar no GitHub Pages

1. Extraia o ZIP e envie o **conteúdo da pasta `Pixel-Realms/`** para a raiz de um repositório GitHub (ou adapte seu fluxo de deploy).
2. Acesse o repositório → **Settings → Pages**.
3. Em *Build and deployment*, escolha **Deploy from a branch**, a branch desejada e `/(root)`.
4. Aguarde a publicação e abra `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
5. Os caminhos dos arquivos no `index.html` são relativos (`./`), portanto suportam a subpasta do projeto.
6. A aplicação base funciona sem servidor adicional. A IA **não funciona apenas com GitHub Pages**, pois o Pages não executa Node.js.

Nunca faça upload de `server/.env` nem de qualquer chave privada. `.gitignore` impede inclusão acidental em fluxos Git comuns, mas confira antes de publicar.

### Ativar a IA Grok (opcional)

No computador/servidor que executará o backend:

```bash
cd Pixel-Realms/server
cp .env.example .env
# Edite .env com valores reais
npm run start:env
```

Configurações de `.env`:

- `XAI_API_KEY`: chave privada da API xAI, **exclusivamente no servidor**.
- `XAI_MODEL`: modelo habilitado na sua conta; o exemplo usa `grok-4.7`, que pode ser trocado conforme sua disponibilidade.
- `PORT`: porta HTTP do backend (padrão `8787`).
- `ALLOWED_ORIGINS`: lista separada por vírgulas das origens front-end permitidas, como `http://localhost:8000,https://seu-usuario.github.io` (origem, sem o caminho do repositório).

Use `http://localhost:8787/health` para verificar o status; quando estiver configurado corretamente, `aiConfigured` será `true` (**isso não é teste de chamada real à API**). Em produção, hospede o backend em serviço que rode Node com **HTTPS**, configure `ALLOWED_ORIGINS` e, no site, vá a **Backup e ajustes → URL base do backend**. Digite a URL HTTPS pública do serviço, sem `/api/chat`.

O backend usa `POST https://api.x.ai/v1/responses` e transforma o resultado em texto para a interface. Referência: https://docs.x.ai/developers/rest-api-reference/inference/responses. Há limite de 15 chamadas/minuto por endereço de rede, limite de tamanho de mensagem, validação, tratamento de falha, timeout e CORS. Para uso público em escala, adicione autenticação, cota de custos por usuário, telemetria segura e infraestrutura de produção.

**Não foi realizada chamada real à Grok**, porque não foram fornecidas credenciais nem hospedagem. Um backend local não fornece automaticamente um endpoint público HTTPS.

## Regras, fontes e direitos autorais

- Livro do Jogador, edição 2014: criação de personagens; seis atributos, bônus e modificadores (cap. 1); raças (cap. 2); classes (cap. 3); antecedentes (cap. 4); equipamento (cap. 5); perícias (cap. 7); combate (cap. 9); conjuração e magias (cap. 10–11).
- Manual dos Monstros: organização de criaturas por tipo, tamanho, defesa, PV, deslocamento e ND; referências bibliográficas de nomes/entradas.
- Texto explicativo e estatísticas das oito criaturas de demonstração são originais desta implementação; **não são do Manual dos Monstros e não devem ser apresentadas como oficiais**.
- Os PDFs **não fazem parte deste ZIP**. Mantenha-os em local privado, conforme as condições de uso e direitos aplicáveis.

**Limitações de regras:** apenas cálculo automático dos modificadores, bônus de proficiência, bônus raciais implementados, PV iniciais e CA sem armadura; proficiências de classe e antecedente, CA com equipamento, multiclasses, evolução de PV após nível 1, subclasses, recursos, ataques, concentração, inventário com efeitos, regras de magia detalhadas e balanceamento oficial de encontros exigem configuração manual e consulta às fontes. A raça humana variante não é automatizada. A ficha suporta alterações manuais explícitas de PV máximos e CA para evitar ajustes automáticos indevidos.

## Testes

Na raiz do projeto:

```bash
node --check app.js
node tests/test_rules.mjs
python tests/test_backend.py
python tests/smoke_browser.py
```

O teste de navegador requer Python Playwright e Chromium, não é dependência da aplicação entregue. Na execução neste ambiente, a política bloqueou navegações HTTP/`file://` do Chromium, então o teste integra a interface real **por carregamento equivalente dos módulos ES em memória** e simula a inicialização com a mesma cópia de `localStorage`. O servidor HTTP respondeu ao teste de conexão via `curl`, mas o navegador não navegou a esse endereço. Consultar `AUDITORIA.md`.

### Não implementado nesta versão

- Cadastro de usuários, contas, autenticação e sincronização entre aparelhos.
- Reprodução ou importação automática das estatísticas completas do Manual dos Monstros.
- Todos os feitiços, tabelas, descrições ou subclasses dos livros e suplementos.
- Derivação automática de todas as vantagens, itens mágicos, resistências e bônus opcionais.
- Balanceamento oficial automatizado de encontros.
- Teste com chave real xAI e hospedagem real HTTPS.

Essas melhorias podem ser incorporadas sem reescrever a navegação, a persistência ou os módulos principais.
