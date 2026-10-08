import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const secret = process.env.JWT_SECRET || "demo-jwt-secret";

app.use(express.json());
app.use(express.static("public"));

const users = [
  { id: 1, email: "ana@example.com", role: "user", passwordHash: bcrypt.hashSync("ana12345", 10) },
  { id: 2, email: "admin@example.com", role: "admin", passwordHash: bcrypt.hashSync("admin12345", 10) }
];

let nextId = 3;
let tasks = [
  { id: 1, title: "O token identifica o usuário em cada requisição" },
  { id: 2, title: "O token carrega a role neste exemplo" }
];

function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ error: "Bearer token required" });
  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    res.status(401).json({ error: "invalid or expired token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) return res.status(403).json({ error: `${role} role required` });
    next();
  };
}

app.post("/api/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "invalid credentials" });
  }
  const token = jwt.sign(
    { sub: String(user.id), email: user.email, role: user.role },
    secret,
    { expiresIn: "30m" }
  );
  res.json({ token });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ id: req.user.sub, email: req.user.email, role: req.user.role });
});
app.get("/api/tasks", requireAuth, (_req, res) => res.json(tasks));
app.post("/api/tasks", requireAuth, (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });
  const task = { id: nextId++, title };
  tasks.push(task);
  res.status(201).json(task);
});
app.delete("/api/tasks/:id", requireAuth, requireRole("admin"), (req, res) => {
  const id = Number(req.params.id);
  const before = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  if (before === tasks.length) return res.status(404).json({ error: "task not found" });
  res.status(204).end();
});

app.listen(8080, "0.0.0.0");
