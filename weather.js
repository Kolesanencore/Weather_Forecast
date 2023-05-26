const API_KEY = `6e3e286b7ba6b78d37123d7ccd0b674f`;
const BASE_URL = `https://api.openweathermap.org/data/2.5/`;

// Функция получения погоды по координатам
function getWeatherByCoords(lat, lon) {
  const apiUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Получаем необходимые данные о погоде из ответа сервера
      const temperature = `${Math.floor(data.main.temp)}°`;

      const weatherDescr = data.weather[0].description;
      console.log(data.weather[0].description);
      const newDescription = weatherDescr
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const description = newDescription.split(" ").slice(1).join(" ");

      const city = data.name;
      const humidity = `${data.main.humidity}%`;
      const windSpeedInKmPerHour = (data.wind.speed * 3.6).toFixed(0);
      const wind = `${windSpeedInKmPerHour} km/h`;

      const imagesByWeather = {
        Clear: {
          day: "images/day_sun.png",
          night: "images/night_moon.png",
        },
        Rain: {
          day: "images/day_rain.png",
          night: "images/night_rain.png",
        },
        Snow: {
          day: "images/day_snow.png",
          night: "images/night_snow.png",
        },
        Clouds: {
          day: "images/day_clouds.png",
          night: "images/night_clouds.png",
        },
        Haze: {
          day: "images/day_haze.png",
          night: "images/night_haze.png",
        },
        default: {
          day: "images/day_404.png",
          night: "images/night_404.png",
        },
      };

      let iconUrl;

      const hours = new Date().getHours();
      const weather = data.weather[0].main;

      // выбираем изображение в зависимости от погоды и времени суток
      if (imagesByWeather[weather]) {
        iconUrl =
          hours >= 20 || hours < 6
            ? imagesByWeather[weather].night
            : imagesByWeather[weather].day;
      } else {
        iconUrl = imagesByWeather.default.day;
      }

      // Обновляем содержимое страницы с помощью полученных данных
      const weatherCardContainer = document.getElementById(
        "weather-card-container"
      );

      const currentDate = new Date();
      const weekday = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
      });
      const year = currentDate.getFullYear();
      const month = currentDate.toLocaleDateString("en-US", {
        month: "short",
      });
      const day = currentDate.toLocaleDateString("en-US", {
        day: "numeric",
      });

      weatherCardContainer.innerHTML = `
          <div class="weather__header ">
              <i class="weather__temperature">${temperature}</i>
       
              <div class="weather__description">
                  <span class="description">${description}</span>
                  <div class="weather__location">                             
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2A11.013 11.013 0 0 0 5 13a10.889 10.889 0 0 0 2.216 6.6s.3.395.349.452L16 30l8.439-9.953c.044-.053.345-.447.345-.447l.001-.003A10.885 10.885 0 0 0 27 13A11.013 11.013 0 0 0 16 2Zm0 15a4 4 0 1 1 4-4a4.005 4.005 0 0 1-4 4Z"/><circle cx="16" cy="13" r="4" fill="none"/></svg>
                      <p class="weather__city">${city}</p>
                  </div>  
              </div>  
          </div> 

            <img class="weather__img slide-in-blurred-top" src="${iconUrl}" alt="${description}">

            <p class="current-date">${weekday}</p>
            <p class="current-date">${day} ${month} ${year}</p>
            
          <div class="weather-details">
            <div class="humidity">
              <i class="fa-solid fa-water"></i>
              <div class="text">
                  <span>${humidity}</span>
                  <p>Humidity</p>
              </div>
            </div>                
            <div class="wind">
                <i class="fa-solid fa-wind"></i>
                <div class="text">
                    <span>${wind}</span>
                    <p>Wind Speed</p>
                </div>
            </div>    
          </div>`;
    })
    .catch((error) => console.log(error));
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        getWeatherByCoords(latitude, longitude);
      },
      () => {
        const defaultLat = 40.7067188;
        const defaultLon = -74.0671347;
        getWeatherByCoords(defaultLat, defaultLon);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

getLocation();
