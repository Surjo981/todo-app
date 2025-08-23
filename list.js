const urlParams = new URLSearchParams(window.location.search);
const listName = urlParams.get('name');

const listTitle = document.getElementById('list-name');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

listTitle.textContent = listName;

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
  item.style.display = 'flex';
  item.style.alignItems = 'center';
  item.style.padding = '8px 8px';
  const left = document.createElement('div');
  left.style.display = 'flex';
  left.style.alignItems = 'center';
  left.style.flexGrow = '1';
  left.style.gap = '10px';
  


  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = taskObj.completed;
  checkbox.onchange = function () {
    taskObj.completed = checkbox.checked;
    span.style.textDecoration = taskObj.completed? 'line-through': 'none';
    saveList();
    checkIfAllCompleted();
};

  const span = document.createElement('span');
  span.textContent = taskObj.text;
  span.style.textDecoration = taskObj.completed? 'line-through': 'none';

  left.appendChild(checkbox);
  left.appendChild(span);

  const menu = document.createElement('div');
  menu.style.position = 'relative';

  const menuBtn = document.createElement('button');
  menuBtn.textContent = '⋮';
  menuBtn.onclick = function () {
    menuOptions.style.display = menuOptions.style.display === 'block'? 'none': 'block';
  };
  menuBtn.style.background = 'none';

  menuBtn.style.border = 'none';
  menuBtn.style.padding = '0';
  menuBtn.style.color = 'var(--text-color)';

  const menuOptions = document.createElement('ul');
  menuOptions.style.position = 'absolute';
  menuOptions.style.top = '25px';
  menuOptions.style.right = '0';
  menuOptions.style.background = 'var(--object-bg)';
  menuOptions.style.border = '1px solid #ccc';
  menuOptions.style.padding = '5px';
  menuOptions.style.listStyle = 'none';
  menuOptions.style.display = 'none';
  menuOptions.style.borderRadius = '10px';
  menuOptions.style.zIndex = '1000';
  menuOptions.style.width = '100px';
  menuOptions.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

  const editOption = document.createElement('li');
  editOption.textContent = 'Edit';
  editOption.style.cursor = 'pointer';
  editOption.style.marginBottom = '5px';
  editOption.style.padding = '5px';
  editOption.onclick = function () {
    const newText = prompt('Edit your task:', taskObj.text);
    if (newText!== null && newText.trim()!== '') {
      taskObj.text = newText;
      span.textContent = newText;
      saveList();
}
    menuOptions.style.display = 'none';
};

  const deleteOption = document.createElement('li');
  deleteOption.textContent = 'Delete';
  deleteOption.style.cursor = 'pointer';
  deleteOption.style.marginBottom = '5px';
  deleteOption.style.padding = '5px';

  deleteOption.onclick = function () {
    todoList.removeChild(item);
    currentList = currentList.filter(t => t!== taskObj);
    saveList();
    checkIfAllCompleted();
};

  menuOptions.appendChild(editOption);
  menuOptions.appendChild(deleteOption);
  menu.appendChild(menuBtn);
  menu.appendChild(menuOptions);

  item.appendChild(left);
  item.appendChild(menu);
  todoList.appendChild(item);
}

function saveList() {
  lists[listName] = currentList;
  localStorage.setItem('lists', JSON.stringify(lists));
}

function checkIfAllCompleted() {
  const allDone = currentList.length> 0 && currentList.every(t => t.completed);
  if (allDone && Notification.permission === 'granted') {
    new Notification('✅ List Completed', {
      body: `${listName} is fully completed! 🎉`
});
}
}
// Notification permission request on page load
document.addEventListener('DOMContentLoaded', () => {
  if ('Notification' in window) {
    if (Notification.permission!== 'granted') {
      Notification.requestPermission();
}
}

  currentList.forEach(addTaskToDOM);
});

