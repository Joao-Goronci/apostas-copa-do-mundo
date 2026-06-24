# Estrutura do Banco de Dados MongoDB

Banco de dados: `apostas_copa`

O sistema utiliza 4 coleções principais, gerenciadas via Mongoose: `usuarios`, `times`, `jogos` e `apostas`.

---

## Coleção `usuarios`

Armazena os dados de autenticação e perfil de cada usuário do sistema.

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Identificador único gerado pelo MongoDB |
| `nome` | String | Nome completo do usuário |
| `email` | String | E-mail (único, usado para login) |
| `senha` | String | Hash da senha (bcrypt), nunca retornado nas consultas padrão |
| `papel` | String | `usuario` ou `admin` |
| `pontuacaoTotal` | Number | Soma dos pontos obtidos em todas as apostas já calculadas |
| `ativo` | Boolean | Permite desativar uma conta sem excluí-la |
| `createdAt` / `updatedAt` | Date | Controle automático de timestamps |

### Exemplo de documento

```json
{
  "_id": "665f1c2e4b1a2c0012a3b456",
  "nome": "Maria Silva",
  "email": "maria.silva@email.com",
  "senha": "$2a$10$N9qo8uLOickgx2ZMRZoMye1Jc8h6f8K0e3a1b2c3d4e5f6g7h8i9j0",
  "papel": "usuario",
  "pontuacaoTotal": 7,
  "ativo": true,
  "createdAt": "2026-05-10T12:00:00.000Z",
  "updatedAt": "2026-06-22T18:30:00.000Z"
}
```

### Índices

- `email`: índice único (`unique: true`)

---

## Coleção `times`

Armazena os times (seleções) participantes da Copa do Mundo.

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Identificador único |
| `nome` | String | Nome da seleção |
| `sigla` | String | Sigla de 2 a 3 letras (ex: BRA, ARG) |
| `bandeiraUrl` | String | URL da imagem da bandeira |
| `grupo` | String | Grupo da fase de grupos (A, B, C...) |
| `confederacao` | String | Confederação (CONMEBOL, UEFA, CAF, AFC, CONCACAF...) |
| `createdAt` / `updatedAt` | Date | Controle automático de timestamps |

### Exemplo de documento

```json
{
  "_id": "665f1c2e4b1a2c0012a3b401",
  "nome": "Brasil",
  "sigla": "BRA",
  "bandeiraUrl": "https://exemplo.com/bandeiras/bra.png",
  "grupo": "A",
  "confederacao": "CONMEBOL",
  "createdAt": "2026-05-01T10:00:00.000Z",
  "updatedAt": "2026-05-01T10:00:00.000Z"
}
```

---

## Coleção `jogos`

Armazena os confrontos entre times, com data, fase, local e resultado.

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Identificador único |
| `timeCasa` | ObjectId (ref `times`) | Time da casa |
| `timeFora` | ObjectId (ref `times`) | Time visitante |
| `dataHora` | Date | Data/hora de início do jogo |
| `fase` | String | `grupos`, `oitavas`, `quartas`, `semifinal`, `final`, `terceiro_lugar` |
| `estadio` | String | Nome do estádio/local |
| `golsCasa` | Number \| null | Gols marcados pelo time da casa (preenchido ao final do jogo) |
| `golsFora` | Number \| null | Gols marcados pelo time visitante |
| `status` | String | `agendado`, `em_andamento`, `finalizado`, `cancelado` |
| `createdAt` / `updatedAt` | Date | Controle automático de timestamps |

### Exemplo de documento (jogo agendado)

```json
{
  "_id": "665f1c2e4b1a2c0012a3b501",
  "timeCasa": "665f1c2e4b1a2c0012a3b401",
  "timeFora": "665f1c2e4b1a2c0012a3b402",
  "dataHora": "2026-06-24T16:00:00.000Z",
  "fase": "grupos",
  "estadio": "Estádio Nacional",
  "golsCasa": null,
  "golsFora": null,
  "status": "agendado",
  "createdAt": "2026-05-01T10:00:00.000Z",
  "updatedAt": "2026-05-01T10:00:00.000Z"
}
```

