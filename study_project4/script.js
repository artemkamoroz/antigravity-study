const apiKey = ""; // Open-Meteo is free and needs no key!
const apiUrl = "https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    // 1. Сначала ищем координаты города (Geocoding API)
    // https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=1&language=ru&format=json
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ru&format=json`;

    try {
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        // Если город не найден (или пустой результат)
        if (!geoData.results) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            logMissingQuery(city); // Логируем "потеряшку"
            return;
        }

        // Прячем ошибку если всё ок
        document.querySelector(".error").style.display = "none";

        const { latitude, longitude, name } = geoData.results[0];

        // 2. Теперь запрашиваем погоду по координатам
        const response = await fetch(`${apiUrl}&latitude=${latitude}&longitude=${longitude}`);
        const data = await response.json();

        console.log(data); // Для отладки

        // Обновляем текст на странице
        document.querySelector(".city").innerHTML = name;
        document.querySelector(".temp").innerHTML = Math.round(data.current.temperature_2m) + "°c";
        document.querySelector(".humidity").innerHTML = data.current.relative_humidity_2m + "%";
        document.querySelector(".wind").innerHTML = data.current.wind_speed_10m + " km/h";

        // Меняем иконку в зависимости от кода погоды (WMO code)
        const code = data.current.weather_code;
        // Коды: 0-Sun, 1-3-Cloud, 51-67-Rain, 71-77-Snow, 95-99-Storm

        if (code === 0) {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // Clear Sun
        } else if (code >= 1 && code <= 3) {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1163/1163657.png"; // Clouds
        } else if (code >= 51 && code <= 67) {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1163/1163627.png"; // Rain
        } else if (code >= 71 && code <= 77) {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/642/642000.png"; // Snow
        } else if (code >= 95) {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1146/1146860.png"; // Storm
        } else {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1163/1163657.png"; // Default Cloud
        }

        // Показываем блок погоды и прячем ошибку
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

// Запуск поиска по клику
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Запуск поиска по Enter
searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

// --- Smart Autocomplete Logic (Debounce) --- 
let typingTimer;
const doneTypingInterval = 1500; // 1.5 sec delay

// Убираем список, если слово введено полностью правильно
searchBox.addEventListener("input", function () {
    const value = this.value;

    // 1. Сбрасываем таймер при каждом нажатии
    clearTimeout(typingTimer);

    // 2. Убираем подсказки пока пишем
    this.removeAttribute("list");

    // 3. Запускаем таймер
    if (value) {
        typingTimer = setTimeout(() => {
            const datalist = document.getElementById("city-suggestions");
            const options = Array.from(datalist.options).map(opt => opt.value);

            // Если введенное значение есть в списке -> не показываем список снова
            if (!options.includes(value)) {
                this.setAttribute("list", "city-suggestions");
            }
        }, doneTypingInterval);
    }
});

searchBox.addEventListener("click", function () {
    if (!this.value) {
        this.removeAttribute("list");
    }
});

// Функция логирования отсутствующих городов (имитация записи в файл)
function logMissingQuery(city) {
    console.log(`📝 Logged missing city: ${city}`);

    // Получаем текущий лог или создаем пустой массив
    let missingLog = JSON.parse(localStorage.getItem('missing_queries')) || [];

    // Добавляем новый запрос, если его еще нет
    if (!missingLog.includes(city)) {
        missingLog.push(city);
        localStorage.setItem('missing_queries', JSON.stringify(missingLog));
    }

    console.table(missingLog); // Показываем в консоли разработчика
}
