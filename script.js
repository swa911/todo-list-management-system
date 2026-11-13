
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const summary = document.getElementById("summary");

// Save tasks in browser storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    let taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        name: taskName,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    displayTasks();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

// Edit a task
function editTask(id) {
    let task = tasks.find(task => task.id === id);
    if (!task) {
        alert("Task not found!");
        return;
    }
    let newName = prompt("Enter the updated task name:", task.name);
    if (newName === null) {
        return;
    }
    newName = newName.trim();
    if (newName === "") {
        alert("Task name cannot be empty!");
        return;
    }
    task.name = newName;
    saveTasks();
    displayTasks();
    alert("Task updated successfully!");
}


// Mark task as completed or pending
function toggleTask(id) {
    let task = tasks.find(task => task.id === id);
    if (!task) {
        alert("Task not found!");
        return;
    }
    task.completed = !task.completed;
    saveTasks();
    displayTasks();
}


// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    let searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(task => {

        let matchesSearch = task.name.toLowerCase()
            .includes(searchText);

        let matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "completed" && task.completed) ||
            (currentFilter === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            '<li class="empty">No tasks found. Add a new task!</li>';
    }

    filteredTasks.forEach(task => {

        let li = document.createElement("li");

        li.className = task.completed
            ? "task completed"
            : "task";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        let name = document.createElement("span");
        name.className = "task-name";
        name.textContent = task.name;

        let status = document.createElement("span");
        status.className = task.completed
            ? "status completed-status"
            : "status pending-status";

        status.textContent = task.completed
            ? "Completed"
            : "Pending";

        let editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "✎";
        editBtn.title = "Edit task";

        editBtn.addEventListener("click", () => {
            editTask(task.id);
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑";
        deleteBtn.title = "Delete task";

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.append(
            checkbox,
            name,
            status,
            editBtn,
            deleteBtn
        );

        taskList.appendChild(li);
    });

    // Update task summary
    let completedCount =
        tasks.filter(task => task.completed).length;

    let pendingCount = tasks.length - completedCount;

    summary.textContent =
        `${tasks.length} tasks · ${completedCount} completed · ${pendingCount} pending`;
}

// Add button functionality
addBtn.addEventListener("click", addTask);

// Add task by pressing Enter
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Search functionality
searchInput.addEventListener("input", displayTasks);

// Filter functionality
document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", function() {

        currentFilter = this.dataset.filter;

        document.querySelectorAll(".filter").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        displayTasks();
    });
});

// Load saved tasks when page opens
displayTasks();
