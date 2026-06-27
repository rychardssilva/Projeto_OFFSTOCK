# OffStock

**Quer parar de ficar boiando no controle do estoque?**

O **OffStock** e um sistema web de gerenciamento de estoque criado para tornar o controle de produtos, materiais, ferramentas e consumiveis mais simples, seguro e eficiente.

A proposta do projeto e substituir controles espalhados em planilhas, papeis e anotacoes manuais por uma plataforma centralizada, com cadastro de produtos, acompanhamento de entradas e saidas, gestao de usuarios, historico de movimentacoes e apoio a tomada de decisao.

## O problema

Muitas empresas ainda controlam estoque de forma manual ou pouco integrada. Isso gera problemas como:

- perda de produtos por falta de monitoramento;
- compras desnecessarias por falta de informacao;
- dificuldade para acompanhar entradas e saidas;
- baixa rastreabilidade sobre quem retirou cada material;
- falta de historico confiavel;
- desperdicio de tempo em tarefas repetitivas;
- prejuizos causados por pequenos erros de controle.

Pequenas falhas no estoque podem gerar grandes impactos financeiros e operacionais. O OffStock nasce para reduzir esse risco.

## A solucao

O OffStock centraliza o controle de estoque em uma aplicacao web com interface moderna e fluxo simples de uso.

Com ele, a empresa pode:

- cadastrar produtos, ferramentas, EPIs e materiais;
- consultar o estoque disponivel;
- registrar retiradas de materiais;
- controlar devolucoes de itens retornaveis;
- associar movimentacoes a operadores;
- cadastrar usuarios e administradores;
- acompanhar historico de saidas e devolucoes;
- controlar tentativas de login e bloqueio de contas;
- manter informacoes organizadas em um unico sistema.

## Para quem foi desenvolvido

O OffStock pode ser utilizado em diferentes contextos que dependem de controle de materiais:

- pequenos comercios;
- lojas de varejo;
- distribuidoras;
- pequenas industrias;
- equipes de manutencao;
- estoques internos de empresas;
- operacoes em crescimento que precisam profissionalizar o controle de estoque;
- ambientes tecnicos, como paiois, almoxarifados e plataformas operacionais.

No contexto academico deste projeto, o sistema foi aplicado ao cenario de uma plataforma de petroleo, com controle de ferramentas, consumiveis e materiais retornaveis.

## Beneficios

### Reducao de perdas e desperdicios

Com as movimentacoes registradas, fica mais facil identificar saidas, pendencias e itens que precisam retornar ao estoque.

### Melhor tomada de decisao

As informacoes ficam concentradas no sistema, ajudando administradores a entender a situacao real do estoque.

### Maior organizacao operacional

O controle deixa de depender de registros soltos e passa a seguir um fluxo padronizado.

### Economia de tempo

Consultas, cadastros, retiradas e devolucoes ficam mais rapidas e organizadas.

### Controle completo do estoque

O sistema permite acompanhar produtos cadastrados, quantidades disponiveis, responsaveis pelas retiradas e historico das movimentacoes.

## Funcionalidades implementadas

### Configuracao inicial

Ao iniciar o sistema, o OffStock verifica se ja existe um administrador cadastrado. Caso nao exista, a aplicacao exibe uma tela de configuracao inicial para criar o primeiro administrador.

### Login

Usuarios podem acessar o sistema por meio de credenciais cadastradas. O sistema diferencia operadores e administradores pelo perfil do usuario.

### Controle de perfis

O painel adapta as funcionalidades conforme o perfil:

| Perfil | Permissoes principais |
|---|---|
| Administrador | Cadastrar materiais, cadastrar usuarios, registrar retiradas, registrar devolucoes e consultar historico |
| Operador | Consultar estoque e trocar a senha temporaria quando necessario |

### Cadastro de materiais

O administrador pode cadastrar novos materiais informando:

- nome;
- quantidade;
- localizacao;
- tipo de material: consumivel ou retornavel.

### Consulta de estoque

A tela de consulta permite visualizar os itens cadastrados, suas quantidades, localizacao e tipo.

### Cadastro de operadores

Administradores podem cadastrar operadores para que as retiradas sejam vinculadas a uma pessoa responsavel.

### Cadastro de administradores

O sistema permite criar novos administradores com acesso as funcionalidades de gestao.

### Registro de retirada

