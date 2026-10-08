import express from "express";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();

app.use(express.json());
app.use(express.static("public"));

async function initialize() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL CHECK (length(trim(title)) > 0)
    )
  `);

  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM tasks");
  if (rows[0].count === 0) {
    await pool.query(
      "INSERT INTO tasks (title) VALUES ($1), ($2)",
      ["Agora os dados persistem no PostgreSQL", "O backend usa SQL diretamente"]
    );
  }
}

app.get("/api/tasks", async (_req, res) => {
  const { rows } = await pool.query("SELECT id, title FROM tasks ORDER BY id");
  res.json(rows);
});

app.post("/api/tasks", async (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });
  const { rows } = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING id, title",
    [title]
  );
  res.status(201).json(rows[0]);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const result = await pool.query("DELETE FROM tasks WHERE id = $1", [Number(req.params.id)]);
  if (result.rowCount === 0) return res.status(404).json({ error: "task not found" });
  res.status(204).end();
});

initialize()
  .then(() => app.listen(8080, "0.0.0.0"))
  .catch(error => { console.error(error); process.exit(1); });
