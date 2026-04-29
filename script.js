// Task Manager Application
// Main JavaScript file for frontend functionality

// API Configuration
const API_URL = 'http://localhost:3000/api';
let currentUserId = null;

// Check authentication on page load
window.addEventListener('load', () => {
  checkAuth();
});

// Check if user is logged in
function checkAuth() {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  
  if (!userId) {
    window.location.href = 'login.html';
    return;
  }
  
  currentUserId = userId;
  
  // Display user name and add logout button
  const header = document.querySelector('.header');
  const userInfo = document.createElement('div');
  userInfo.style.cssText = 'display: flex; align-items: center; gap: 15px;';
  userInfo.innerHTML = `
    <span style="color: #666;">Welcome, <strong>${userName}</strong></span>
    <button id="logoutBtn" class="btn-action" style="background: #ef4444; color: white; border: none; cursor: pointer;">Logout</button>
  `;
  header.insertBefore(userInfo, header.firstChild);
  
  document.getElementById('logoutBtn').addEventListener('click', logout);
}

function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  window.location.href = 'login.html';
}

const addBtn = document.getElementById("addBtn");
const taskModal = document.getElementById("taskModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const taskForm = document.getElementById("taskForm");
const modalTaskName = document.getElementById("modalTaskName");
const modalTaskDate = document.getElementById("modalTaskDate");
const modalTaskTime = document.getElementById("modalTaskTime");
const modalCategory = document.getElementById("modalCategory");
const modalTaskPriority = document.getElementById("modalTaskPriority");
const modalTaskNotes = document.getElementById("modalTaskNotes");
const modalTimeEstimate = document.getElementById("modalTimeEstimate");
const modalReminder = document.getElementById("modalReminder");
const modalRecurring = document.getElementById("modalRecurring");
const modalTags = document.getElementById("modalTags");
const themeToggle = document.getElementById("themeToggle");

const taskList = document.getElementById("taskList");
const countEl = document.getElementById("count");
const emptyEl = document.getElementById("empty");
const totalStatEl = document.getElementById("totalStat");
const doneStatEl = document.getElementById("doneStat");
const filterBtns = document.querySelectorAll(".filter-btn");
const categoryItems = document.querySelectorAll(".category-item");
const searchBar = document.querySelector(".search-bar input");

const STORAGE_KEY = "task_manager_tasks";
const THEME_KEY = "task_manager_theme";

// Calendar variables
let calendarCurrentDate = new Date();
let calendarSelectedDate = null;

// This will hold all tasks in memory
let tasks = loadTasks();
let currentFilter = "all";
let currentCategory = null;
let currentView = "tasks";
let editingTaskId = null;
let timerInterval = null;
let searchQuery = "";
let highlightedTaskId = null;

// Load and set theme
loadTheme();

// First time render
renderTasks();

// Theme toggle
themeToggle.addEventListener("click", () => {
  toggleTheme();
});

// Search functionality
searchBar.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  renderTasks();
});

// Navigation items
const navItems = document.querySelectorAll(".nav-item");
navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    currentView = item.textContent.toLowerCase().includes("notification") ? "notifications" : "tasks";
    
    if (currentView === "notifications") {
      addBtn.style.display = "none";
      taskList.innerHTML = "<p style='padding: 20px; text-align: center; color: #999;'>No new notifications</p>";
      countEl.textContent = "Notifications";
    } else {
      addBtn.style.display = "inline-block";
      countEl.textContent = "0 tasks";
      renderTasks();
    }
  });
});

addBtn.addEventListener("click", () => {
  editingTaskId = null;
  document.querySelector(".modal-header h2").textContent = "Create New Task";
  openModal();
});

closeModal.addEventListener("click", () => {
  closeTaskModal();
});

cancelBtn.addEventListener("click", () => {
  closeTaskModal();
});

taskModal.addEventListener("click", (e) => {
  if (e.target === taskModal) {
    closeTaskModal();
  }
});