### Exemplo de documento (jogo finalizado)

```json
{
  "_id": "665f1c2e4b1a2c0012a3b503",
  "timeCasa": "665f1c2e4b1a2c0012a3b409",
  "timeFora": "665f1c2e4b1a2c0012a3b410",
  "dataHora": "2026-06-22T13:00:00.000Z",
  "fase": "grupos",
  "estadio": "Estádio Internacional",
  "golsCasa": 2,
  "golsFora": 1,
  "status": "finalizado",
  "createdAt": "2026-05-01T10:00:00.000Z",
  "updatedAt": "2026-06-22T15:10:00.000Z"
}
```

### Índices

- `dataHora`: índice simples para acelerar a ordenação cronológica da listagem de jogos

---

## Coleção `apostas`

Armazena o palpite de cada usuário para cada jogo, junto com a pontuação obtida após o resultado ser registrado.

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Identificador único |
| `usuario` | ObjectId (ref `usuarios`) | Quem fez a aposta |
| `jogo` | ObjectId (ref `jogos`) | Jogo apostado |
| `palpiteGolsCasa` | Number | Palpite de gols do time da casa |
| `palpiteGolsFora` | Number | Palpite de gols do time visitante |
| `pontosGanhos` | Number | Pontos obtidos após o cálculo do resultado (0, 1 ou 3) |
| `status` | String | `pendente`, `acertou_placar`, `acertou_vencedor`, `errou` |
| `createdAt` / `updatedAt` | Date | Controle automático de timestamps |

### Regras de pontuação

- **3 pontos**: acertou o placar exato
- **1 ponto**: acertou apenas o resultado (vitória do time da casa, vitória do visitante ou empate), mas não o placar exato
- **0 pontos**: errou o resultado

### Exemplo de documento (aposta pendente)

```json
{
  "_id": "665f1c2e4b1a2c0012a3b601",
  "usuario": "665f1c2e4b1a2c0012a3b456",
  "jogo": "665f1c2e4b1a2c0012a3b501",
  "palpiteGolsCasa": 1,
  "palpiteGolsFora": 0,
  "pontosGanhos": 0,
  "status": "pendente",
  "createdAt": "2026-06-20T09:15:00.000Z",
  "updatedAt": "2026-06-20T09:15:00.000Z"
}
```

### Exemplo de documento (aposta já calculada)

```json
{
  "_id": "665f1c2e4b1a2c0012a3b602",
  "usuario": "665f1c2e4b1a2c0012a3b456",
  "jogo": "665f1c2e4b1a2c0012a3b503",
  "palpiteGolsCasa": 2,
  "palpiteGolsFora": 1,
  "pontosGanhos": 3,
  "status": "acertou_placar",
  "createdAt": "2026-06-15T08:00:00.000Z",
  "updatedAt": "2026-06-22T15:10:00.000Z"
}
```

### Índices

- `{ usuario: 1, jogo: 1 }`: índice composto único, garante que cada usuário só possa apostar **uma vez** em cada jogo

---

## Relacionamentos entre as coleções

```
usuarios (1) ──── (N) apostas (N) ──── (1) jogos (N) ──── (1) times
                                                    \____ (1) times  (timeCasa e timeFora)
```

- Um **usuário** pode ter várias **apostas**.
- Um **jogo** pode ter várias **apostas** (uma por usuário).
- Um **jogo** referencia exatamente dois **times** (`timeCasa` e `timeFora`).
- As referências entre coleções são feitas por `ObjectId` e resolvidas via `populate()` do Mongoose quando necessário (ex: ao listar jogos com os dados dos times, ou apostas com os dados do jogo e do usuário).
