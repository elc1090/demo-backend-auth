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

Sem usar uma camada de Object-Relational Mapping (ORM), o SQL fica exposto no código:

```js
const { rows } = await pool.query(
  "SELECT id, title FROM tasks ORDER BY id"
);
```

### 06: Prisma

Usando uma ferramenta de ORM como Prisma, o código não lida diretamente com SQL:

```js
const tasks = await prisma.task.findMany({
  orderBy: { id: "asc" }
});
```

O banco continua PostgreSQL, só muda a camada de acesso, mais abstratída. Podemos substituir o banco por SQLite, MySQL, etc., sem alterar este código.

### 07: MongoDB

O backend usa o driver oficial diretamente, sem ODM (Object-Documet Mapping), para que a mudança principal seja o modelo/banco.

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

- Os exemplos são propositalmente simples e não podem ser usados em produção sem alguns cuidados. 
- As credenciais de demonstração estão expostas na interface. É uma facilidade para testes, mas obviamente não se faz isso em uma aplicação real.
- O exemplo de sessão (04) usa store em memória. Em uma aplicação real, a sessão seria persistida em um banco de dados.
- O exemplo com JWT (08) não tem refresh token. Em uma aplicação real, isso é altamente recomendável.
- O Prisma usa `db push` para criar o banco automaticamente. Em produção, se usa `db migrate`.
- O exemplo com Supabase exige configuração externa.


A pergunta central em todos os exemplos é:

> Quem recebe a requisição, onde está a lógica, onde estão os dados e quem é responsável pela autenticação/autorização?