// Calendar modal close
const calendarModal = document.getElementById("calendarModal");
const closeCalendarModal = document.getElementById("closeCalendarModal");
closeCalendarModal.addEventListener("click", () => {
  calendarModal.classList.add("hidden");
});

calendarModal.addEventListener("click", (e) => {
  if (e.target === calendarModal) {
    calendarModal.classList.add("hidden");
  }
});

// Calendar navigation
document.getElementById("prevMonth").addEventListener("click", () => {
  calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
  renderCalendar();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitTask();
});

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    filterBtns.forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    currentFilter = e.target.getAttribute("data-filter");
    renderTasks();
  });
});

// Category items
categoryItems.forEach(item => {
  item.addEventListener("click", (e) => {
    const clickedCategory = e.target.closest(".category-item").getAttribute("data-category");
    
    // Toggle: if clicking the same category, deselect it
    if (currentCategory === clickedCategory) {
      currentCategory = null;
      categoryItems.forEach(i => i.classList.remove("active"));
    } else {
      // Otherwise select the new category
      categoryItems.forEach(i => i.classList.remove("active"));
      e.target.closest(".category-item").classList.add("active");
      currentCategory = clickedCategory;
    }
    renderTasks();
  });
});

// Export button
document.getElementById("exportBtn").addEventListener("click", () => {
  exportTasks();
});

// Import button
document.getElementById("importBtn").addEventListener("click", () => {
  importTasks();
});

// Calendar button
document.getElementById("calendarBtn").addEventListener("click", () => {
  showCalendarView();
});

// Start timer loop (updates every second)
startTimerLoop();

function openModal() {
  taskModal.classList.remove("hidden");
  modalTaskName.focus();
  // Only clear if not editing
  if (!editingTaskId) {
    modalTaskName.value = "";
    modalTaskDate.value = "";
    modalTaskTime.value = "";
    modalTaskNotes.value = "";
    modalTimeEstimate.value = "";
    modalReminder.value = "none";
    modalRecurring.value = "none";
    modalTags.value = "";
    modalCategory.value = "work";
    modalTaskPriority.value = "medium";
  }
}

function closeTaskModal() {
  taskModal.classList.add("hidden");
}

function submitTask() {
  const text = modalTaskName.value.trim();
  const dueDate = modalTaskDate.value;
  const dueTime = modalTaskTime.value;
  const category = modalCategory.value;
  const priority = modalTaskPriority.value;
  const notes = modalTaskNotes.value.trim();
  const timeEstimate = parseInt(modalTimeEstimate.value) || 0;
  const reminder = modalReminder.value;
  const recurring = modalRecurring.value;
  const tags = modalTags.value.split(",").map(t => t.trim()).filter(t => t);

  if (text === "") {
    alert("Please enter a task name");
    return;
  }

  if (editingTaskId) {
    // Update existing task
    const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].text = text;
      tasks[taskIndex].dueDate = dueDate;
      tasks[taskIndex].dueTime = dueTime;
      tasks[taskIndex].category = category;
      tasks[taskIndex].priority = priority;
      tasks[taskIndex].notes = notes;
      tasks[taskIndex].timeEstimate = timeEstimate;
      tasks[taskIndex].reminder = reminder;
      tasks[taskIndex].recurring = recurring;
      tasks[taskIndex].tags = tags;
    }
    editingTaskId = null;
  } else {
    // Create new task
    const newTask = {
      id: Date.now(),
      text: text,
      done: false,
      dueDate: dueDate,
      dueTime: dueTime,
      category: category,
      priority: priority,
      notes: notes,
      timeEstimate: timeEstimate,
      reminder: reminder,
      recurring: recurring,
      tags: tags,
      subtasks: [],
      createdAt: new Date().toISOString(),
      totalTime: 0,
      isTracking: false,
      lastStartTime: null,
    };
    tasks.unshift(newTask);
  }

  saveTasks();
  renderTasks();
  closeTaskModal();
}

function toggleDone(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].done = !tasks[i].done;
      if (tasks[i].isTracking) {
        stopTimer(id);
      }
      break;
    }
  }

  saveTasks();
  renderTasks();
}

