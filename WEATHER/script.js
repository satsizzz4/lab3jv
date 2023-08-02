const apiKey = "cfd7294cbfeec355c9a125acc9468bc0";
const weatherInfo = document.getElementById("weatherInfo");
const searchInput = document.getElementById("searchInput");
const unitToggle = document.getElementById("unitToggle");

function getWeather() {
    const query = searchInput.value.trim();
    if (!query) {
        alert("Please enter a valid city name, zip code, or city, country code.");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found. Please enter a valid city name, zip code, or city, country code.");
            }
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(error => {
            alert(error.message);
        });
}

function displayWeather(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherDescription = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    const weatherHtml = `
        <h2>${cityName}</h2>
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity} %</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Weather: ${weatherDescription}</p>
        <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
    `;

    weatherInfo.innerHTML = weatherHtml;
}

function toggleUnit() {
    const unitLabel = document.querySelector('.unit-label');
    const isMetric = unitToggle.checked;

    if (isMetric) {
        unitLabel.textContent = 'Celsius';
    } else {
        unitLabel.textContent = 'Fahrenheit';
    }

    // Update the weather data with the selected unit
    getWeather();
}

// Check if geolocation is available and get user's current location weather by default
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const query = `lat=${latitude}&lon=${longitude}`;

            fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error fetching weather data.");
                    }
                    return response.json();
                })
                .then(data => displayWeather(data))
                .catch(error => {
                    console.error(error.message);
                });
        },
        error => {
            console.error(error);
            // If geolocation is denied or unavailable, allow the user to search manually.
        }
    );
}
