// Background color functions
function BGgreen() {
    document.body.style.backgroundColor = 'darkgreen';
}

function BGred() {
    document.body.style.backgroundColor = 'red';
}

function BGblue() {
    document.body.style.backgroundColor = 'blue';
}

function BGyellow() {
    document.body.style.backgroundColor = 'yellow';
}

function DefaultBG() {
    document.body.style.backgroundColor = "#fff";
}

// Font size management
let currentFontSize = 16;
const minFontSize = 12;
const maxFontSize = 24;

function updateFontSize(value) {
    document.body.style.fontSize = `${value}px`;
    const fontSizeValue = document.getElementById('fontSizeValue');
    if (fontSizeValue) {
        fontSizeValue.textContent = `${value}px`;
    }
    localStorage.setItem('fontSize', value);
}

function changeFontSize(action) {
    switch(action) {
        case 'increase':
            if (currentFontSize < maxFontSize) {
                currentFontSize += 2;
            }
            break;
        case 'decrease':
            if (currentFontSize > minFontSize) {
                currentFontSize -= 2;
            }
            break;
        case 'reset':
            currentFontSize = 16;
            break;
    }
    
    updateFontSize(currentFontSize);
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    const button = document.getElementById('darkmod');
    if (button) {
        button.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    }
}

// Font style management
function changeFontStyle(fontFamily) {
    document.body.style.fontFamily = fontFamily;
    localStorage.setItem('fontFamily', fontFamily);
}

// To-do List Functions
function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText) {
        const taskList = document.getElementById('taskList');
        if (taskList) {
            const li = document.createElement('li');
            
            li.innerHTML = `
                <span class="task-text" ondblclick="editTask(this)">${taskText}</span>
                <button class="delete-btn" onclick="deleteTask(this)">X</button>
            `;
            
            const taskSpan = li.querySelector('.task-text');
            taskSpan.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.toggle('completed');
                    saveTasksToLocalStorage();
                }
            });
            
            taskList.appendChild(li);
            input.value = '';
            saveTasksToLocalStorage();
        }
    }
}

function deleteTask(element) {
    if (element && element.parentElement) {
        element.parentElement.remove();
        saveTasksToLocalStorage();
    }
}

function editTask(element) {
    if (!element) return;
    
    const currentText = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    
    const keyupHandler = function(event) {
        if (event.key === 'Enter') {
            const newSpan = document.createElement('span');
            newSpan.textContent = this.value;
            newSpan.className = 'task-text';
            newSpan.ondblclick = function() { editTask(this); };
            
            newSpan.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.toggle('completed');
                    saveTasksToLocalStorage();
                }
            });
            
            this.parentElement.replaceChild(newSpan, this);
            saveTasksToLocalStorage();
            
            
            input.removeEventListener('keyup', keyupHandler);
        }
    };
    
    input.addEventListener('keyup', keyupHandler);
    element.parentElement.replaceChild(input, element);
    input.focus();
}

function saveTasksToLocalStorage() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;
    
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        const taskText = li.querySelector('.task-text');
        if (taskText) {
            tasks.push({
                text: taskText.textContent,
                completed: taskText.classList.contains('completed')
            });
        }
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    const taskList = document.getElementById('taskList');
    
    if (savedTasks && taskList) {
        const tasks = JSON.parse(savedTasks);
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="task-text" ondblclick="editTask(this)">${task.text}</span>
                <button class="delete-btn" onclick="deleteTask(this)">X</button>
            `;
            
            const taskText = li.querySelector('.task-text');
            if (taskText && task.completed) {
                taskText.classList.add('completed');
            }
            
            taskText.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.toggle('completed');
                    saveTasksToLocalStorage();
                }
            });
            
            taskList.appendChild(li);
        });
    }
}

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Dark mode initialization
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        const darkModeBtn = document.getElementById('darkmod');
        if (darkModeBtn) {
            darkModeBtn.textContent = 'Light Mode';
        }
    }
    
    // Font size initialization
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        const slider = document.getElementById('fontSizeSlider');
        if (slider) {
            slider.value = savedFontSize;
            updateFontSize(savedFontSize);
        }
    }
    
    // Font family initialization
    const savedFont = localStorage.getItem('fontFamily');
    if (savedFont) {
        document.body.style.fontFamily = savedFont;
    }
    
    // Todo list initialization
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
        taskInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                addTask();
            }
        });
        loadTasksFromLocalStorage();
    }
});