function startTimer(id) {
  const task = tasks.find(t => t.id === id);
  if (task && !task.isTracking) {
    task.isTracking = true;
    task.lastStartTime = Date.now();
    task.totalTime = 0; // Reset timer to start from 0
    saveTasks();
    renderTasks();
  }
}

function stopTimer(id) {
  const task = tasks.find(t => t.id === id);
  if (task && task.isTracking) {
    const elapsed = Math.floor((Date.now() - task.lastStartTime) / 1000);
    task.totalTime += elapsed;
    task.isTracking = false;
    task.lastStartTime = null;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => {
    if (t.id === id && t.isTracking) {
      stopTimer(id);
    }
    return t.id !== id;
  });

  saveTasks();
  renderTasks();
}

function editTask(task) {
  editingTaskId = task.id;
  document.querySelector(".modal-header h2").textContent = "Edit Task";
  modalTaskName.value = task.text;
  modalTaskDate.value = task.dueDate;
  modalTaskTime.value = task.dueTime;
  modalTaskNotes.value = task.notes || "";
  modalTimeEstimate.value = task.timeEstimate || "";
  modalReminder.value = task.reminder || "none";
  modalRecurring.value = task.recurring || "none";
  modalTags.value = (task.tags || []).join(", ");
  modalCategory.value = task.category;
  modalTaskPriority.value = task.priority;
  openModal();
}

function startTimerLoop() {
  setInterval(() => {
    let hasActiveTimer = false;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].isTracking) {
        hasActiveTimer = true;
        break;
      }
    }

    if (hasActiveTimer) {
      renderTasks();
    }
  }, 1000);
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDaysRemaining(dateStr) {
  if (!dateStr) return null;
  const dueDate = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const timeDiff = dueDate - today;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysRemaining;
}

function isTaskOverdue(task) {
  if (!task.dueDate || task.done) return false;
  const daysRemaining = getDaysRemaining(task.dueDate);
  return daysRemaining < 0; // Overdue if negative days remaining
}

function getCurrentTime(task) {
  if (!task.isTracking) {
    return task.totalTime;
  }

  const elapsed = Math.floor((Date.now() - task.lastStartTime) / 1000);
  return task.totalTime + elapsed;
}

