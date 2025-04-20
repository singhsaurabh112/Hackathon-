// DOM Elements
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const sessionCount = document.getElementById("session-count");
const progressBar = document.getElementById("progress-bar");
const quoteEl = document.getElementById("quote");
const darkToggle = document.getElementById("dark-toggle");
const customMinutesInput = document.getElementById("custom-minutes");
const setDurationBtn = document.getElementById("set-duration");

let timer;
let timeLeft = 25 * 60; // Default is 25 minutes
let isRunning = false;
let sessions = 0;
let pomodoroDuration = 25 * 60; // Store duration in seconds

// Timer Functions
function updateTimerDisplay() {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  timerEl.textContent = `${mins}:${secs}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      sessions++;
      updateProgress();
      alert("Time's up! Take a break.");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = pomodoroDuration;
  isRunning = false;
  updateTimerDisplay();
}

function updateProgress() {
  sessionCount.textContent = `${sessions}/4 sessions`;
  const percent = Math.min((sessions / 4) * 100, 100);
  progressBar.style.width = `${percent}%`;
}

// To-Do List
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.firstChild.textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach(task => {
    const li = createTaskElement(task.text, task.completed);
    taskList.appendChild(li);
  });
}

function createTaskElement(taskText, completed = false) {
  const li = document.createElement("li");
  li.textContent = taskText;
  if (completed) li.classList.add("completed");

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.className = "delete-btn";
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  });

  li.appendChild(delBtn);
  return li;
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  const li = createTaskElement(taskText);
  taskList.appendChild(li);
  taskInput.value = "";
  saveTasks();
}

// Quotes
const quotes = [
  "“The secret of getting ahead is getting started.” – Mark Twain",
  "“Don’t watch the clock; do what it does. Keep going.” – Sam Levenson",
  "“Success is the sum of small efforts, repeated day-in and day-out.” – R. Collier",
  "“Start where you are. Use what you have. Do what you can.” – Arthur Ashe"
];

function showRandomQuote() {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quoteEl.textContent = random;
}

// Dark Mode
darkToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkToggle.checked);
  localStorage.setItem("darkMode", darkToggle.checked);
});

function initDarkMode() {
  const dark = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark", dark);
  darkToggle.checked = dark;
}

// Set custom session duration
setDurationBtn.addEventListener("click", () => {
  const customDuration = parseInt(customMinutesInput.value) * 60;
  if (customDuration && customDuration > 0) {
    pomodoroDuration = customDuration;
    timeLeft = customDuration;
    updateTimerDisplay();
  }
});

// Event Listeners
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
addTaskBtn.addEventListener("click", addTask);

// Init
updateTimerDisplay();
loadTasks();
updateProgress();
showRandomQuote();
initDarkMode();
