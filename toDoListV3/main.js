const inputTask = document.getElementById('add');
const selectPriority = document.getElementById('select-priority');
const taskList = document.getElementById('task-list');
const url = 'http://127.0.0.1:3000/items';
let arrayTasks = [];
let dateStatus = 1; // статус 1 - нет сортировки, статус 2 - по возрастанию, статус 3 - по убыванию
let priorityStatus = 1;

getTasks();

/**
 * функция подгружает все задачи с бэка
 * @returns {Promise<void>}
 */
async function getTasks() {
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        method: 'GET',
    }
    const response = await fetch(url, options);
    const tasks = await response.json();
    arrayTasks = tasks;
    updateTasks(arrayTasks);
}

/**
 * функция удаляет нужную задачу по айди с бэка
 * @param id - айди задачи
 * @returns {Promise<void>}
 */
async function deleteTask(id) {
    const requestUrl = url + `/${id}`;
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        method: 'DELETE',
    }
    const response = await fetch(requestUrl, options);
    const result = await response.json();
    getTasks();
}

/**
 * функция передает задачу на бэк
 * @param task - задача
 * @returns {Promise<void>}
 */
async function saveTask(task) {
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        method: "POST",
        body: JSON.stringify(task),
    }
    const response = await fetch(url, options);
    const result = await response.json();
    getTasks();
}

/**
 * функция отслеживает все изменения задачи и передает их на бэк
 * @param task - задача
 * @returns {Promise<void>}
 */
async function putTask(task) {
    const requestUrl = url + `/${task.id}`;
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        method: "PUT",
        body: JSON.stringify(task)
    }
    const response = await fetch(requestUrl, options);
    const result = await response.json();
    getTasks(); // ?todo сделать поиск элемента который изменяется
}

/**
 * функция добавляет новую задачу
 */
function addTask() {
    console.log('add')
    let task = {};
    if (inputTask.value && checkSameTask()) {
        task.text = inputTask.value;
        task.priority = selectPriority.value;
        task.date = new Date().getTime();
        task.stringDate = new Date().toLocaleString();
        task.status = 2; // status=1 - завершенная, status=2 - неотмеченная, status=3 - отклоненная
        inputTask.value = '';
        saveTask(task);
    }
}

/**
 * функция проверяет, есть ли задача с таким же текстом
 * @returns {boolean} логическое значение есть ли такая же задача или нет
 */
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

/**
 * функция вывода задачи
 * @param arr массив задач
 */