function renderTasks() {
  taskList.innerHTML = "";

  // Check for overdue tasks only
  const overdueTasks = tasks.filter(t => isTaskOverdue(t));
  
  if (overdueTasks.length > 0) {
    const alertDiv = document.createElement("div");
    alertDiv.style.cssText = "background: #fee2e2; border: 2px solid #dc2626; color: #991b1b; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 600; cursor: pointer;";
    alertDiv.innerHTML = `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}!`;
    alertDiv.addEventListener("click", () => {
      // Highlight all overdue tasks
      highlightedTaskId = "overdue-all";
      renderTasks();
    });
    taskList.appendChild(alertDiv);
  }

  // Priority order: high (0), medium (1), low (2)
  const priorityOrder = { "high": 0, "medium": 1, "low": 2 };

  // Sort tasks by date: today first, then upcoming, then overdue at bottom
  const sortedTasks = tasks.slice().sort((a, b) => {
    const daysA = a.dueDate ? getDaysRemaining(a.dueDate) : Infinity;
    const daysB = b.dueDate ? getDaysRemaining(b.dueDate) : Infinity;

    // Tasks without due date go to bottom
    if (daysA === Infinity && daysB === Infinity) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (daysA === Infinity) return 1;
    if (daysB === Infinity) return -1;

    // Today (0) comes first
    if (daysA === 0 && daysB !== 0) return -1;
    if (daysB === 0 && daysA !== 0) return 1;
    if (daysA === 0 && daysB === 0) return priorityOrder[a.priority] - priorityOrder[b.priority];

    // Future dates (positive) sorted ascending
    if (daysA > 0 && daysB > 0) {
      return daysA - daysB;
    }

    // Future dates come before overdue
    if (daysA > 0 && daysB < 0) return -1;
    if (daysB > 0 && daysA < 0) return 1;

    // Overdue dates (negative) sorted ascending (most recent overdue first)
    if (daysA < 0 && daysB < 0) {
      return daysA - daysB;
    }

    return 0;
  });

  for (let i = 0; i < sortedTasks.length; i++) {
    const task = sortedTasks[i];

    // Filter logic
    if (currentFilter === "active") {
      if (task.done) continue;
      // Show only today's tasks in Active tab
      if (task.dueDate) {
        const daysRemaining = getDaysRemaining(task.dueDate);
        if (daysRemaining !== 0) continue; // Only show today's tasks (daysRemaining === 0)
      } else {
        continue; // Skip tasks without due date in Active tab
      }
    } else if (currentFilter === "done") {
      if (!task.done) continue;
    } else if (currentFilter === "all") {
      // Show only active tasks in "All" tab
      if (task.done) continue;
    }
    
    if (currentCategory && task.category !== currentCategory) continue;
    
    // Search filter
    if (searchQuery && !task.text.toLowerCase().includes(searchQuery)) continue;

    const li = document.createElement("li");
    if (task.done) {
      li.classList.add("done");
    }
    
    // Highlight overdue tasks when notification clicked
    if (highlightedTaskId === "overdue-all" && isTaskOverdue(task)) {
      li.style.cssText = "background: #fef3c7; border: 2px solid #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);";
    }

    // Serial Number
    const serialNum = Array.from(taskList.children).length + 1;
    const snSpan = document.createElement("span");
    snSpan.style.cssText = "font-weight: 700; color: #3b82f6; min-width: 25px; text-align: center;";
    snSpan.textContent = serialNum;

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      toggleDone(task.id);
    });

    // Task content (text + metadata)
    const contentDiv = document.createElement("div");
    contentDiv.className = "task-content";

    // Task text
    const span = document.createElement("span");
    span.className = "taskText";
    span.textContent = task.text;
    span.addEventListener("click", () => {
      toggleDone(task.id);
    });

    // Metadata row
    const metaDiv = document.createElement("div");
    metaDiv.className = "task-meta";

    // Category tag
    const categoryBadge = document.createElement("span");
    categoryBadge.className = `task-category category-${task.category}`;
    categoryBadge.textContent = task.category.charAt(0).toUpperCase() + task.category.slice(1);
    metaDiv.appendChild(categoryBadge);

    // Priority badge
    const priorityBadge = document.createElement("span");
    priorityBadge.className = `task-priority priority-${task.priority}`;
    priorityBadge.textContent = task.priority.toUpperCase();
    metaDiv.appendChild(priorityBadge);

    // Date
    if (task.dueDate) {
      const dateSpan = document.createElement("span");
      dateSpan.className = "task-date";
      const daysRemaining = getDaysRemaining(task.dueDate);
      let dateText = "Date: " + formatDate(task.dueDate);
      let dateStyle = "";
      
      if (daysRemaining < 0) {
        dateText = `OVERDUE: ${formatDate(task.dueDate)} (${Math.abs(daysRemaining)} days ago)`;
        dateStyle = "color: #dc2626; font-weight: 600;";
      } else if (daysRemaining === 0) {
        dateText = `TODAY: ${formatDate(task.dueDate)}`;
        dateStyle = "color: #ea580c; font-weight: 600;";
      } else if (daysRemaining === 1) {
        dateText = `TOMORROW: ${formatDate(task.dueDate)}`;
        dateStyle = "color: #d97706; font-weight: 600;";
      } else if (daysRemaining <= 7) {
        dateText = `Due in ${daysRemaining} days: ${formatDate(task.dueDate)}`;
        dateStyle = "color: #0284c7; font-weight: 600;";
      } else {
        dateText = `${formatDate(task.dueDate)}`;
      }
      
      if (dateStyle) {
        dateSpan.style.cssText = dateStyle;
      }
      dateSpan.textContent = dateText;
      metaDiv.appendChild(dateSpan);
    }

    // Time
    if (task.dueTime) {
      const timeSpan = document.createElement("span");
      timeSpan.className = "task-time-info";
      timeSpan.textContent = "Time: " + task.dueTime;
      metaDiv.appendChild(timeSpan);
    }

    // Active timer display - only when tracking
    if (task.isTracking) {
      const timerSpan = document.createElement("span");
      timerSpan.className = "task-timer";
      const currentTime = getCurrentTime(task);
      timerSpan.textContent = "Timer: " + formatTime(currentTime);
      metaDiv.appendChild(timerSpan);
    }

    // Time Estimate
    if (task.timeEstimate > 0) {
      const estimateSpan = document.createElement("span");
      estimateSpan.style.cssText = "font-size: 12px; color: #6b7280; background: #f3f4f6; padding: 2px 8px; border-radius: 4px;";
      estimateSpan.textContent = "Est: " + task.timeEstimate + " min";
      metaDiv.appendChild(estimateSpan);
    }

    // Tags
    if (task.tags && task.tags.length > 0) {
      const tagsSpan = document.createElement("span");
      tagsSpan.style.cssText = "font-size: 11px; color: #6366f1; background: #e0e7ff; padding: 2px 6px; border-radius: 12px; display: inline-block;";
      tagsSpan.textContent = task.tags.join(", ");
      metaDiv.appendChild(tagsSpan);
    }

    // Recurring indicator
    if (task.recurring && task.recurring !== "none") {
      const recurSpan = document.createElement("span");
      recurSpan.style.cssText = "font-size: 11px; color: #7c3aed; background: #f3e8ff; padding: 2px 6px; border-radius: 4px;";
      recurSpan.textContent = "Repeat: " + task.recurring;
      metaDiv.appendChild(recurSpan);
    }

    contentDiv.appendChild(span);
    contentDiv.appendChild(metaDiv);

    // Action buttons
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      editTask(task);
    });

    // Time control button
    const timerBtn = document.createElement("button");
    timerBtn.className = `time-btn ${task.isTracking ? "stop" : ""}`;
    timerBtn.textContent = task.isTracking ? "Stop" : "Start";
    timerBtn.addEventListener("click", () => {
      if (task.isTracking) {
        stopTimer(task.id);
      } else {
        startTimer(task.id);
      }
    });

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.className = "delete";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(timerBtn);
    actionsDiv.appendChild(delBtn);

    li.appendChild(snSpan);
    li.appendChild(checkbox);
    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);
    
    // Add notes section if task has notes
    if (task.notes) {
      const notesContainer = document.createElement("div");
      notesContainer.style.cssText = "grid-column: 1 / -1; background: #f0f9ff; border-left: 4px solid #0284c7; padding: 10px 12px; margin-top: 10px; border-radius: 4px; font-size: 13px; color: #075985; display: none;";
      notesContainer.innerHTML = `<strong>Notes:</strong> ${task.notes}`;
      
      const notesBtn = document.createElement("button");
      notesBtn.style.cssText = "margin-left: 8px; padding: 4px 8px; font-size: 11px; background: #0284c7; color: white; border: none; border-radius: 4px; cursor: pointer;"; 
      notesBtn.textContent = "Notes";
      notesBtn.title = "Click to see notes";
      notesBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notesContainer.style.display = notesContainer.style.display === "none" ? "block" : "none";
      });
      
      actionsDiv.appendChild(notesBtn);
      li.appendChild(notesContainer);
    }
    
    // Click to clear highlight
    li.addEventListener("click", () => {
      if (highlightedTaskId === "overdue-all") {
        highlightedTaskId = null;
        renderTasks();
      }
    });

    taskList.appendChild(li);
  }

  updateInfo();
}

