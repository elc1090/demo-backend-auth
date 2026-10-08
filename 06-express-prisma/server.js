import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(express.static("public"));

async function seedIfEmpty() {
  if (await prisma.task.count() === 0) {
    await prisma.task.createMany({
      data: [
        { title: "Os dados continuam no PostgreSQL" },
        { title: "Agora o acesso passa pelo Prisma" }
      ]
    });
  }
}

app.get("/api/tasks", async (_req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { id: "asc" } });
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });
  const task = await prisma.task.create({ data: { title } });
  res.status(201).json(task);
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "task not found" });
  }
});

seedIfEmpty()
  .then(() => app.listen(8080, "0.0.0.0"))
  .catch(error => { console.error(error); process.exit(1); });
