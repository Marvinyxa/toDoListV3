const inputTask = document.getElementById('add');
const selectPriority = document.getElementById('select-priority');
const taskList = document.getElementById('task-list');
const emptyList = document.getElementById('empty-list');
const url = 'http://127.0.0.1:3000/items';
const statusDictionary ={
    completed: 1,
    active: 2,
    cancelled: 3
};
const priorityDictionary = {
    low: 1,
    medium: 2,
    high: 3,
    any: 4
};
const sortStatusDictionary = {
    notSorted: 1,
    ascending: 2,
    descending: 3
};

let arrayTasks = [];
let dateStatus = sortStatusDictionary.notSorted;
let priorityStatus = sortStatusDictionary.notSorted;

getTasks();

/**
 * Функция подгружает все задачи с бэка
 * @returns {Promise<void>}
 */
async function getTasks() {
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        method: 'GET',
    };
    const response = await fetch(url, options);
    arrayTasks = await response.json();
    updateTasks(arrayTasks);
}

/**
 * Функция удаляет нужную задачу по айди с бэка
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
    };
    await fetch(requestUrl, options);
    getTasks();
    if (arrayTasks.length === 0) {
        emptyList.classList.remove('display-none');
    }
}

/**
 * Функция передает задачу на бэк
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
    };
    await fetch(url, options);
    getTasks();
}

/**
 * Функция отслеживает все изменения задачи и передает их на бэк
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
    };
    await fetch(requestUrl, options);
    getTasks();
}

/**
 * Функция добавляет новую задачу
 */
function addTask() {
    if (!inputTask.value) {
        alert('Вы ввели пустое значение!');
        return;
    }
    const task = {};
    if (inputTask.value && checkSameTask()) {
        task.text = inputTask.value;
        task.priority = selectPriority.value;
        task.date = new Date().getTime();
        task.stringDate = new Date().toLocaleString();
        task.status = statusDictionary.active; // status=1 - завершенная, status=2 - неотмеченная, status=3 - отклоненная
        inputTask.value = '';
        saveTask(task);
    }
}

/**
 * Функция проверяет, есть ли задача с таким же текстом
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
 * Функция вывода задачи
 * @param arr массив задач
 */
function tasksOutput(arr) {
    taskList.innerHTML = '';
    displayEmptyTasksStatus();
    arr.forEach(task => {
        taskList.innerHTML += `<div class="task-container">
            <div class="task-priority ${checkPriority(task)}" 
                 id="${task.id}">
                    ${taskPriority(task)}
            </div>
            <div class="task ${changeTaskClass(task)}">
                <div id="task-info"
                     class="task__info"> 
                    <div id="task-info-${task.id}"
                         ondblclick="changeTextTask(${task.id})"
                         class="task__info__text">${task.text}
                    </div>
                    <div class="task__info__date">
                             ${task.stringDate}
                    </div>
                </div>
                <div class="task__buttons">
                    <img src="checkmark.png"
                         onclick="completeTask(${task.id})" 
                         width="30" 
                         height="30"
                         class="${task.status === statusDictionary.cancelled ? 'display-none': ''}">
                    <img src="cross.png"
                         onclick="cancelTask(${task.id})" 
                         width="36" 
                         height="36"
                         class="${task.status === statusDictionary.completed ? 'display-none' : ''}">
                </div>
            </div>
            <img src="delete.png" 
                     width="30" 
                     height="30"
                     onclick="deleteTask(${task.id})"
                     class="task-delete">
        </div>`;
    });
}

/**
 * Функция выводит приоритет
 * @param task задача
 * @returns {string} приоритет
 */
function taskPriority (task) {
    if (Number(task.priority) === priorityDictionary.low) {
        return 'Низкий';
    }
    else if (Number(task.priority) === priorityDictionary.medium) {
        return 'Средний';
    }
    else {
        return 'Высокий'
    }
}

/**
 * Функция меняет стиль задачи в зависимости от статуса задачи
 * @param task - задача
 * @returns {string} нужный класс блока div в зависимости от статуса задачи
 */
function changeTaskClass(task) {
    if (task.status === statusDictionary.completed) {
        return 'task-completed';
    } else if (task.status === statusDictionary.cancelled) {
        return 'task-cancelled';
    } else {
        return '';
    }
}

/**
 * Функция окрашивает  приоритет задачи в нужный цвет
 * @param task - задача
 * @returns {string} нужный класс приоритета, который окрашен в нужный цвет
 */
function checkPriority(task) {
    if (Number(task.priority) === priorityDictionary.low) {
        return 'task-priority-low';
    } else if (Number(task.priority) === priorityDictionary.medium) {
        return 'task-priority-medium';
    } else {
        return 'task-priority-high';
    }
}

/**
 * Функция позволяет при двойном клике на текст задачи изменять его
 * @param taskId - идентификатор задачи
 */