function tasksOutput(arr) {
    taskList.innerHTML = '';
    arr.forEach(task => {
        taskList.innerHTML += `<div class="todo__task">
            <div class="${checkPriority(task)}" 
            id="${task.id}">${taskPriority(task)}</div>
            <div class="${changeTaskClass(task)}">
                <div id="task-text-and-date" class="todo__task__text__and__date">
                    <div ondblclick="changeTextTask(${task.id})"
                    id="task-text-${task.id}"
                    class="todo__task__text">${task.text}</div>
                    <div class="todo__task__date">${task.stringDate}</div>
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

/**
 * функция выводит приоритет
 * @param task задача
 * @returns {string} приоритет
 */
function taskPriority (task) {
    if (task.priority === '1') {
        return 'Низкий';
    }
    else if (task.priority === '2') {
        return 'Средний';
    }
    else return 'Высокий';
}

/**
 * функция меняет стиль задачи в зависимости от статуса задачи
 * @param task - задача
 * @returns {string} нужный класс блока div в зависимости от статуса задачи
 */
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

/**
 * функция окрашивает  приоритет задачи в нужный цвет
 * @param task - задача
 * @returns {string} нужный класс приоритета, который окрашен в нужный цвет
 */
function checkPriority(task) {
    let classColorPriority = '';
    if (task.priority === '1') {
        classColorPriority = 'todo__task__priority__red';
    } else if (task.priority === '2') {
        classColorPriority = 'todo__task__priority__yellow';
    } else {
        classColorPriority = 'todo__task__priority__green';
    }
    return classColorPriority;
}

/**
 * функция позволяет при двойном клике на текст задачи изменять его
 * @param taskId - идентификатор задачи
 */
function changeTextTask(taskId) {
    let task = arrayTasks.find(task => taskId === task.id);
    console.log(task);
    let parentElement = document.getElementById('task-text-and-date');
    let div = document.getElementById(`task-text-${taskId}`);
    let oldValue = div.innerHTML;
    let input = document.createElement('input');
    input.value = oldValue;
    div.classList.add('hidden');
    parentElement.appendChild(input);
    input.focus();
    input.onblur = function() {
        let newValue = input.value;
        div.innerHTML = newValue;
        div.classList.remove("hidden");
        parentElement.removeChild(input);
        task.text = newValue;
        putTask(task);
    };
}

/**
 * функция меняет статус задачи с активной на завершенную и наоборот
 * @param taskId - айди задачи
 */
function completeTask(taskId) {
    const foundTask = arrayTasks.find(task => task.id === taskId);
    foundTask.status = (foundTask.status === 2) ? 1 : 2;
    putTask(foundTask);
}

/**
 * функция меняет статус задачи с активной на отмененную и наоборот
 * @param taskId - айди задачи
 */
function cancelTask(taskId) {
    const foundTask = arrayTasks.find(task => task.id === taskId);
    foundTask.status = (foundTask.status === 2) ? 3 : 2;
    putTask(foundTask);
}

/**
 * функция блокирует одну из кнопок статуса, в зависимости от текущего статуса задачи
 */
function blockButtons() {
    arrayTasks.forEach(task => {
        if (task.status === 1) {
            let btnCompleted = document.getElementById(`btn-cancel-${task.id}`);
            btnCompleted?.classList.replace('todo__task__checkbox__cancelled', 'todo__task__checkbox__cancelled__block');
        }
    });
    arrayTasks.forEach(task => {
        if (task.status === 3) {
            let btnCompleted = document.getElementById(`btn-complete-${task.id}`);
            btnCompleted?.classList.replace('todo__task__checkbox__completed', 'todo__task__checkbox__completed__block');
        }
    });

}

/**
 * вспомогательная функция сортировки по статусу: status = 1 - завершенная, status = 2 - активная, status = 3 - отмененная
 * @param a - первая задача
 * @param b - вторая задача
 * @returns {number} возвращает результат по которому и будет происходить сортировка
 */
function compareTasksByStatus(a, b) {
    if (a.status < b.status) return -1; // Сортировка по возрастанию
    if (a.status > b.status) return 1;
    return 0;
}

/**
 * великая функция фильтрации
 * @returns {*} отфильтрованный массив
 */
function filterTasks() {
    const checkboxActive = document.getElementById('checkbox-filter-active').checked;
    const checkboxCancelled = document.getElementById('checkbox-filter-cancelled').checked;
    const checkboxCompleted = document.getElementById('checkbox-filter-completed').checked;
    const array = [...arrayTasks];
    let filteredArray= [];
    if (checkboxActive) {
        filteredArray = [...filteredArray, ...array.filter(task => task.status === 2)];
    }
    if (checkboxCancelled) {
        filteredArray = [...filteredArray, ...array.filter(task => task.status === 3)];
    }
    if (checkboxCompleted) {
        filteredArray = [...filteredArray, ...array.filter(task => task.status === 1)];
    }
    if (!checkboxCancelled && !checkboxActive && !checkboxCompleted) {
        filteredArray = structuredClone(array);
    }
    if (priorityStatus === 1 && dateStatus === 1) {
        filteredArray.sort(compareTasksByStatus);
    }
    const filteredByPriority = filterByPriority(filteredArray);
    const sortedByPriority = sortBy(filteredByPriority,priorityStatus,'arrow-priority', 'priority');
    const sortedByDate = sortBy(sortedByPriority,dateStatus,'arrow-date', 'date');
    return findTask(sortedByDate);
}

/**
 * функция перерисовки массива задач
 */
function updateTasks() {
    tasksOutput(filterTasks());
}

/**
 * функция фильтрации по приоритету
 * @param arr - массив задач
 * @returns {*} отфильтрованный массив
 */
function filterByPriority(arr) {
    const priorityFilter = document.getElementById('select-filter-priority').value;
    if (priorityFilter === '4') {
        return arr;
    }
    return arr.filter(task => task.priority === priorityFilter);
}

/**
 * функция поиска задачи  по тексту
 * @param arr - массив задач
 * @returns {*} отфильтрованный массив
 */
function findTask(arr) {
    const inputValue = document.getElementById('input-find')?.value || '';
    return arr.filter(task => task.text.startsWith(inputValue));
}


/**
 * функция сортировки по приоритету или по дате
 * @param arr - массив задач
 * @param status - статус сортировки по дате или приоритету
 * @param id - id нужной стрелки
 * @param key - ключ сортировки: по дате или приоритету
 * @returns {*[]}
 */
function sortBy(arr, status, id, key) {
    const arrayClone = [...arr];
    const arrow = document.getElementById(id);
    if (status === 2) {
        arrow.classList.add('arrow__up');
        arrayClone.sort((a,b) => a[key] - b[key]);
    }
    else if (status === 3) {
        arrow.classList.remove('arrow__up');
        arrow.classList.add('arrow__down');
        arrayClone.sort((a,b) => b[key] - a[key]);
    }
    else {
        arrow.classList.remove('arrow__down');
        arrow.classList.remove('arrow__up');

    }
    return arrayClone;
}

/**
 * функция смены статуса сортировки приоритета и блокировки статуса сортировки даты
 */
function changePriority() {
    (priorityStatus < 3) ? priorityStatus++ : priorityStatus = 1;
    dateStatus = 1;
    updateTasks();
}

/**
 * функция смены статуса сортировки даты и блокировки статуса сортировки приоритета
 */
function changeDate() {
    (dateStatus < 3) ? dateStatus++ : dateStatus = 1;
    priorityStatus = 1;
    updateTasks();
}