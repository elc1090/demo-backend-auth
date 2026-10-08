import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URL);
await client.connect();

const db = client.db("backend_examples");
const tasks = db.collection("tasks");

if ((await tasks.countDocuments()) === 0) {
  await tasks.insertMany([
    { title: "Agora os registros são documentos" },
    { title: "O backend usa o driver MongoDB diretamente" }
  ]);
}

const app = express();
app.use(express.json());
app.use(express.static("public"));

const toApi = doc => ({ id: doc._id.toString(), title: doc.title });

app.get("/api/tasks", async (_req, res) => {
  const docs = await tasks.find({}).sort({ _id: 1 }).toArray();
  res.json(docs.map(toApi));
});

app.post("/api/tasks", async (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });
  const result = await tasks.insertOne({ title });
  res.status(201).json({ id: result.insertedId.toString(), title });
});

app.delete("/api/tasks/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(404).json({ error: "task not found" });
  const result = await tasks.deleteOne({ _id: new ObjectId(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).json({ error: "task not found" });
  res.status(204).end();
});

app.listen(8080, "0.0.0.0");
