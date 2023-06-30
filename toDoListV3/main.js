const inputTask = document.getElementById('add');
// const buttonAddTask = document.getElementById('btn-add-task');
const selectPriority = document.getElementById('select-priority');
const taskList = document.getElementById('task-list');;
let arrayTasks = [];


// добавляем новую задачу
function addTask () {
    let task = {};
    if (inputTask.value && checkSameTask(inputTask.value,arrayTasks)) {
        let dateTask = new Date ()
        task.id = Date.now();
        task.text = inputTask.value;
        task.priority = selectPriority.value;
        task.date = dateTask.toLocaleString();
        task.isCompleted = false;
        task.isCancelled = false;
        console.log(task);
        arrayTasks.push(task);
        console.log(arrayTasks);
        inputTask.value = '';
        taskOutput(task);
    }
}


// функция проверяет, есть ли задача с таким же текстом
function checkSameTask(text,array) {
    let isHaveSameTask = true;
    if (!array.length) {
        return true;
    }
    array.forEach((task) => {
       if(task.text === text) {
           alert('Задача уже существует!');
           isHaveSameTask = false;
       }
    });
    return isHaveSameTask;
}

// функция вывода задачи
function taskOutput(task) {
    let classColorPriority = '';

    if (task.priority === 'Низкий') {
        classColorPriority = 'todo__task__priority__red';
    }
    else {
        if (task.priority === 'Средний') {
            classColorPriority = 'todo__task__priority__yellow'
        }
        else {
            classColorPriority = 'todo__task__priority__green'
        }
    }
    taskList.innerHTML += `<div class="todo__task">
            <div class="${classColorPriority}">${task.priority}</div>
            <div class="todo__task__text__body">
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
                    <button></button>
                    <div><img src="delete.png" width="30" height="30"></div>
                </label>
            </div>
        </div>`
}