function updateInfo() {
  let filteredTasks = tasks;
  
  // Filter by category if one is selected
  if (currentCategory) {
    filteredTasks = tasks.filter(t => t.category === currentCategory);
  }
  
  // For "All" tab, show only active tasks
  if (currentFilter === "all") {
    filteredTasks = filteredTasks.filter(t => !t.done);
  } else if (currentFilter === "active") {
    // Active tab shows only today's tasks
    filteredTasks = filteredTasks.filter(t => !t.done && t.dueDate && getDaysRemaining(t.dueDate) === 0);
  } else if (currentFilter === "done") {
    filteredTasks = filteredTasks.filter(t => t.done);
  }
  
  const total = filteredTasks.length;
  const doneCount = tasks.filter(t => currentCategory ? t.category === currentCategory && t.done : t.done).length;

  countEl.textContent = `${total} task${total === 1 ? "" : "s"} (${doneCount} done)`;
  totalStatEl.textContent = tasks.filter(t => !t.done).length;
  doneStatEl.textContent = tasks.filter(t => t.done).length;
  emptyEl.style.display = total === 0 ? "block" : "none";
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((t) => t && typeof t.text === "string")
      .map((t) => ({
        id: typeof t.id === "number" ? t.id : Date.now(),
        text: t.text,
        done: Boolean(t.done),
        dueDate: typeof t.dueDate === "string" ? t.dueDate : "",
        dueTime: typeof t.dueTime === "string" ? t.dueTime : "",
        estimatedTime: typeof t.estimatedTime === "number" ? t.estimatedTime : 0,
        category: typeof t.category === "string" ? t.category : "work",
        priority: typeof t.priority === "string" ? t.priority : "medium",
        notes: typeof t.notes === "string" ? t.notes : "",
        timeEstimate: typeof t.timeEstimate === "number" ? t.timeEstimate : 0,
        reminder: typeof t.reminder === "string" ? t.reminder : "none",
        recurring: typeof t.recurring === "string" ? t.recurring : "none",
        tags: Array.isArray(t.tags) ? t.tags : [],
        subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
        createdAt: typeof t.createdAt === "string" ? t.createdAt : new Date().toISOString(),
        totalTime: typeof t.totalTime === "number" ? t.totalTime : 0,
        isTracking: false, // Always false on load
        lastStartTime: null,
      }));
  } catch (err) {
    console.error("Error loading tasks:", err);
    return [];
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "Dark Mode";
  }
}