Na retirada, o administrador seleciona o material, o operador responsavel, a quantidade solicitada e, quando necessario, uma data prevista de devolucao.

Ao registrar a retirada, o estoque e atualizado e uma movimentacao e criada.

### Registro de devolucao

Itens retornaveis podem aparecer como pendentes de devolucao. Quando o material retorna, o administrador registra a devolucao e o estoque e restaurado.

### Historico de movimentacoes

O historico mostra as movimentacoes de saida e devolucao, permitindo acompanhar o uso dos materiais ao longo do tempo.

### Seguranca de acesso

Esta versao do projeto possui mecanismos de seguranca voltados ao login:

- senha temporaria para operadores recem-cadastrados;
- exigencia de troca da senha padrao;
- validacao de senha forte no backend;
- controle de tentativas incorretas;
- bloqueio automatico de conta apos erros repetidos;
- penalidade temporaria de bloqueio;
- desbloqueio manual por administrador;
- registro de logs de auditoria para bloqueios e desbloqueios.

## Diferenciais do OffStock

- Interface moderna e intuitiva.
- Informacoes organizadas em tempo real para o usuario.
- Controle de acesso por perfil.
- Historico de movimentacoes.
- Separacao entre materiais consumiveis e retornaveis.
- Apoio a reducao de perdas e compras desnecessarias.
- Estrutura de codigo organizada em camadas.
- Base preparada para evoluir com novos recursos, como JWT, relatorios e dashboards.

## Tecnologias utilizadas

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- SQLite
- CORS

### Banco de dados

O projeto utiliza SQLite local, com tabelas para:

- `usuarios`;
- `itens`;
- `movimentacoes`;
- `logs_sistema`.

## Arquitetura do projeto

O OffStock foi organizado em camadas para separar responsabilidades e facilitar manutencao.

Essa organizacao evita concentrar toda a regra no `server.js` e deixa o projeto mais claro:

- componentes React cuidam da interface;
- services do frontend cuidam das chamadas HTTP;
- routes definem os endpoints;
- controllers recebem requisicoes;
- services aplicam regras de negocio;
- repositories executam SQL;
- `database.js` centraliza a conexao SQLite.

## Como executar

Antes de iniciar, instale o Node.js.

### Backend

Abra um terminal na raiz do projeto:

```bash
cd backend
npm install
node server.js
```

O backend sera iniciado em:

```text
http://localhost:3000
```

### Frontend

Abra outro terminal na raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

O Vite exibira o endereco local do frontend, normalmente:

```text
http://localhost:5173
```

## Primeiro uso

1. Inicie o backend.
2. Inicie o frontend.
3. Abra o endereco exibido pelo Vite.
4. Se nao existir administrador, cadastre o primeiro admin na tela de setup.
5. Faca login.
6. Cadastre materiais.
7. Cadastre operadores.
8. Registre retiradas e devolucoes.
9. Consulte estoque e historico.

## Regras importantes

- Operadores cadastrados com senha temporaria devem trocar a senha no primeiro acesso.
- A nova senha precisa cumprir os criterios de seguranca definidos no backend.
- Contas podem ser bloqueadas apos tentativas incorretas de login.
- Itens consumiveis representam materiais que nao retornam ao estoque.
- Itens retornaveis podem gerar pendencias de devolucao.
- O historico registra as movimentacoes de saida e devolucao.

## Melhorias futuras

Alguns pontos previstos para evolucao:

- autenticacao por JWT;
- hash de senhas com bcrypt;
- relatorios exportaveis;
- dashboard com indicadores;
- alerta de estoque minimo;
- filtros avancados no historico;
- validacao mais completa de CPF e e-mail;
- deploy em ambiente online;
- testes automatizados.

## Status do projeto

O OffStock esta em desenvolvimento e possui os principais fluxos funcionais para demonstracao:

- configuracao inicial;
- login;
- painel por perfil;
- cadastro de materiais;
- cadastro de operadores;
- cadastro de administradores;
- consulta de estoque;
- retirada;
- devolucao;
- historico;
- bloqueio de login;
- logs de auditoria.

## Contato apresentado no material

```text
E-mail: offstock@ufrrj.com.br
Telefone: (21) 4002-8922
```

## Objetivo academico

O projeto demonstra a integracao entre frontend, backend e banco de dados em uma aplicacao completa, com organizacao modular, regras de negocio e uma proposta real de valor: transformar o controle de estoque em uma tarefa mais simples, segura e inteligente.
