# Backend Examples — Hands-on

Exemplos minimalistas de códigos para comparar maneiras de implementar o backend de uma
aplicação web. A aplicação é muito simples: uma lista de tarefas.

## Progressão

| # | Exemplo | Conceito novo |
|---|---|---|
| 01 | Express in-memory | backend HTTP mínimo |
| 02 | FastAPI in-memory | mesmo contrato em Python |
| 03 | Spring in-memory | mesmo contrato em Java |
| 04 | Express session auth | sessão + cookie + autorização |
| 05 | Express + PostgreSQL | persistência + SQL direto |
| 06 | Express + PostgreSQL + Prisma | ORM |
| 07 | Express + MongoDB | NoSQL/documentos |
| 08 | Express token auth | JWT/Bearer token |
| 09 | Supabase Auth | BaaS + PostgreSQL + RLS |

## Pré-requisitos

- VS Code
- Docker com `docker compose` ou `docker-compose`

Não é necessário instalar Node.js, Python, Java, Maven ou bibliotecas dos
frameworks na máquina local.


## Contrato básico

Nos exemplos 01, 02, 03, 05, 06 e 07 o frontend usa o mesmo contrato:

```text
GET    /api/tasks
POST   /api/tasks
DELETE /api/tasks/:id
```

## Rodando

No VS Code: `Terminal → Run Task`.

Ou:

```bash
docker compose up --build express
```

Serviços disponíveis:

```text
express
fastapi
spring
session-auth
express-postgres
express-prisma
express-mongodb
token-auth
supabase-auth
```

Todos expõem `http://localhost:8080`. Antes de trocar de exemplo:

```bash
docker compose down
```

Dependendo da instalação do Docker, substitua `docker compose` por `docker-compose`.


## Persistência

01–04 e 08 usam memória. 05–07 usam volumes Docker. Com isso, `docker compose down` não apaga os dados dos bancos. Para reiniciar também os dados:

```bash
docker compose down -v
```

## Comparações 

### 05: SQL direto

```js
const { rows } = await pool.query(
  "SELECT id, title FROM tasks ORDER BY id"
);
```

### 06: Prisma

```js
const tasks = await prisma.task.findMany({
  orderBy: { id: "asc" }
});
```

O banco continua PostgreSQL; muda a camada de acesso.

### 07: MongoDB

O backend usa o driver oficial diretamente, sem ODM, para que a mudança principal seja o modelo/banco.

### 04: sessão

```text
browser --cookie de sessão--> Express --consulta estado da sessão-->
```

### 08: token

```text
browser --Authorization: Bearer JWT--> Express --verifica token-->
```

### 09: Supabase

```text
browser → Supabase Auth
browser → Data API → PostgreSQL + RLS
```

## GitHub Codespaces

Há um `.devcontainer/devcontainer.json` com Docker-in-Docker e encaminhamento da porta 8080. No GitHub: `Code → Codespaces → Create codespace` e depois use as mesmas Tasks do VS Code.

## Observações

- Os exemplos 01–04 são pouco realistas, pois : por exemplo, usam contas no próprio código. O objetivo é dar visibilidade a conceitos, não servir de modelo.

- O exemplo Supabase usa um projeto Supabase real e portanto depende de acesso à internet.


Os exemplos privilegiam visibilidade conceitual, não produção. Credenciais e secrets de demonstração são intencionais; o exemplo de sessão usa store em memória; o JWT não tem refresh token; o Prisma usa `db push`; e o Supabase exige configuração externa.

A pergunta central em todos os exemplos é:

> Quem recebe a requisição, onde está a lógica, onde estão os dados e quem é responsável pela autenticação/autorização?
