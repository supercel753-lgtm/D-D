# Auditoria técnica — Pixel Realms

**Data:** 27/10/2026. **Documentos analisados:** script de especificação, arquivo ZIP `D-D-main`, Livro do Jogador D&D 5e 2014 e Manual dos Monstros enviados pelo usuário.

## 1. Condição dos arquivos originais

| Original | Função planejada | Resultado da auditoria | Medida adotada |
|---|---|---|---|
| `index.html` (4.102 B) | Página, tela inicial, formulário de criação | Interrompido no elemento `<option>` de alinhamento; não contém fechamento de DOM, demais telas ou script funcional | Reestruturado em HTML completo; original conservado em `legacy/index.original.txt` |
| `script.js` (4.102 B) | Catálogo de raças/classes e lógica da interface | Termina em `"Bardo": {` e `...`; erro de sintaxe `Unexpected end of input`, sem funções de inicialização | Reconstruído em regras, módulos e app; resumo da proposta incorporado |
| `style.css` (4.102 B) | Tema pixel | Termina em `grid-template-columns: repeat(` e `...`, sem fechar CSS | Tema refeito, layout responsivo; original conservado |
| `server/*`, `data/*`, `README.md` | Módulos previstos pelo roteiro | Não existem no ZIP original | Criados de acordo com escopo entregue |

**Dependências originais:** `index.html → style.css` e URL externa opcional de fontes; JavaScript original incompleto não aparece conectado em fragmento final entregue. Não havia armazenamento verificável. Nenhuma funcionalidade original foi confirmada operacional. Por isso, as três fontes foram arquivadas, e a base foi reconstruída sem descartar os arquivos recebidos.

## 2. Fontes documentais consultadas

Livro do Jogador: sumário com criação, raças, classes, antecedentes, equipamentos, perícias, combate e magias; páginas do PDF consultadas para geração por 4d6, conjunto 15/14/13/12/10/8, modificadores, PV e dado de vida iniciais, proficiência, testes, iniciativa e classes. Manual dos Monstros: sumário e páginas iniciais sobre tipos, tamanho e composição dos blocos de estatísticas. O projeto não extraiu, não publicou e não incorporou os PDFs integralmente.

A divisão explícita entre referência bibliográfica, implementação de regra verificável e conteúdo narrativo original evita apresentar estatísticas inventadas como oficiais. A tabela de monstros tem somente estatísticas **criadas especificamente para o Pixel Realms**. Não foram inventados valores oficiais de criaturas do livro.

## 3. Decisões de arquitetura

- Site estático com módulos ES, caminhos relativos e CSS sem bibliotecas externas obrigatórias.
- `rules.js` centraliza operações puras, compartilháveis por fichas, encontros e dados.
- `storage.js` valida o schema versão 1 e mantém um único armazenamento; não apaga dados automaticamente se a carga falhar.
- `app.js` centraliza navegação, confirmações e atualização da interface.
- Backend Node independente sem credenciais no front-end, CORS com allow-list, limitação de requisições e integração xAI Responses API.
- Escapamento de texto não confiável antes de gerar HTML, validação de campos e confirmação para exclusões e substituição por backup.
- Originais incompletos preservados para rastreabilidade e excluídos da execução.

## 4. Testes efetivamente executados

| Teste | Resultado |
|---|---|
| `node --check` em todos os arquivos JavaScript novos | Aprovado |
| Resolução de referências relativas entre módulos | Aprovado |
| Testes unitários: modificadores, proficiência, PV, bônus raciais, rolagens, schema | Aprovado |
| Interface real em Chromium via módulos ES carregados em memória | Aprovado; sem exceções JavaScript |
| Criar ficha em quatro passos, abrir, adicionar item e condição | Aprovado |
| Cadastrar campanha, sessão e nota | Aprovado |
| Pesquisa e filtro no bestiário, criar criatura, incluir em encontro | Aprovado |
| Incluir personagem em encontro, rolar iniciativa, avançar turno | Aprovado |
| Rolagem NdX±modificador e índice de magias | Aprovado |
| Exportação de arquivo JSON pelo navegador | Aprovado |
| Recuperar ficha após nova inicialização, com o armazenamento anterior | Aprovado |
| Interface em viewport móvel e desktop | Renderização e capturas geradas, sem exceções |
| Backend `/health`, indisponibilidade sem credencial, CORS e rota inexistente | Aprovado |
| Navegação direta Chromium via HTTP/`file://` | Bloqueada por política administrativa do ambiente — não concluída |
| Chamada real à API Grok, hosting HTTPS e importação de backup confirmada após recarregar no navegador | Não executados (sem chave/serviço externo e bloqueio de navegação) |

**Observação:** o teste de navegador usa os MESMOS arquivos e lógica JavaScript do projeto; para contornar a política que impede abrir URLs locais, reconstrói URLs Blob dos módulos e fornece `localStorage` simulado. Isso testa eventos e renderização, mas não prova deploy público por si só. O servidor HTTP local respondeu `200 OK` em teste separado.

## 5. Riscos e próximos incrementos

| Prioridade | Item | Estado |
|---|---|---|
| Alta | Usuário deve exportar backup antes de trocar navegador/equipamento | Documentado |
| Alta | Completar regras de classe, proficiências restritas, progressão e CA com equipamentos | Pendente; edição manual presente |
| Alta | Publicar backend Node com HTTPS, conta xAI e monitoramento de custos | Pendente por depender de configuração externa |
| Média | Cadastro amplo e autorizado de magias, equipamentos e criaturas de referência | Pendente por escopo e direitos autorais |
| Média | Sincronização/autenticação em banco remoto com políticas adequadas | Não incluída nesta versão |
| Média | Testes E2E HTTP completos em máquina de desenvolvimento ou pipeline CI | Pendente no ambiente atual |

Este documento descreve apenas funcionalidades verificadas no escopo entregue. Não equivale a afirmar cobertura integral das regras de D&D 5e.
