// Шаг 1: Находим кнопку на странице по её ID
const themeToggleBtn = document.getElementById('theme-toggle');

// Шаг 2: Проверяем, была ли сохранена тема ранее
const currentTheme = localStorage.getItem('theme');

// Если тема была сохранена как 'light', включаем её сразу
if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggleBtn.innerText = '🌙'; // Меняем иконку на луну
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
