const loginPanel = document.querySelector("#login-panel");
const appPanel = document.querySelector("#app-panel");
const loginForm = document.querySelector("#login-form");
const taskForm = document.querySelector("#task-form");
const tasksEl = document.querySelector("#tasks");
const statusEl = document.querySelector("#status");
let token = null;

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(path, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(`${response.status}: ${body.error || response.statusText}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function loadTasks() {
  const tasks = await api("/api/tasks");
  tasksEl.replaceChildren();
  for (const task of tasks) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const remove = document.createElement("button");
    span.textContent = `${task.id}. ${task.title}`;
    remove.textContent = "Excluir (admin)";
    remove.className = "danger";
    remove.onclick = async () => {
      try {
        await api(`/api/tasks/${task.id}`, { method: "DELETE" });
        await loadTasks();
      } catch (error) { statusEl.textContent = error.message; }
    };
    li.append(span, remove);
    tasksEl.append(li);
  }
}

async function showLoggedIn(user) {
  loginPanel.hidden = true;
  appPanel.hidden = false;
  document.querySelector("#identity").textContent = user.email;
  document.querySelector("#role").textContent = `role = ${user.role}`;
  await loadTasks();
}
function showLoggedOut() {
  token = null;
  loginPanel.hidden = false;
  appPanel.hidden = true;
}

loginForm.onsubmit = async event => {
  event.preventDefault();
  try {
    const result = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({ email: loginForm.email.value, password: loginForm.password.value })
    });
    token = result.token;
    await showLoggedIn(await api("/api/me"));
  } catch (error) { alert(error.message); }
};

taskForm.onsubmit = async event => {
  event.preventDefault();
  try {
    await api("/api/tasks", { method: "POST", body: JSON.stringify({ title: taskForm.title.value }) });
    taskForm.reset();
    await loadTasks();
  } catch (error) { statusEl.textContent = error.message; }
};

document.querySelector("#logout").onclick = showLoggedOut;
showLoggedOut();
