// 1. Состояние приложения (массив объектов)
let tasks = [];
let currentFilter = 'all'; // 'all', 'active', 'completed'
let nextId = 1;

// 2. Получаем ссылки на DOM-элементы
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const statsEl = document.getElementById('stats');
const filterBtns = document.querySelectorAll('.filter-btn');

// 3. Функция добавления задачи
function addTask() {
    const text = taskInput.value.trim(); // Убираем пробелы по краям
    
    // Проверка на пустую строку (пункт 2 ТЗ)
    if (text === '') {
        alert('Задача не может быть пустой!');
        return;
    }

    // Создаем объект задачи
    const newTask = {
        id: nextId++,
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = ''; // Очищаем поле ввода
    render(); // Перерисовываем список
}

// 4. Функция удаления задачи
function deleteTask(id) {
    // Используем filter для создания нового массива без удаленного элемента
    tasks = tasks.filter(task => task.id !== id);
    render();
}

// 5. Функция переключения статуса (выполнено/не выполнено)
function toggleTask(id) {
    // Используем map для изменения конкретного элемента
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    render();
}

// 6. Функция обновления счетчика
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    
    statsEl.textContent = `Осталось: ${active}, Выполнено: ${completed}`;
}

// 7. Главная функция отрисовки (render)
function render() {
    // Очищаем список перед перерисовкой
    taskList.innerHTML = '';

    // Фильтруем задачи в зависимости от выбранного фильтра
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Генерируем HTML для каждой задачи (пункт 4 ТЗ)
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        // Создаем чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        // Обработчик события через addEventListener (пункт 8 ТЗ)
        checkbox.addEventListener('change', () => toggleTask(task.id));

        // Создаем текст задачи
        const span = document.createElement('span');
        span.textContent = task.text;
        // Добавляем класс .completed если задача выполнена
        if (task.completed) {
            span.classList.add('completed');
        }

        // Создаем кнопку удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        // Собираем элемент
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content';
        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        // Добавляем в DOM
        taskList.appendChild(li);
    });

    // Обновляем счетчик
    updateStats();
}

// 8. Обработчики событий

// Добавление по клику на кнопку
addBtn.addEventListener('click', addTask);

// Добавление по нажатию Enter в поле ввода
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Обработка фильтров
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Меняем активный класс у кнопок
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Меняем текущий фильтр и перерисовываем
        currentFilter = btn.dataset.filter;
        render();
    });
});

// Первоначальная отрисовка (на случай, если задачи уже есть, но у нас пустой массив)
render();