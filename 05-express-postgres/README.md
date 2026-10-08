# 05 - Express + PostgreSQL

Primeiro exemplo com persistência real. O backend usa o driver `pg` e SQL diretamente.

Compare principalmente:

```js
const { rows } = await pool.query(
  "SELECT id, title FROM tasks ORDER BY id"
);
```

com o acesso via ORM do exemplo 06.