function toggleTheme() {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  if (isDarkMode) {
    localStorage.setItem(THEME_KEY, "dark");
    themeToggle.textContent = "Light Mode";
  } else {
    localStorage.setItem(THEME_KEY, "light");
    themeToggle.textContent = "Dark Mode";
  }
}

function clearAllData() {
  tasks = [];
  localStorage.removeItem(STORAGE_KEY);
  renderTasks();
  updateInfo();
  console.log("All data cleared!");
}

// Export tasks as JSON
function exportTasks() {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataBlob = new Blob([dataStr], {type: "application/json"});
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  alert("Tasks exported successfully!");
}

// Import tasks from JSON
function importTasks() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          tasks = imported.map(t => ({
            ...t,
            isTracking: false,
            lastStartTime: null
          }));
          saveTasks();
          renderTasks();
          alert("Tasks imported successfully!");
        } else {
          alert("Invalid file format. Please use exported JSON file.");
        }
      } catch (error) {
        alert("Error importing tasks: " + error.message);
      }
    };
    reader.readAsText(file);
  });
  input.click();
}

// Show calendar view
function showCalendarView() {
  calendarModal.classList.remove("hidden");
  calendarCurrentDate = new Date();
  calendarSelectedDate = null;
  renderCalendar();
}

// Render calendar
function renderCalendar() {
  const year = calendarCurrentDate.getFullYear();
  const month = calendarCurrentDate.getMonth();
  
  // Update header
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  document.getElementById("calendarMonth").textContent = `${monthNames[month]} ${year}`;
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const calendarGrid = document.getElementById("calendarGrid");
  calendarGrid.innerHTML = "";
  
  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach(day => {
    const dayHeader = document.createElement("div");
    dayHeader.style.cssText = "font-weight: 700; text-align: center; padding: 10px; color: #6b7280;";
    dayHeader.textContent = day;
    calendarGrid.appendChild(dayHeader);
  });
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dayCell = createCalendarDay(day, month - 1, year, true);
    calendarGrid.appendChild(dayCell);
  }
  
  // Current month days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = createCalendarDay(day, month, year, false);
    
    // Mark today
    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dayCell.classList.add("today");
    }
    
    // Mark selected date
    if (calendarSelectedDate && 
        day === calendarSelectedDate.getDate() && 
        month === calendarSelectedDate.getMonth() && 
        year === calendarSelectedDate.getFullYear()) {
      dayCell.classList.add("selected");
    }
    
    calendarGrid.appendChild(dayCell);
  }
  
  // Next month days
  const totalCells = calendarGrid.children.length - 7; // Subtract day headers
  const remainingCells = 42 - totalCells; // 6 rows x 7 days
  for (let day = 1; day <= remainingCells; day++) {
    const dayCell = createCalendarDay(day, month + 1, year, true);
    calendarGrid.appendChild(dayCell);
  }
}

