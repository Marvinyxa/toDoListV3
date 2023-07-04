const inputTask = document.getElementById('add');
const selectPriority = document.getElementById('select-priority');
const taskList = document.getElementById('task-list');
let arrayTasks = [];
checkLocalStorage();

// функция добавляет новую задачу
function addTask() {
    let task = {};
    if (inputTask.value && checkSameTask(inputTask.value, arrayTasks)) {
        let dateTask = new Date();
        task.id = Date.now();
        task.text = inputTask.value;
        task.priority = selectPriority.value;
        task.date = dateTask.toLocaleString();
        task.isCompleted = false;
        task.isCancelled = false;
        inputTask.value = '';
        arrayTasks.push(task);
        tasksOutput();
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
function tasksOutput() {
   sortByStatus();
    taskList.innerHTML = '';
    arrayTasks.forEach(task => {
        taskList.innerHTML += `<div class="todo__task">
            <div class="${checkPriority(task)}" id="${task.id}">${task.priority}</div>
            <div class="${changeClassTask(task)}">
                <div class="todo__task__text__and__date">
                    <div class="todo__task__text">${task.text}</div>
                    <div class="todo__task__date">${task.date}</div>
                </div>
                <div class="todo__task__button">
                    <div class="todo__task__checkbox__completed" onclick="completeTask(${task.id})">
                        <label>
                            <input type="checkbox">
                            <div><img src="checkmark.png" width="30" height="30"></div>
                        </label>
                    </div>
                    <div class="todo__task__checkbox__cancelled" onclick="cancelTask(${task.id})">
                        <label>
                            <input type="checkbox">
                            <div><img src="cross.png" width="36" height="36"></div>
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
        </div>`
    })
    blockButtons();
}

// функцкия удаления задачи
function deleteTask(id) {
    let index = arrayTasks.findIndex((idx, task) => (task.id === idx.toString()));
    arrayTasks.splice(index, 1);
    localStorage.setItem('todo', JSON.stringify(arrayTasks));
    tasksOutput();
}

// функция меняет стиль задачи в зависимости от статуса задачи
function changeClassTask(task) {
    let classTaskText = '';
    if (task.isCompleted) {
        classTaskText = 'todo__task__text__body__completed';
    } else if (task.isCancelled) {
        classTaskText = 'todo__task__text__body__cancelled';
    } else classTaskText = 'todo__task__text__body';
    return classTaskText;
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
function checkLocalStorage() {
    if (localStorage.getItem('todo') !== undefined) {
        arrayTasks = JSON.parse(localStorage.getItem('todo'));
        tasksOutput();
    }
}

function completeTask(id) {
    arrayTasks.map(task => {
        if (task.id === id) {
            task.id = Date.now();
            task.isCompleted = !task.isCompleted;
            localStorage.setItem('todo', JSON.stringify(arrayTasks));
        }
        tasksOutput();
    })
}

function cancelTask(id) {
    arrayTasks.map(task => {
        if (task.id === id) {
            task.id = Date.now();
            task.isCancelled = !task.isCancelled;
            localStorage.setItem('todo', JSON.stringify(arrayTasks));
        }
        tasksOutput();
    })
}
// функция блокирует одну из кнопок статуса, в зависимости от текущего статуса задачи
function blockButtons () {
    arrayTasks.forEach(task => {
        if (task.isCompleted) {
            let btnFailed = document.querySelector('.todo__task__checkbox__cancelled');
            btnFailed.classList.replace('todo__task__checkbox__cancelled', 'todo__task__checkbox__cancelled__block');
        }
        if (task.isCancelled) {
            let btnCompleted =document.querySelector('.todo__task__checkbox__completed');
            console.log(btnCompleted);
            btnCompleted.classList.replace('todo__task__checkbox__completed','todo__task__checkbox__completed__block');
        }
    })

}
// функция сортировки по статусу
function sortByStatus () {
    // сортируем задачи в зависимости от статуса: завершенные(зеленые) - вверху списка, отмененные(красные) - внизу списка
    arrayTasks.sort((task1, task2) => {
        if (task1.isCancelled && !task2.isCancelled) {
            return 1;
        }
        if (!task1.isCancelled && task2.isCancelled) {
            return -1;
        }
        if (task1.isCompleted && !task2.isCompleted) {
            return -1;
        }
        if (!task1.isCompleted && task2.isCompleted) {
            return 1;
        }
        return 0;
    });
}
