document.getElementById('weather-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const city = document.getElementById('city-input').value;
    const apiKey = 'a6ed7a96e14a566304b10b3024ad5824'; // Replace with your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Fetch current weather
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error('City not found');
        }
        const weatherData = await weatherResponse.json();
        displayWeather(weatherData);

        // Fetch 5-day forecast
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error('Forecast not found');
        }
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        displayError(error.message);
    }
});

function displayWeather(data) {
    const weatherResult = document.getElementById('weather-result');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ''; // Clear previous error message

    weatherResult.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
    `;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    // Filter the forecast data to get the daily forecast
    const days = data.list.filter(item => item.dt_txt.includes('12:00:00')); // Get forecast for noon each day
    days.forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
            <p>Temp: ${Math.round(day.main.temp)}°C</p>
            <p>${day.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

function displayError(message) {
    const weatherResult = document.getElementById('weather-result');
    const errorMessage = document.getElementById('error-message');
    weatherResult.innerHTML = ''; // Clear previous weather result
    errorMessage.textContent = message;
}