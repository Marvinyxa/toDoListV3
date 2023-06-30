const inputTask = document.getElementById('add');
const selectPriority = document.getElementById('select-priority');
const taskList = document.getElementById('task-list');
let arrayTasks = [];


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
                    <div class="todo__task__checkbox__completed">
                        <label>
                            <input type="checkbox">
                            <div><img src="checkmark.png" width="30" height="30"></div>
                        </label>
                    </div>
                    <div class="todo__task__checkbox__failed">
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
}

// функцкия удаления задачи
function deleteTask(id) {
    console.log('deleted');
    let index = arrayTasks.findIndex((idx,task) => (task. id === idx.toString()));
    arrayTasks.splice(index, 1);
    console.log(arrayTasks);
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