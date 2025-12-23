const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Функция добавления задачи
function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);

        // Добавляем крестик (кнопку удаления)
        let span = document.createElement("span");
        span.innerHTML = "\u00d7"; // Символ крестика
        li.appendChild(span);
    }
    inputBox.value = ""; // Очищаем поле ввода
    saveData(); // Сохраняем (пока заготовка)
}

// Обработка кликов по списку (Делегирование событий)
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        // Если кликнули на саму задачу -> переключаем статус "выполнено"
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        // Если кликнули на крестик -> удаляем задачу
        e.target.parentElement.remove();
        saveData();
    }
}, false);

// Добавляем возможность нажать Enter для добавления
inputBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Функции для сохранения (пока пустые, заполним на след. этапе)
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}

// Загружаем задачи при старте
showTask();
