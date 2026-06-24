# Casos de Uso — Sistema de Apostas da Copa do Mundo

## Atores

- **Visitante**: usuário não autenticado, navega apenas pela listagem de jogos.
- **Usuário (Apostador)**: pessoa autenticada que faz apostas nos jogos e acompanha seu histórico/pontuação.
- **Administrador**: usuário com papel `admin`, responsável por cadastrar times, jogos e registrar resultados.
- **Sistema**: executa o cálculo automático de pontuação após o registro de um resultado.

## Diagrama geral (textual)

```
Visitante ──────────────► (UC03) Listar Jogos

Usuário ──────────────► (UC01) Cadastrar Usuário
        ──────────────► (UC02) Realizar Login
        ──────────────► (UC03) Listar Jogos
        ──────────────► (UC04) Realizar Aposta
        ──────────────► (UC05) Consultar Histórico de Apostas
        ──────────────► (UC06) Alterar/Remover Aposta

Administrador ─────────► (UC02) Realizar Login
              ─────────► (UC07) Gerenciar Times
              ─────────► (UC08) Gerenciar Jogos
              ─────────► (UC09) Registrar Resultado de Jogo
              ─────────► (UC10) Gerenciar Usuários

Sistema ────────────────► (UC11) Calcular Pontuação das Apostas (disparado pelo UC09)
```

---

## UC01 — Cadastrar Usuário

**Ator principal:** Visitante
**Pré-condição:** O visitante não possui conta no sistema.
**Pós-condição:** Uma nova conta é criada e o usuário é autenticado automaticamente.

**Fluxo principal:**
1. O visitante acessa a tela de Cadastro.
2. Informa nome, e-mail, senha e confirmação de senha.
3. O sistema valida os dados (formato de e-mail, senha com mínimo de 6 caracteres, senhas coincidentes).
4. O sistema verifica que o e-mail ainda não está cadastrado.
5. O sistema cria o usuário (`POST /api/usuarios/registrar`), armazenando a senha com hash (bcrypt).
6. O sistema gera um token JWT e retorna os dados do usuário autenticado.
7. O usuário é redirecionado para a listagem de jogos.

**Fluxos alternativos:**
- 4a. E-mail já cadastrado: o sistema retorna erro 409 e exibe mensagem "Já existe um usuário cadastrado com este e-mail".
- 3a. Dados inválidos: o sistema exibe mensagens de validação nos campos correspondentes, sem enviar a requisição.

---

## UC02 — Realizar Login

**Ator principal:** Usuário, Administrador
**Pré-condição:** O ator possui uma conta cadastrada e ativa.
**Pós-condição:** O ator está autenticado e recebe um token JWT armazenado no navegador.

**Fluxo principal:**
1. O ator acessa a tela de Login.
2. Informa e-mail e senha.
3. O sistema valida as credenciais (`POST /api/usuarios/login`).
4. O sistema gera um token JWT contendo id, nome, e-mail e papel (`usuario` ou `admin`).
5. O frontend armazena o token e os dados do usuário (localStorage) e redireciona para a listagem de jogos.

**Fluxos alternativos:**
- 3a. Credenciais inválidas: o sistema retorna erro 401 e exibe mensagem "Credenciais inválidas".
- 3b. Conta inativa (`ativo: false`): o sistema nega o login.

---

## UC03 — Listar Jogos

**Ator principal:** Visitante, Usuário, Administrador
**Pré-condição:** Nenhuma (acesso público).
**Pós-condição:** Os jogos cadastrados são exibidos, com times, data, estádio, fase e status.

**Fluxo principal:**
1. O ator acessa a tela inicial / "Jogos".
2. O sistema consulta a lista de jogos (`GET /api/jogos`), populando os dados dos times envolvidos.
3. O sistema exibe os jogos, indicando status (agendado, em andamento, finalizado, cancelado) e, quando finalizado, o placar.
4. Para jogos agendados e ainda não iniciados, é exibido o botão "Fazer aposta".

**Fluxos alternativos:**
- 4a. Visitante não autenticado clica em "Fazer aposta": é redirecionado para a tela de Login.

---

## UC04 — Realizar Aposta

**Ator principal:** Usuário
**Pré-condição:** O usuário está autenticado; o jogo selecionado está com status `agendado` e ainda não começou; o usuário ainda não apostou nesse jogo.
**Pós-condição:** Uma aposta é registrada vinculada ao usuário e ao jogo.

**Fluxo principal:**
1. O usuário seleciona um jogo na listagem e clica em "Fazer aposta".
2. O sistema exibe a tela de aposta com os dados do confronto.
3. O usuário informa o palpite de gols para o time da casa e para o time visitante.
4. O sistema envia a aposta (`POST /api/apostas`).
5. O sistema valida que o jogo ainda não começou e que não existe aposta duplicada do mesmo usuário para o mesmo jogo.
6. A aposta é criada com status `pendente` e o usuário é redirecionado para o histórico de apostas.

