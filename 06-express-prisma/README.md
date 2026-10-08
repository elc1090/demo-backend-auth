# 06 - Express + PostgreSQL + Prisma

O banco continua sendo PostgreSQL. A novidade é a camada ORM.

```js
const tasks = await prisma.task.findMany({
  orderBy: { id: "asc" }
});
```

Compare com o SQL explícito do exemplo 05.
