const inputTask = document.getElementById('add');
const selectPriority = document.getElementById('select-priority');
const taskList = document.getElementById('task-list');
let arrayTasks = [];
checkLocalStorage('todo');

// функция добавляет новую задачу
function addTask() {
    let task = {};
    if (inputTask.value && checkSameTask()) {
        const taskDate = new Date();
        task.id = Date.now();
        task.text = inputTask.value;
        task.priority = selectPriority.value;
        task.date = taskDate.toLocaleString();
        task.status = 2; // status=1 - завершенная, status=2 - неотмеченная, status=3 - отклоненная
        inputTask.value = '';
        arrayTasks.push(task);
        tasksOutput(arrayTasks);
        localStorage.setItem('todo', JSON.stringify(arrayTasks));
    }
}


// функция проверяет, есть ли задача с таким же текстом
function checkSameTask() {
    let isNotHaveSameTask = true;
    if (!arrayTasks.length) {
        return true;
    }
    arrayTasks.forEach((task) => {
        if (task.text === inputTask.value) {
            alert('Задача уже существует!');
            isNotHaveSameTask = false;
        }
    });
    return isNotHaveSameTask;
}

// функция вывода задачи
function tasksOutput(arr) {
    arr.sort(compareTasks);
    taskList.innerHTML = '';
    arr.forEach(task => {
        taskList.innerHTML += `<div class="todo__task">
            <div class="${checkPriority(task)}" 
            id="${task.id}">${task.priority}</div>
            <div class="${changeTaskClass(task)}">
                <div class="todo__task__text__and__date">
                    <div class="todo__task__text">${task.text}</div>
                    <div class="todo__task__date">${task.date}</div>
                </div>
                <div class="todo__task__button">
                    <div class="todo__task__checkbox__completed"
                     id="btn-complete-${task.id}">
                        <label>
                            <button onclick="completeTask(${task.id})"></button>
                            <img src="checkmark.png" 
                            width="30" 
                            height="30">
                        </label>
                    </div>
                    <div class="todo__task__checkbox__cancelled" 
                    id="btn-cancel-${task.id}">
                        <label>
                            <button onclick="cancelTask(${task.id})"></button>
                            <img src="cross.png" 
                            width="36" 
                            height="36">
                        </label>
                    </div>
                </div>
            </div>
            <div class="todo__delete">
                <label>
                    <button onclick="deleteTask(${task.id})"></button>
                    <div><img src="delete.png" width="30" height="30" ></div>
                </label>
            </div>
        </div>`;
    });
    blockButtons();
}

// функцкия удаления задачи
function deleteTask(id) {
    let index = arrayTasks.findIndex((idx, task) => (task.id === idx.toString()));
    arrayTasks.splice(index, 1);
    localStorage.setItem('todo', JSON.stringify(arrayTasks));
    tasksOutput(arrayTasks);
}

// функция меняет стиль задачи в зависимости от статуса задачи
function changeTaskClass(task) {
    let taskClass = '';
    if (task.status === 1) {
        taskClass = 'todo__task__text__body__completed';
    } else if (task.status === 3) {
        taskClass = 'todo__task__text__body__cancelled';
    } else {
        taskClass = 'todo__task__text__body';
    }
    return taskClass;
}

// функция окрашивает  приоритет задачи в нужный цвет
function checkPriority(task) {
    let classColorPriority = '';
    if (task.priority === 'Низкий') {
        classColorPriority = 'todo__task__priority__red';
    } else if (task.priority === 'Средний') {
        classColorPriority = 'todo__task__priority__yellow';
    } else {
        classColorPriority = 'todo__task__priority__green';
    }
    return classColorPriority;
}

// функция проверяет если локальное хранилище не пустое, то выводит задачу из него
function checkLocalStorage(key) {
    if (localStorage.getItem(key)) {
        arrayTasks = JSON.parse(localStorage.getItem(key));
        tasksOutput(arrayTasks);
    }
}

function completeTask(id) {
    let newArrayTasks = [];
    newArrayTasks = arrayTasks.map(task => {
        if (task.id === id) {
            if (task.status === 2) {
                task.status = 1;
                return task;
            } else {
                task.status = 2;
                return task;
            }
        } else {
            return task;
        }
    })
    localStorage.setItem('todo', JSON.stringify(newArrayTasks));
    tasksOutput(arrayTasks);
}

function cancelTask(id) {
    let newArrayTasks = [];
    newArrayTasks = arrayTasks.map(task => {
        if (task.id === id) {
            if (task.status === 2) {
                task.status = 3;
                return task;
            } else {
                task.status = 2;
                return task;
            }
        } else {
            return task;
        }
    })
    localStorage.setItem('todo', JSON.stringify(newArrayTasks));
    tasksOutput(arrayTasks);
}

// функция блокирует одну из кнопок статуса, в зависимости от текущего статуса задачи
function blockButtons() {
    arrayTasks.forEach(task => {
        if (task.status === 1) {
            let btnCompleted = document.getElementById(`btn-cancel-${task.id}`);
            btnCompleted.classList.replace('todo__task__checkbox__cancelled', 'todo__task__checkbox__cancelled__block');
        }
    });
    arrayTasks.forEach(task => {
        if (task.status === 3) {
            let btnCompleted = document.getElementById(`btn-complete-${task.id}`);
            btnCompleted.classList.replace('todo__task__checkbox__completed', 'todo__task__checkbox__completed__block');
        }
    });

}

// вспомогательная функция сортировки по статусу: status = 1 - завершенная, status = 2 - не отмечена, status = 3 - отмененная
function compareTasks(a, b) {
    if (a.status < b.status) return -1; // Сортировка по возрастанию
    if (a.status > b.status) return 1;
    return 0;
}

function filterByActive() {
    let filteredArray;
    filteredArray = [];
    const checkbox = document.getElementById(('checkbox-filter-active'));
    if (checkbox.checked) {
        filteredArray = arrayTasks.filter(task => task.status === 2);
        tasksOutput(filteredArray);
    } else {
        arrayTasks = JSON.parse(localStorage.getItem('todo'));
        localStorage.setItem('todo', JSON.stringify(arrayTasks));
        tasksOutput(arrayTasks);
    }
}

function filterByCancelled() {
    let filteredArray;
    filteredArray = [];
    const checkbox = document.getElementById(('checkbox-filter-cancelled'));
    if (checkbox.checked) {
        filteredArray = arrayTasks.filter(task => task.status === 3);
        tasksOutput(filteredArray);
    } else {
        arrayTasks = JSON.parse(localStorage.getItem('todo'));
        localStorage.setItem('todo', JSON.stringify(arrayTasks));
        tasksOutput(arrayTasks);
    }
}

function filterByCompleted() {
    let filteredArray;
    filteredArray = [];
    const checkbox = document.getElementById(('checkbox-filter-completed'));
    if (checkbox.checked) {
        filteredArray = arrayTasks.filter(task => task.status === 1);
        tasksOutput(filteredArray);
    } else {
        arrayTasks = JSON.parse(localStorage.getItem('todo'));
        localStorage.setItem('todo', JSON.stringify(arrayTasks));
        tasksOutput(arrayTasks);
    }
}