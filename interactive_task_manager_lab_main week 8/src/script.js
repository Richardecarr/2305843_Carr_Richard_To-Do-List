/*
 * Student Name:   Richard Carr
 * Student ID:     2305843
 * Module:          Web Programming
 * Assignment:     Lab Activity - Interactive Task Manager (Week 8)
 * Date:           2026-11-3
 * GitHub Repo:    [YOUR REPO URL]
 *
 * Description:
 * A persistent task manager built with Vanilla JavaScript.
 *  - Functions : addTask, deleteTask, toggleTask, renderTasks, saveTasks, loadTasks
 *  - Events    : form "submit", and "click" on the task list (event delegation)
 *  - Storage   : tasks are saved as JSON in localStorage so they survive reloads
 */

// ---------- Constants & State ----------
const STORAGE_KEY = "taskManagerTasks";

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const priorityInput = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");

// In-memory array of task objects: { id, title, priority, completed }
let tasks = [];

// ---------- Storage Functions ----------

// Convert the tasks array to a JSON string and store it
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
  }
}

// Read the JSON string back and turn it into an array (empty array if none/corrupt)
function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not load tasks:", error);
    return [];
  }
}

// ---------- Task Functions ----------

// Create a new task object, store it, and refresh the UI
function addTask(title, priority) {
  const task = {
    id: Date.now(), // unique enough for a single-user lab app
    title: title,
    priority: priority,
    completed: false,
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
}

// Flip the completed flag for one task
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// Remove one task by id
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

// ---------- Rendering ----------

// Build the DOM for a single task card
function createTaskElement(task) {
  const item = document.createElement("div");
  item.classList.add("task-item", task.priority);
  if (task.completed) item.classList.add("completed");
  item.dataset.id = task.id;

  const title = document.createElement("span");
  title.textContent = task.title; // textContent avoids HTML injection

  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  const toggleBtn = document.createElement("button");
  toggleBtn.classList.add("toggle-btn");
  toggleBtn.dataset.action = "toggle";
  toggleBtn.textContent = task.completed ? "Undo" : "Done";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.dataset.action = "delete";
  deleteBtn.textContent = "Delete";

  actions.append(toggleBtn, deleteBtn);
  item.append(title, actions);
  return item;
}

// Clear the list and redraw every task from the array
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No tasks yet. Add one to get started!";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach((task) => taskList.appendChild(createTaskElement(task)));
}

// ---------- Event Handlers ----------

// Form submit: validate, add task, reset form
function handleFormSubmit(event) {
  event.preventDefault(); // stop the page from reloading

  const title = titleInput.value.trim();
  if (title === "") {
    titleInput.focus();
    return;
  }

  addTask(title, priorityInput.value);
  taskForm.reset();
  priorityInput.value = "medium"; // keep the default selection
  titleInput.focus();
}

// Click on the list: one listener handles every Done/Delete button (event delegation)
function handleListClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const item = button.closest(".task-item");
  if (!item) return;
  const id = Number(item.dataset.id);

  if (button.dataset.action === "toggle") {
    toggleTask(id);
  } else if (button.dataset.action === "delete") {
    deleteTask(id);
  }
}

taskForm.addEventListener("submit", handleFormSubmit);
taskList.addEventListener("click", handleListClick);

// ---------- Initialise ----------
// Load saved tasks when the page opens, then draw them
tasks = loadTasks();
renderTasks();