**Fluxos alternativos:**
- 5a. Jogo já iniciado ou finalizado: o sistema retorna erro 400 "Não é possível apostar em um jogo que já começou ou foi finalizado".
- 5b. Aposta duplicada: o sistema retorna erro 409 "Você já registrou uma aposta para este jogo".

---

## UC05 — Consultar Histórico de Apostas

**Ator principal:** Usuário
**Pré-condição:** O usuário está autenticado.
**Pós-condição:** O usuário visualiza todas as apostas que já realizou, com status e pontuação.

**Fluxo principal:**
1. O usuário acessa a tela "Minhas apostas".
2. O sistema consulta as apostas do usuário autenticado (`GET /api/apostas/minhas`), populando os dados do jogo e dos times.
3. O sistema exibe a lista com palpite, resultado real (quando disponível), status e pontos ganhos, além do total acumulado.

---

## UC06 — Alterar ou Remover Aposta

**Ator principal:** Usuário
**Pré-condição:** O usuário é o dono da aposta; o jogo relacionado ainda não começou.
**Pós-condição:** A aposta é atualizada ou removida.

**Fluxo principal:**
1. No histórico de apostas, o usuário seleciona uma aposta de um jogo ainda não iniciado.
2. O usuário altera o palpite (`PUT /api/apostas/:id`) ou solicita a remoção (`DELETE /api/apostas/:id`).
3. O sistema valida que o jogo ainda está agendado e não iniciou.
4. A alteração/remoção é confirmada.

**Fluxos alternativos:**
- 3a. Jogo já iniciado: o sistema rejeita a operação com erro 400.
- 1a. Aposta de outro usuário: o sistema rejeita com erro 403.

---

## UC07 — Gerenciar Times

**Ator principal:** Administrador
**Pré-condição:** O ator está autenticado com papel `admin`.
**Pós-condição:** Times são criados, atualizados ou removidos.

**Fluxo principal:**
1. O administrador cadastra um time informando nome, sigla, grupo, confederação e URL da bandeira (`POST /api/times`).
2. O administrador pode editar (`PUT /api/times/:id`) ou remover (`DELETE /api/times/:id`) um time existente.

**Fluxos alternativos:**
- 1a. Usuário sem papel `admin` tenta a operação: o sistema retorna erro 403.

---

## UC08 — Gerenciar Jogos

**Ator principal:** Administrador
**Pré-condição:** O ator está autenticado com papel `admin`; os times envolvidos já existem cadastrados.
**Pós-condição:** Jogos são criados, atualizados ou removidos.

**Fluxo principal:**
1. O administrador cadastra um jogo informando time da casa, time visitante, data/hora, fase e estádio (`POST /api/jogos`).
2. O administrador pode editar (`PUT /api/jogos/:id`) ou remover (`DELETE /api/jogos/:id`) um jogo.

---

## UC09 — Registrar Resultado de Jogo

**Ator principal:** Administrador
**Pré-condição:** O jogo existe e ainda não teve resultado definitivo registrado.
**Pós-condição:** O jogo passa a ter status `finalizado` com o placar final, e todas as apostas relacionadas são pontuadas (dispara o UC11).

**Fluxo principal:**
1. O administrador acessa o jogo e informa o placar final (gols do time da casa e do time visitante).
2. O sistema atualiza o jogo (`PUT /api/jogos/:id/resultado`) com `golsCasa`, `golsFora` e `status: finalizado`.
3. O sistema executa o cálculo de pontuação (UC11) para todas as apostas associadas a esse jogo.

---

## UC10 — Gerenciar Usuários

**Ator principal:** Administrador
**Pré-condição:** O ator está autenticado com papel `admin`.
**Pós-condição:** Usuários podem ser listados, ter papel/status alterado ou serem removidos.

**Fluxo principal:**
1. O administrador lista os usuários cadastrados (`GET /api/usuarios`), ordenados por pontuação.
2. O administrador pode promover um usuário a `admin`, desativar uma conta (`PUT /api/usuarios/:id`) ou removê-la (`DELETE /api/usuarios/:id`).

---

## UC11 — Calcular Pontuação das Apostas (caso de uso de sistema)

**Ator principal:** Sistema (disparado automaticamente pelo UC09)
**Pré-condição:** Um resultado de jogo acabou de ser registrado.
**Pós-condição:** Todas as apostas relacionadas ao jogo recebem pontuação e status atualizados; a pontuação total dos usuários é incrementada.

**Fluxo principal:**
1. O sistema busca todas as apostas vinculadas ao jogo finalizado.
2. Para cada aposta, compara o palpite com o placar real:
   - Se o palpite reproduz exatamente o placar final → **3 pontos**, status `acertou_placar`.
   - Se o palpite acerta apenas o resultado (vitória da casa, vitória do visitante ou empate) sem o placar exato → **1 ponto**, status `acertou_vencedor`.
   - Caso contrário → **0 pontos**, status `errou`.
3. O sistema grava a pontuação e o status em cada aposta.
4. O sistema incrementa o campo `pontuacaoTotal` do usuário correspondente quando a pontuação obtida é maior que zero.
