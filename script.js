// Шаг 1: Находим кнопку на странице по её ID
const themeToggleBtn = document.getElementById('theme-toggle');

// Шаг 2: Проверяем, была ли сохранена тема ранее
const currentTheme = localStorage.getItem('theme');

// Функция включения светлой темы
function enableLightTheme() {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggleBtn.innerText = '🌙';
}

// 1. Если пользователь сам выбрал светлую тему — включаем
if (currentTheme === 'light') {
    enableLightTheme();
}
// 2. Если пользователь ничего не выбирал — смотрим на час (Smart Mode 🧠)
else if (!currentTheme) {
    const hour = new Date().getHours();
    // Если время от 7 утра до 19 вечера (день), включаем светлую
    if (hour > 7 && hour < 19) {
        enableLightTheme();
    }
}

// Шаг 3: Добавляем "слушателя событий" (Event Listener)
// Это как сказать кнопке: "Жди, когда на тебя кликнут"
themeToggleBtn.addEventListener('click', () => {

    // Смотрим, какая тема сейчас стоит
    const hasLightTheme = document.documentElement.getAttribute('data-theme') === 'light';

    if (hasLightTheme) {
        // Если была светлая -> выключаем (становится темная)
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark'); // Запоминаем выбор
        themeToggleBtn.innerText = '☀️'; // Меняем иконку на солнце
    } else {
        // Если была темная -> включаем светлую
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); // Запоминаем выбор
        themeToggleBtn.innerText = '🌙'; // Меняем иконку на луну
    }
});
