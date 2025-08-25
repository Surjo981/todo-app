const urlParams = new URLSearchParams(window.location.search);
const listName = urlParams.get('name');

const listTitle = document.getElementById('list-name');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

listTitle.textContent = listName;
document.title = `${listName} - Ultra To-Do List`;

let lists = JSON.parse(localStorage.getItem('lists')) || {};
let currentList = lists[listName] || [];

todoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const taskText = todoInput.value.trim();
  if (!taskText) return;

  const taskObj = { text: taskText, completed: false};
  currentList.push(taskObj);
  saveList();
  addTaskToDOM(taskObj);
  todoInput.value = '';
});

function addTaskToDOM(taskObj) {
  const item = document.createElement('li');

  const span = document.createElement('span');
  span.textContent = taskObj.text;
  span.classList.toggle('completed', taskObj.completed);
  



  const completeBtn = document.createElement('button');
  completeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeBtn.style.backgroundColor = '#41b945ff';
  completeBtn.onclick = function() {
    taskObj.completed =!taskObj.completed;
    span.classList.toggle('completed', taskObj.completed);
    saveList();
    checkIfAllCompleted();
    updateProgress();
};

const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editBtn.style.backgroundColor = '#f0aa3aff';
    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit your task:", taskSpan.textContent);
      if (newText!== null && newText.trim()!== "") {
        taskSpan.textContent = newText.trim();
}
});



  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.style.backgroundColor = '#c0392b';
  deleteBtn.onclick = function() {
    todoList.removeChild(item);
    currentList = currentList.filter(t => t!== taskObj);
    saveList();
    updateProgress();
};
// Edit functionality
editBtn.onclick = function() {
  const newText = prompt("Edit your task:", span.textContent);
  if (newText !== null && newText.trim() !== "") {
    span.textContent = newText.trim();
    taskObj.text = newText.trim();
    saveList();
  }
};
item.appendChild(completeBtn);
item.appendChild(span);
item.appendChild(editBtn);
item.appendChild(deleteBtn);
todoList.appendChild(item);
}

function saveList() {
  lists[listName] = currentList;
  localStorage.setItem('lists', JSON.stringify(lists));
}



function checkIfAllCompleted() {
  const allDone = currentList.length> 0 && currentList.every(t => t.completed);
  if (allDone && Notification.permission === 'granted') {
    new Notification('✅ List Completed', { body: `${listName} is fully completed! 🎉`});
}
}

if (Notification.permission!== 'granted') {
  Notification.requestPermission();
}

currentList.forEach(addTaskToDOM);


// Fullscreen functionality

const fullscreenBtn = document.getElementById('fullscreen-btn');

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      alert(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});


//progress functionality
function updateProgress() {
  const tasks = document.querySelectorAll("#todo-list li");
  let completed = 0;

  tasks.forEach(task => {
    const span = task.querySelector("span");
    if (span && span.classList.contains("completed")) {
      completed++;
}
});

  const progressDisplay = document.getElementById("progress-display");
  progressDisplay.textContent = `Progress: ${completed} / ${tasks.length} tasks completed`;

  // Optional color feedback
  if (completed === tasks.length && tasks.length> 0) {
    progressDisplay.style.color = "#64f368ff";
} else {
    progressDisplay.style.color = "white";
}
}