function changeTextTask(taskId) {
    let task = arrayTasks.find(task => taskId === task.id);
    const parentElement = document.getElementById('task-info');
    const taskText = document.getElementById(`task-info-${taskId}`);
    let oldValue = taskText.innerHTML;
    let input = document.createElement('input');
    input.value = oldValue;
    taskText.classList.add('display-none');
    parentElement.appendChild(input);
    input.focus();
    input.onblur = function() {
        let newValue = input.value;
        taskText.innerHTML = newValue;
        taskText.classList.remove("display-none");
        parentElement.removeChild(input);
        task.text = newValue;
        putTask(task);
    };
}

/**
 * Функция меняет статус задачи с активной на завершенную и наоборот
 * @param taskId - айди задачи
 */
function completeTask(taskId) {
    const foundTask = arrayTasks.find(task => task.id === taskId);
    foundTask.status = (foundTask.status === statusDictionary.active) ? statusDictionary.completed : statusDictionary.active;
    putTask(foundTask);
}

/**
 * Функция меняет статус задачи с активной на отмененную и наоборот
 * @param taskId - айди задачи
 */
function cancelTask(taskId) {
    const foundTask = arrayTasks.find(task => task.id === taskId);
    foundTask.status = (foundTask.status === statusDictionary.active) ? statusDictionary.cancelled : statusDictionary.active;
    putTask(foundTask);
}

/**
 * Функция фильтрации
 * @returns {*} отфильтрованный массив
 */
function filterTasks() {
    const checkboxActive = document.getElementById('checkbox-filter-active').checked;
    const checkboxCancelled = document.getElementById('checkbox-filter-cancelled').checked;
    const checkboxCompleted = document.getElementById('checkbox-filter-completed').checked;
    const array = [...arrayTasks];
    let filteredArray= [];
    if (checkboxActive) {
        filteredArray = [...filteredArray, ...array.filter(task => task.status === statusDictionary.active)];
    }
    if (checkboxCancelled) {
        filteredArray = [...filteredArray, ...array.filter(task => task.status === statusDictionary.cancelled)];
    }
    if (checkboxCompleted) {
        filteredArray = [...filteredArray, ...array.filter(task => task.status === statusDictionary.completed)];
    }
    if (!checkboxCancelled && !checkboxActive && !checkboxCompleted) {
        filteredArray = structuredClone(array);
    }
    if (priorityStatus === dateStatus) { // проверка есть ли сортировка по дате или приоритету
        // если сортировки по дате или приоритету нет, то фильтрация идет следующим образом: сначала завершенные, потом активные, потом отмененные задачи
        filteredArray.sort((a,b) => a.status- b.status);
    }
    const filteredByPriority = filterByPriority(filteredArray);
    const sortedByPriority = sortBy(filteredByPriority,priorityStatus,'arrow-priority', 'priority');
    const sortedByDate = sortBy(sortedByPriority,dateStatus,'arrow-date', 'date');
    return findTask(sortedByDate);
}

/**
 * Функция перерисовки массива задач
 */
function updateTasks() {
    tasksOutput(filterTasks());
}

/**
 * Функция фильтрации по приоритету
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
 * Функция поиска задачи  по тексту
 * @param arr - массив задач
 * @returns {*} отфильтрованный массив
 */
function findTask(arr) {
    const inputValue = document.getElementById('input-find')?.value || '';
    return arr.filter(task => task.text.startsWith(inputValue));
}


/**
 * Функция сортировки по приоритету или по дате
 * @param arr - массив задач
 * @param status - статус сортировки по дате или приоритету
 * @param id - id нужной стрелки
 * @param key - ключ сортировки: по дате или приоритету
 * @returns {*[]} возвращает отфильтрованный массив задач по дате или приоритету
 */
function sortBy(arr, status, id, key) {
    const arrayClone = [...arr];
    const arrow = document.getElementById(id);
    if (status === sortStatusDictionary.ascending) {
        arrow.classList.add('arrow__up');
        arrayClone.sort((a,b) => a[key] - b[key]);
    }
    else if (status === sortStatusDictionary.descending) {
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
 * Функция смены статуса сортировки приоритета и блокировки статуса сортировки даты
 */
function changePriority() {
    priorityStatus = changeSortStatus(priorityStatus);
    dateStatus = sortStatusDictionary.notSorted;
    updateTasks();
}

/**
 * Функция смены статуса сортировки даты и блокировки статуса сортировки приоритета
 */
function changeDate() {
    dateStatus = changeSortStatus(dateStatus);
    priorityStatus = sortStatusDictionary.notSorted;
    updateTasks();
}

/**
 * Вспомогательная функция смены статуса сортировки даты или приоритета
 * @param currentStatus статус сортировки: по дате или приоритету
 * @returns {number} возвращает новый статус сортировки: по дате или приоритету
 */
function changeSortStatus(currentStatus) {
    if (currentStatus === sortStatusDictionary.ascending) {
        return sortStatusDictionary.descending;
    }
    else if (currentStatus === sortStatusDictionary.descending) {
        return sortStatusDictionary.notSorted;
    }
    else {
        return sortStatusDictionary.ascending;
    }
}

function displayEmptyTasksStatus() {
    if (arrayTasks.length > 0 ) {
        emptyList.classList.add('display-none');
    }
    else {
        emptyList.classList.remove('display-none');
    }
}