// Create calendar day cell
function createCalendarDay(day, month, year, isOtherMonth) {
  const dayCell = document.createElement("div");
  dayCell.className = "calendar-day";
  
  if (isOtherMonth) {
    dayCell.classList.add("other-month");
  }
  
  // Get tasks for this date
  const dateStr = formatDateForCompare(new Date(year, month, day));
  const tasksForDay = tasks.filter(t => !t.done && t.dueDate === dateStr);
  
  if (tasksForDay.length > 0) {
    dayCell.classList.add("has-tasks");
  }
  
  // Day number
  const dayNum = document.createElement("div");
  dayNum.className = "calendar-day-number";
  dayNum.textContent = day;
  dayCell.appendChild(dayNum);
  
  // Task count
  if (tasksForDay.length > 0) {
    const taskCount = document.createElement("div");
    taskCount.className = "calendar-day-tasks";
    taskCount.textContent = `${tasksForDay.length} task${tasksForDay.length > 1 ? 's' : ''}`;
    dayCell.appendChild(taskCount);
  }
  
  // Click handler
  dayCell.addEventListener("click", () => {
    calendarSelectedDate = new Date(year, month, day);
    renderCalendar();
    showCalendarDateTasks(calendarSelectedDate);
  });
  
  return dayCell;
}

// Format date for comparison (YYYY-MM-DD)
function formatDateForCompare(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Show tasks for selected calendar date
function showCalendarDateTasks(date) {
  const dateStr = formatDateForCompare(date);
  const tasksForDate = tasks.filter(t => !t.done && t.dueDate === dateStr);
  
  const tasksList = document.getElementById("selectedDateTasks");
  tasksList.innerHTML = "";
  
  if (tasksForDate.length === 0) {
    const li = document.createElement("li");
    li.style.cssText = "color: #9ca3af; padding: 10px;";
    li.textContent = "No tasks for this date";
    tasksList.appendChild(li);
    return;
  }
  
  tasksForDate.forEach(task => {
    const li = document.createElement("li");
    li.style.cssText = "padding: 10px; border-left: 4px solid #3b82f6; margin-bottom: 8px; background: #f0f9ff; border-radius: 4px;";
    li.innerHTML = `
      <strong>${task.text}</strong>
      <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
        ${task.category} | ${task.priority.toUpperCase()}
        ${task.dueTime ? ' | ' + task.dueTime : ''}
      </div>
    `;
    tasksList.appendChild(li);
  });
}

// Add subtask
function addSubtask(taskId, subtaskText) {
  const task = tasks.find(t => t.id === taskId);
  if (task && subtaskText.trim()) {
    task.subtasks.push({
      id: Date.now(),
      text: subtaskText,
      done: false
    });
    saveTasks();
    renderTasks();
  }
}

// Toggle subtask
function toggleSubtask(taskId, subtaskId) {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    const subtask = task.subtasks.find(s => s.id === subtaskId);
    if (subtask) {
      subtask.done = !subtask.done;
      saveTasks();
      renderTasks();
    }
  }
}

// Delete subtask
function deleteSubtask(taskId, subtaskId) {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.subtasks = task.subtasks.filter(s => s.id !== subtaskId);
    saveTasks();
    renderTasks();
  }
}
