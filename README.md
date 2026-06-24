# Apostas Copa do Mundo — Projeto MEAN

Sistema completo para gerenciamento de apostas da Copa do Mundo, construído com a stack **MEAN** (MongoDB, Express, Angular, Node.js).

Os usuários podem se cadastrar, consultar os jogos da Copa, registrar palpites de placar e acompanhar seu histórico e pontuação. Administradores gerenciam times, jogos e registram os resultados, que disparam o cálculo automático de pontos das apostas.

## Estrutura do projeto

```
apostas-mean/
├── backend/              API REST em Node.js + Express + Mongoose
├── frontend/              Aplicação Angular (SPA)
├── wireframes/            Esboços HTML das telas principais
├── casos-de-uso.md        Documentação dos casos de uso do sistema
├── mongodb-estrutura.md   Estrutura das coleções MongoDB com exemplos de documentos
└── README.md
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (inclui o `npm`)
- [MongoDB](https://www.mongodb.com/try/download/community) em execução localmente (ou uma instância no MongoDB Atlas)
- [Angular CLI](https://angular.dev/tools/cli) instalado globalmente (`npm install -g @angular/cli`)

## 1. Backend (API Express + MongoDB)

```bash
cd backend
npm install
cp .env.example .env
```

Edite o arquivo `.env` se necessário (porta, string de conexão do MongoDB, segredo do JWT):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/apostas_copa
JWT_SECRET=troque_este_segredo_em_producao
JWT_EXPIRES_IN=7d
```

### Popular o banco com dados de exemplo (opcional, recomendado)

Cria os 32 times da Copa, alguns jogos de exemplo, um usuário administrador e um usuário comum:

```bash
npm run seed
```

Usuários criados pelo seed:

| Papel | E-mail | Senha |
|---|---|---|
| Administrador | admin@apostascopa.com | admin123 |
| Usuário comum | usuario@apostascopa.com | usuario123 |

### Executar o servidor

```bash
npm run dev    # com reinício automático (nodemon)
# ou
npm start      # produção
```

A API ficará disponível em `http://localhost:3000/api`. Teste com:

```bash
curl http://localhost:3000/api/saude
```

### Principais rotas da API

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| POST | `/api/usuarios/registrar` | Cadastrar novo usuário | Público |
| POST | `/api/usuarios/login` | Autenticar usuário | Público |
| GET | `/api/usuarios/perfil` | Dados do usuário autenticado | Autenticado |
| GET | `/api/usuarios` | Listar usuários | Admin |
| GET / PUT / DELETE | `/api/usuarios/:id` | Detalhar / atualizar / remover usuário | Admin |
| GET | `/api/times` | Listar times | Público |
| POST / PUT / DELETE | `/api/times` `/api/times/:id` | Gerenciar times | Admin |
| GET | `/api/jogos` | Listar jogos (filtros `?fase=` e `?status=`) | Público |
| POST / PUT / DELETE | `/api/jogos` `/api/jogos/:id` | Gerenciar jogos | Admin |
| PUT | `/api/jogos/:id/resultado` | Registrar placar final e calcular pontos das apostas | Admin |
| POST | `/api/apostas` | Registrar uma aposta | Autenticado |
| GET | `/api/apostas/minhas` | Histórico de apostas do usuário autenticado | Autenticado |
| GET | `/api/apostas` | Listar todas as apostas | Admin |
| GET / PUT / DELETE | `/api/apostas/:id` | Detalhar / atualizar / remover aposta | Autenticado (dono) / Admin |

Rotas autenticadas exigem o cabeçalho `Authorization: Bearer <token>`, obtido no login/cadastro.

## 2. Frontend (Angular)

Em outro terminal:

```bash
cd frontend
npm install
npm start
```

A aplicação ficará disponível em `http://localhost:4200`. O `environment.ts` já aponta para a API local em `http://localhost:3000/api` — ajuste em `src/environments/environment.ts` caso a API rode em outro endereço.

### Telas disponíveis

- **/login** — autenticação de usuários
- **/cadastro** — criação de conta
- **/jogos** — listagem de todos os jogos da Copa, com placar e status
- **/apostas/nova/:jogoId** — formulário para registrar o palpite em um jogo (requer login)
- **/apostas/historico** — histórico de apostas do usuário, com status e pontuação (requer login)

## 3. Banco de dados MongoDB

O backend se conecta automaticamente ao banco definido em `MONGODB_URI` (criado sob demanda pelo MongoDB caso não exista). As coleções utilizadas são:

- `usuarios`
- `times`
- `jogos`
- `apostas`

Veja a descrição completa dos campos e exemplos de documentos JSON de cada coleção em [`mongodb-estrutura.md`](./mongodb-estrutura.md).

## 4. Documentação adicional

- [`casos-de-uso.md`](./casos-de-uso.md) — descrição dos atores e casos de uso do sistema (cadastro, login, apostar, gerenciar jogos/times, cálculo de pontuação, etc.)
- [`wireframes/`](./wireframes/index.html) — esboços HTML de baixa fidelidade das telas de Login, Cadastro, Listagem de Jogos, Fazer Aposta e Histórico de Apostas. Abra `wireframes/index.html` em um navegador para visualizar.

## Regras de pontuação das apostas

Quando um administrador registra o placar final de um jogo, o sistema calcula automaticamente a pontuação de cada aposta relacionada:

- **3 pontos** — o palpite acertou o placar exato
- **1 ponto** — o palpite acertou apenas o resultado (vitória da casa, vitória do visitante ou empate), sem o placar exato
- **0 pontos** — o palpite errou o resultado

A pontuação obtida é somada ao campo `pontuacaoTotal` do usuário.

## Tecnologias utilizadas

**Backend:** Node.js, Express, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`

**Frontend:** Angular 17, RxJS, Angular Router, Reactive Forms, HttpClient (com interceptor de autenticação)

**Banco de dados:** MongoDB
