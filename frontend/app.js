// Change this to your deployed backend URL when hosting (e.g. Render/Railway URL)
const API_BASE = 'http://localhost:5000/api';

let token = localStorage.getItem('token') || null;
let userName = localStorage.getItem('userName') || '';
let todos = [];
let currentFilter = 'all';

// ---------- DOM ELEMENTS ----------
const authScreen = document.getElementById('authScreen');
const appScreen = document.getElementById('appScreen');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authError = document.getElementById('authError');
const toggleToRegister = document.getElementById('toggleToRegister');
const toggleToLogin = document.getElementById('toggleToLogin');
const userNameEl = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const addTodoForm = document.getElementById('addTodoForm');
const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');

// ---------- INIT ----------
function init() {
  if (token) {
    showApp();
    fetchTodos();
  } else {
    showAuth();
  }
}

function showAuth() {
  authScreen.classList.remove('hidden');
  appScreen.classList.add('hidden');
}

function showApp() {
  authScreen.classList.add('hidden');
  appScreen.classList.remove('hidden');
  userNameEl.textContent = `Hi, ${userName}`;
}

// ---------- AUTH TOGGLE ----------
toggleToRegister.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  toggleToRegister.classList.add('hidden');
  toggleToLogin.classList.remove('hidden');
  authError.textContent = '';
});

toggleToLogin.addEventListener('click', () => {
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  toggleToLogin.classList.add('hidden');
  toggleToRegister.classList.remove('hidden');
  authError.textContent = '';
});

// ---------- REGISTER ----------
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.textContent = '';
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    saveSession(data.token, data.name);
    showApp();
    fetchTodos();
  } catch (err) {
    authError.textContent = err.message;
  }
});

// ---------- LOGIN ----------
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.textContent = '';
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    saveSession(data.token, data.name);
    showApp();
    fetchTodos();
  } catch (err) {
    authError.textContent = err.message;
  }
});

function saveSession(t, name) {
  token = t;
  userName = name;
  localStorage.setItem('token', token);
  localStorage.setItem('userName', name);
}

// ---------- LOGOUT ----------
logoutBtn.addEventListener('click', () => {
  token = null;
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  todos = [];
  showAuth();
});

// ---------- FETCH TODOS ----------
async function fetchTodos() {
  try {
    const res = await fetch(`${API_BASE}/todos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status === 401) return logoutBtn.click();
    todos = await res.json();
    renderTodos();
  } catch (err) {
    console.error('Failed to fetch todos:', err);
  }
}

// ---------- ADD TODO ----------
addTodoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = todoInput.value.trim();
  const priority = prioritySelect.value;
  if (!title) return;

  try {
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, priority })
    });
    const newTodo = await res.json();
    todos.unshift(newTodo);
    todoInput.value = '';
    renderTodos();
  } catch (err) {
    console.error('Failed to add todo:', err);
  }
});

// ---------- TOGGLE COMPLETE ----------
async function toggleComplete(id, completed) {
  try {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ completed: !completed })
    });
    const updated = await res.json();
    todos = todos.map((t) => (t._id === id ? updated : t));
    renderTodos();
  } catch (err) {
    console.error('Failed to update todo:', err);
  }
}

// ---------- DELETE TODO ----------
async function deleteTodo(id) {
  try {
    await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    todos = todos.filter((t) => t._id !== id);
    renderTodos();
  } catch (err) {
    console.error('Failed to delete todo:', err);
  }
}

// ---------- FILTERS ----------
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// ---------- RENDER ----------
function renderTodos() {
  let filtered = todos;
  if (currentFilter === 'active') filtered = todos.filter((t) => !t.completed);
  if (currentFilter === 'completed') filtered = todos.filter((t) => t.completed);

  todoList.innerHTML = '';
  emptyState.classList.toggle('hidden', filtered.length > 0);

  filtered.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''} />
      <span class="todo-title">${escapeHtml(todo.title)}</span>
      <span class="priority-badge priority-${todo.priority}">${todo.priority}</span>
      <button class="delete-btn">&times;</button>
    `;
    li.querySelector('input').addEventListener('click', () => toggleComplete(todo._id, todo.completed));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo._id));
    todoList.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

init();
