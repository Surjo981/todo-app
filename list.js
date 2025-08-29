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

  const taskObj = { 
    text: taskText, 
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
  currentList.push(taskObj);
  saveList();
  addTaskToDOM(taskObj);
  todoInput.value = '';
  updateProgress();
});

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function addTaskToDOM(taskObj) {
  const item = document.createElement('li');
  item.style.display = 'flex';
  item.style.flexDirection = 'column';
  item.style.marginBottom = '12px';
  item.style.padding = '12px';
  item.style.borderRadius = '9px';
  item.style.backgroundColor = taskObj.completed ? 'rgba(100, 243, 104, 0.1)' : 'rgba(255, 255, 255, 0.05)';
  item.style.backgroundColor = 'var(--item)';

  // Top row: complete-btn, task-name, edit-btn, delete-btn (ALL LEFT ALIGNED)
  const topRow = document.createElement('div');
  topRow.style.display = 'flex';
  topRow.style.alignItems = 'flex-start';
  topRow.style.gap = '8px';
  topRow.style.width = '100%';

  const span = document.createElement('span');
  span.textContent = taskObj.text;
  span.classList.toggle('completed', taskObj.completed);
  span.style.wordBreak = 'break-word';
  span.style.lineHeight = '1.4';
  span.style.paddingTop = '8px'; // Align with button center

  // Timestamp display (bottom row - RIGHT ALIGNED)
  const timestampDiv = document.createElement('p');
  timestampDiv.style.fontSize = '0.75em';
  timestampDiv.style.color = '#888';
  timestampDiv.style.marginTop = '8px';
  timestampDiv.style.textAlign = 'right';
  timestampDiv.style.width = '100%';
  timestampDiv.style.paddingRight = '0px';
  
  if (taskObj.completed && taskObj.completedAt) {
    timestampDiv.innerHTML = `<i class="fa-solid fa-check"></i> ${formatTimestamp(taskObj.completedAt)}`;
    timestampDiv.style.color = 'var(--green)';
  } else {
    timestampDiv.innerHTML = ` ${formatTimestamp(taskObj.createdAt)}`;
  }

  
  if (taskObj.completed && taskObj.completedAt) {
    timestampDiv.innerHTML = `<i class="fa-solid fa-check"></i>  ${formatTimestamp(taskObj.completedAt)}`;
    timestampDiv.style.color = 'var(--green)';
  } else {
    timestampDiv.innerHTML = ` ${formatTimestamp(taskObj.createdAt)}`;
  }

  const completeBtn = document.createElement('button');
  completeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeBtn.style.backgroundColor = '#41b945ff';
  completeBtn.style.borderRadius = '6px';
  completeBtn.style.border = 'none';
  completeBtn.style.flexShrink = '0';
  completeBtn.onclick = function() {
    taskObj.completed = !taskObj.completed;
    
    // Update timestamp
    if (taskObj.completed) {
      taskObj.completedAt = new Date().toISOString();
      timestampDiv.innerHTML = `<i class="fa-solid fa-check"></i> ${formatTimestamp(taskObj.completedAt)}`;
      timestampDiv.style.color = '#64f368ff';
    } else {
      taskObj.completedAt = null;
      timestampDiv.innerHTML = ` ${formatTimestamp(taskObj.createdAt)}`;
      timestampDiv.style.color = '#888';
    }
    
    span.classList.toggle('completed', taskObj.completed);
    saveList();
    checkIfAllCompleted();
    updateProgress();
  };

  const editBtn = document.createElement("button");
  editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  editBtn.style.backgroundColor = '#f0aa3aff';
  editBtn.style.borderRadius = '6px';
  editBtn.style.border = 'none';
  editBtn.style.flexShrink = '0';
  editBtn.onclick = function() {
    const newText = prompt("Edit your task:", span.textContent);
    if (newText !== null && newText.trim() !== "") {
      span.textContent = newText.trim();
      taskObj.text = newText.trim();
      saveList();
    }
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.style.backgroundColor = '#c0392b';
  deleteBtn.style.borderRadius = '6px';
  deleteBtn.style.border = 'none';
  deleteBtn.style.flexShrink = '0';
  deleteBtn.onclick = function() {
    todoList.removeChild(item);
    currentList = currentList.filter(t => t !== taskObj);
    saveList();
    updateProgress();
  };

  // Assemble the top row: complete-btn, task-name, edit-btn, delete-btn (LEFT ALIGNED)
  topRow.appendChild(completeBtn);
  topRow.appendChild(span);
  topRow.appendChild(editBtn);
  topRow.appendChild(deleteBtn);

  // Assemble the entire item
  item.appendChild(topRow);
  item.appendChild(timestampDiv);
  todoList.appendChild(item);
}

function saveList() {
  lists[listName] = currentList;
  localStorage.setItem('lists', JSON.stringify(lists));
}

function checkIfAllCompleted() {
  const allDone = currentList.length > 0 && currentList.every(t => t.completed);
  if (allDone && Notification.permission === 'granted') {
    new Notification('✅ List Completed', { body: `${listName} is fully completed! 🎉`});
  }
}

if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

// Enhanced progress functionality
function updateProgress() {
  let progressDisplay = document.getElementById("progress-display");
  
  // Create progress display if it doesn't exist
  if (!progressDisplay) {
    progressDisplay = document.createElement("div");
    progressDisplay.id = "progress-display";
    progressDisplay.style.margin = "15px 0";
    progressDisplay.style.padding = "15px";
    progressDisplay.style.borderRadius = "8px";
    progressDisplay.style.backgroundColor = "var(--item)";
    progressDisplay.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    progressDisplay.style.transition = "color 0.3s ease";
    progressDisplay.style.width = "70%";
    progressDisplay.style.maxWidth = "400px";
    // Insert before todo list
    const todoContainer = todoList.parentNode;
    todoContainer.insertBefore(progressDisplay, todoList);
  }
  
  const totalTasks = currentList.length;
  const completedTasks = currentList.filter(task => task.completed).length;
  
  if (totalTasks === 0) {
    progressDisplay.innerHTML = `<div style="text-align: center; color: #888;">No tasks yet</div>`;
    return;
  }

  const percentage = Math.round((completedTasks / totalTasks) * 100);
  
  // Create progress bar
  const progressHTML = `
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; color: var(--text-color)">
      <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 10px; height: 10px; overflow: hidden; min-width: 100px;">
        <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, #41b945ff, #64f368ff); transition: width 0.3s ease; border-radius: 10px;"></div>
      </div>
      <span style="font-weight: bold; min-width: 45px; font-size: 0.9em;">${percentage}%</span>
    </div>
    <div style="text-align: center; font-size: 0.85em; color:var(--text-color)">
      ${completedTasks} of ${totalTasks} tasks completed
      ${completedTasks > 0 && completedTasks < totalTasks ? `<br><small style="color: #888; font-size: 0.8em;">Keep it up! 💪</small>` : ''}
      ${completedTasks === totalTasks ? `<br><small style="color: var(--green); font-size: 0.8em;">All done! 🎉</small>` : ''}
    </div>
  `;
  
  progressDisplay.innerHTML = progressHTML;

  // Color feedback
  if (completedTasks === totalTasks && totalTasks > 0) {
    progressDisplay.style.color = "#64f368ff";
  } else {
    progressDisplay.style.color = "white";
  }
}

// Load existing tasks and update progress
currentList.forEach(addTaskToDOM);
updateProgress();

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

// Update timestamps every minute
setInterval(() => {
  currentList.forEach((task, index) => {
    const taskItems = document.querySelectorAll('#todo-list li');
    const timestampDiv = taskItems[index]?.querySelector('div:last-child');
    
    if (timestampDiv && task) {
      if (task.completed && task.completedAt) {
        timestampDiv.innerHTML = `✅ ${formatTimestamp(task.completedAt)}`;
      } else {
        timestampDiv.innerHTML = `📝 ${formatTimestamp(task.createdAt)}`;
      }
    }
  });
}, 60000); // Update every minute
