function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let id = 0;
if (tasks.length > 0) {
    id = tasks[tasks.length - 1].id;
}
let filter = "all"

function addTask(title) {  
    if (title) {
        tasks.push({
             id: ++id,
             title,
             status: "incomplete",
             modifiedDate: new Date().toLocaleString()
        });
        saveTasks();
        renderTasks();
    }
}

function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id); 
    saveTasks();
    renderTasks();
}


function editTask(id, newTitle) {
    if (newTitle.trim() === "") return;
    tasks = tasks.map(task => task.id === id ? { ...task, title: newTitle } : task);
    saveTasks();
    renderTasks();
}

function markTaskComplete(id) {
    let task = tasks.find(task => task.id === id);
    if (task) {
        task.status = task.status === "complete" ? "incomplete" : "complete";
        saveTasks();
        renderTasks();
    }
}
function setFilter(newFilter) {
    filter = newFilter;
    document.querySelectorAll(".controller-btn ul li").forEach(li => {
        li.style.color = li.id === `${newFilter}-tasks` ? "#3a7bfd" : "#4b4e64";
    });
    renderTasks();
}
function animateTaskAddition(taskItem) {
    taskItem.style.opacity = "0"; 
    taskItem.style.transform = "translateY(-10px)"; 
    setTimeout(() => {
        taskItem.style.opacity = "1"; 
        taskItem.style.transform = "translateY(0)"; 
        taskItem.style.transition = "opacity 0.1s ease, transform 0.1s ease";
    }, 50);
}
function animateTaskRemoval(taskItem) {
    taskItem.style.opacity = "0"; 
    taskItem.style.transform = "translateX(50px)"; 
    taskItem.style.transition = "opacity 0.1s ease, transform 0.1s ease";
    setTimeout(() => {
        taskItem.remove(); 
    }, 300);
}

function renderTasks() {
    const taskList = document.querySelector(".tasks");
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter(task => 
        filter === "all" || 
        (filter === "completed" && task.status === "complete") || 
        (filter === "active" && task.status === "incomplete")
    );

    filteredTasks.forEach(task => {
        const div = document.createElement("div");
        div.classList.add("task-item");
        div.classList.toggle("completed", task.status === "complete");

        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "space-between";
        div.style.padding = "15px";
        div.style.borderBottom = "1px solid #34374c";

        const leftSection = document.createElement("div");
        leftSection.style.display = "flex";
        leftSection.style.alignItems = "center";

        const checkBox = document.createElement("div");
        checkBox.classList.add("custom-check");
        checkBox.innerHTML = task.status === "complete" 
            ? "<span style='display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: var(--Check-Background); border-radius: 50%;'><img src='../images/icon-check.svg' alt='✔' width='12'></span>" 
            : "<span style='width: 20px; height: 20px; border: 2px solid gray; border-radius: 50%; display: inline-block;'></span>";
        checkBox.onclick = () => markTaskComplete(task.id);
        checkBox.style.marginRight = "12px";
        checkBox.style.cursor = "pointer";

        const span = document.createElement("span");
        span.textContent = task.title;
        span.style.textDecoration = task.status === "complete" ? "line-through" : "none";
        span.style.fontSize = "16px";
        span.style.color = "#c9cbe4";

        const dueDate = document.createElement("span");
        dueDate.textContent = `Modified at: ${task.modifiedDate}`;
        dueDate.style.marginLeft = "10px";
        dueDate.style.fontSize = "12px";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✖";
        deleteBtn.style.background = "none";
        deleteBtn.style.border = "none";
        deleteBtn.style.color = "#4a4b65";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.fontSize = "18px";

        deleteBtn.onclick = () => {
            animateTaskRemoval(div); 
            setTimeout(() => {
                removeTask(task.id);
                renderTasks();
            }, 300); 
        };

        leftSection.appendChild(checkBox);
        leftSection.appendChild(span);
        leftSection.appendChild(dueDate);
        div.appendChild(leftSection);
        div.appendChild(deleteBtn);
        taskList.appendChild(div);

        animateTaskAddition(div); 
    });

    document.getElementById("items-left").textContent = tasks.filter(task => task.status === "incomplete").length;
    saveTasks();
}

document.getElementById("toggle").addEventListener("click", function () {
    document.body.classList.toggle("light");
    let isLightMode = document.body.classList.contains("light");

    document.getElementById("bg-img").src = isLightMode 
        ? "../images/bg-desktop-light.jpg" 
        : "../images/bg-desktop-dark.jpg";

    document.getElementById("toggle-img").src = isLightMode 
        ? "../images/icon-moon.svg" 
        : "../images/icon-sun.svg";

    localStorage.setItem("theme", isLightMode ? "light" : "dark"); 
});


document.addEventListener("DOMContentLoaded", function () {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light");
        document.getElementById("bg-img").src = "../images/bg-desktop-light.jpg";
        document.getElementById("toggle-img").src = "../images/icon-moon.svg";
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");

    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTask(taskInput.value.trim());
            taskInput.value = "";
        }
    });

    
    document.getElementById("all-tasks").addEventListener("click", () => setFilter("all"));
    document.getElementById("active-tasks").addEventListener("click", () => setFilter("active"));
    document.getElementById("completed-tasks").addEventListener("click", () => setFilter("completed"));

   
    document.getElementById("clearAll").addEventListener("click", () => {
        tasks = tasks.filter(task => task.status !== "complete");

        saveTasks();

        renderTasks();

    });

    renderTasks();
});



