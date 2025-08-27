const listForm = document.getElementById('list-form');
const listTitleInput = document.getElementById('list-title');
const listLinks = document.getElementById('list-links');

let lists = JSON.parse(localStorage.getItem('lists')) || {};

function renderListLinks() {
  listLinks.innerHTML = ''; 
  Object.keys(lists).forEach(title => {
    const li = document.createElement('li');

    const link = document.createElement('a');
    link.href = `list.html?name=${encodeURIComponent(title)}`;
    link.textContent = title;
    link.style.fontSize = '30px';
    link.style.padding = '5px 10px';

    const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.style.backgroundColor = '#c0392b';
  deleteBtn.style.borderRadius='20%'
    deleteBtn.onclick = function() {
      if (confirm(`Are you sure you want to delete the list "${title}"?`)) {
        delete lists[title];
        localStorage.setItem('lists', JSON.stringify(lists));
        renderListLinks();
}
};

    li.appendChild(link);
    li.appendChild(deleteBtn);
    listLinks.appendChild(li);
});
}

listForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const title = listTitleInput.value.trim();
  if (!title || lists[title]) return;

  lists[title] = [];
  localStorage.setItem('lists', JSON.stringify(lists));
  listTitleInput.value = '';
  renderListLinks();
});

renderListLinks();

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
