let globBooleanCelcius = true;
let globTemperature = 0;
let globFeelsLike = 0;
let globTempMin = 0;
let globTempMax = 0;
let globArrayTempMax = [];
let globArrayTempMin = [];

document.querySelector("#search-form").addEventListener("submit", eventListenerSearch);
document.querySelector("#fahrenheit-link").addEventListener("click", eventListenerConvertToFahrenheit);
document.querySelector("#celsius-link").addEventListener("click", eventListenerConvertToCelsius);
document.querySelector("#button-location").addEventListener("click", eventListenerActivateGeoLocation);
document.querySelector("#button-search").addEventListener("click", eventListenerSearchButtonSubmit);

searchCity("Singapore");
updateCelsiusAndFahrenheitColor();

//Functions

// Local time
function getLocalTime(unixTimestamp, timeZone) {
  let date = new Date(unixTimestamp * 1000);
  let hours = (date.getUTCHours() + timeZone + 24) % 24;
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

// Change background colour
function changeBackground(sunrise, sunset) {
  const dayBackground = "#FFD89D";
  const nightBackground = "#C0CEFF";
  const backgroundElement = document.querySelector("#background-element");
  const currentTime = Date.now() / 1000;
  if (currentTime > sunrise && currentTime < sunset) {
    backgroundElement.style.background = dayBackground;
  } else {
    backgroundElement.style.background = nightBackground;
  }
  return;
}

// Search city
function eventListenerSearch(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  searchInput.value = searchInput.value.toUpperCase();
  searchInput.value = searchInput.value.trim();
  console.log(searchInput.value);

  let h1 = document.querySelector("h1");
  h1.innerHTML = searchInput.value;
}

/* // Formate Date (Old)
function formateDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];
  return `Last updated on ${day} | ${hours}:${minutes}`;
} */

function updateCelsiusAndFahrenheitColor() {
  if (globBooleanCelcius === true) {
    document.querySelector("#celsius-link").style.color = "black";
    document.querySelector("#fahrenheit-link").style.color = "grey";
  } else {
    document.querySelector("#celsius-link").style.color = "grey";
    document.querySelector("#fahrenheit-link").style.color = "black";
  }
  return;
}

// Convert to fahrenheit
function eventListenerConvertToFahrenheit(event) {
  event.preventDefault();
  globBooleanCelcius = false;
  updateCelsiusAndFahrenheitColor();
  displayTemperature();
}

// Convert to celcius
function eventListenerConvertToCelsius(event) {
  event.preventDefault();
  globBooleanCelcius = true;
  updateCelsiusAndFahrenheitColor();
  displayTemperature();
}

//Button - geolocation
function eventListenerActivateGeoLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

// function showWeather(response) {
//   let feelsLike = Math.round(response.data.main.feels_like);
//   let humidity = Math.round(response.data.main.humidity);
//   let wind = Math.round(response.data.wind.speed);
//   let pressure = Math.round(response.data.main.pressure);
//   let tempMin = Math.round(response.data.main.temp_max);
//   let tempMax = Math.round(response.data.main.temp_min);
//   let description = response.data.weather[0].description;
//   let temperature = Math.round(response.data.main.temp);
//   let location = response.data.name.toUpperCase();

//   //Unix time
//   //Sunrise
//   console.log(response.data.sys.sunrise);
//   let sunriseUnix = response.data.sys.sunrise;

//   let date = new Date(sunriseUnix * 1000);
//   let hours = date.getHours();
//   if (hours < 10) {
//     hours = `0${hours}`;
//   }

//   let minutes = "0" + date.getMinutes();
//   if (minutes < 10) {
//     minutes = `0${minutes}`;
//   }

//   let sunriseFormatTime = hours + ":" + minutes.substr(-2);
//   console.log(sunriseFormatTime);

//   //Sunset
//   let sunsetUnix = response.data.sys.sunset;
//   //console.log(response.data.sys.sunset);
//   let sunsetDate = new Date(sunsetUnix * 1000);
//   let sunsetHours = sunsetDate.getHours();
//   if (sunsetHours < 10) {
//     sunsetHours = `0${sunsetHours}`;
//   }

//   let sunsetMinutes = "0" + sunsetDate.getMinutes();
//   if (sunsetMinutes < 10) {
//     sunsetMinutes = `0${sunsetMinutes}`;
//   }

//   let sunsetFormatTime = sunsetHours + ":" + sunsetMinutes.substr(-2);
//   console.log(sunsetFormatTime);

//   // innerHTML
//   let sunsetElement = document.querySelector("#sunset-element");
//   sunsetElement.innerHTML = `Sunset | ${sunsetFormatTime}`;

//   let sunriseElement = document.querySelector("#sunrise-element");
//   sunriseElement.innerHTML = `Sunrise | ${sunriseFormatTime}`;

//   let currentTemperatureHeading = document.querySelector("#singapore");
//   currentTemperatureHeading.innerHTML = `${location}`;

//   let currentTemperature = document.querySelector("#temperature");
//   currentTemperature.innerHTML = `${temperature}`;

//   let feelsLikeElement = document.querySelector("#feels-like");
//   feelsLikeElement.innerHTML = `${feelsLike}°`;

//   let humidityElement = document.querySelector("#humidity");
//   humidityElement.innerHTML = `${humidity} %`;

//   let windElement = document.querySelector("#wind-speed");
//   windElement.innerHTML = `${wind} m/s`;

//   let pressureElement = document.querySelector("#pressure");
//   pressureElement.innerHTML = `${pressure} m`;

//   let tempMinElement = document.querySelector("#temp-min");
//   tempMinElement.innerHTML = `${tempMin}°`;

//   let tempMaxElement = document.querySelector("#temp-max");
//   tempMaxElement.innerHTML = `${tempMax}°`;

//   let descriptionElement = document.querySelector("#description");
//   descriptionElement.innerHTML = `${description}`;

//   changeBackground(sunriseUnix, sunsetUnix);
// }

// Geolocation api

function retrievePosition(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "metric";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  console.log(apiUrl);

  axios.get(apiUrl).then(displayWeatherForecastFromApiResponse);
}

function convertCelsiusToFahrenheitFormular(temperatureInCelsius) {
  let temperatureInFahrenheit = Math.round((temperatureInCelsius * 9 / 5) + 32);
  return temperatureInFahrenheit;
}


function displayTemperature() {
  let maxTempElement = document.querySelector("#temp-max");
  let minTempElement = document.querySelector("#temp-min");
  let feelsLikeElement = document.querySelector("#feels-like");
  let searchTemperatureElement = document.querySelector("#temperature");

  if (globBooleanCelcius === true) {
    maxTempElement.innerHTML = `${globTempMax}°`;
    minTempElement.innerHTML = `${globTempMin}°`;
    feelsLikeElement.innerHTML = `${globFeelsLike}°`;
    searchTemperatureElement.innerHTML = `${globTemperature}`;

    globArrayTempMax.forEach((temperature, index)=>{
      document.querySelector(`#weather-forecast-temperature-max-${index}`).innerHTML = `${temperature}°` 
    });
    globArrayTempMin.forEach((temperature, index)=>{
      document.querySelector(`#weather-forecast-temperature-min-${index}`).innerHTML = `${temperature}°` 
    });

  } else {
    let maxTemp = convertCelsiusToFahrenheitFormular(globTempMax);
    let minTemp = convertCelsiusToFahrenheitFormular(globTempMin);
    let temp = convertCelsiusToFahrenheitFormular(globTemperature);
    let feelsLikeF = convertCelsiusToFahrenheitFormular(globFeelsLike);
    searchTemperatureElement.innerHTML = `${temp}`;
    feelsLikeElement.innerHTML = `${feelsLikeF}°`;
    minTempElement.innerHTML = `${minTemp}°`;
    maxTempElement.innerHTML = `${maxTemp}°`;

    globArrayTempMax.forEach((temperature, index)=>{
      document.querySelector(`#weather-forecast-temperature-max-${index}`).innerHTML = `${convertCelsiusToFahrenheitFormular(temperature)}°`;
    });
    globArrayTempMin.forEach((temperature, index)=>{
      document.querySelector(`#weather-forecast-temperature-min-${index}`).innerHTML = `${convertCelsiusToFahrenheitFormular(temperature)}°`;
    });
  }
}

function getDailyForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
  console.log(capitalizeFirstLetter("grace"));

// Search Weather api
function displayWeatherForecastFromApiResponse(response) {
  let location = response.data.name.toUpperCase();
  globTemperature = Math.round(response.data.main.temp);
  globFeelsLike = Math.round(response.data.main.feels_like);
  let humidity = Math.round(response.data.main.humidity);
  globTempMin = Math.round(response.data.main.temp_max);
  globTempMax = Math.round(response.data.main.temp_min);
  let pressure = response.data.main.pressure;
  let wind = Math.round(response.data.wind.speed);
  let description = response.data.weather[0].description;
  let timezone = response.data.timezone / 3600;
  let h2 = document.querySelector("h2");
  let currentLocalTime = getLocalTime(Date.now() / 1000, timezone);
  h2.innerHTML = `Local time | ${currentLocalTime}`;
  displayTemperature();

  //Unix time
  //Sunrise
  console.log(response.data.sys.sunrise);
  console.log(response);
  let sunriseUnix = response.data.sys.sunrise;
  let sunriseFormatTime = getLocalTime(sunriseUnix, timezone);
  //Sunset
  let sunsetUnix = response.data.sys.sunset;
  let sunsetFormatTime = getLocalTime(sunsetUnix, timezone);

  // innerHTML
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.svg`
  );

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = capitalizeFirstLetter(`${description}`);

  let sunsetElement = document.querySelector("#sunset-element");
  sunsetElement.innerHTML = `Sunset | ${sunsetFormatTime}`;

  let sunriseElement = document.querySelector("#sunrise-element");
  sunriseElement.innerHTML = `Sunrise | ${sunriseFormatTime}`;

  let searchHeadingElement = document.querySelector("#singapore");
  searchHeadingElement.innerHTML = `${location}`;

  /*let searchFeelsLikeElement = document.querySelector("#feels-like");
  searchFeelsLikeElement.innerHTML = `${globFeelsLike}°`;*/

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${humidity} %`;

  //let tempMinElement = document.querySelector("#temp-min");
  //tempMinElement.innerHTML = `${globTempMin}°`;

  //let tempMaxElement = document.querySelector("#temp-max");
  //tempMaxElement.innerHTML = `${globTempMax}°`;

  let pressureElement = document.querySelector("#pressure");
  pressureElement.innerHTML = `${pressure} hPA`;

  let windElement = document.querySelector("#wind-speed");
  windElement.innerHTML = `${wind} m/s`;

  changeBackground(sunriseUnix, sunsetUnix);
  getDailyForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeatherForecastFromApiResponse);
}

function eventListenerSearchButtonSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
}

function formatDailyForecastDay(timestamp) {
  let date = new Date(timestamp * 1000)
  let day = date.getDay();
  let daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return daysOfTheWeek[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row" id="day-name">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      globArrayTempMax[index] = Math.round(forecastDay.temp.max);
      globArrayTempMin[index] = Math.round(forecastDay.temp.min);
      forecastHTML =
        forecastHTML +
        `
    <div class="forecast col-2">
    <div class="weather-forecast-date">
    ${formatDailyForecastDay(forecastDay.dt)}
    </div>
    <div class="icons">
    <img src="images/${forecastDay.weather[0].icon}.svg" alt="" width="40"
    />
    </div>
    <div class="row weather-forecast-temperature">
    <div class="col">
    <span class="weather-forecast-temperature-max" id="weather-forecast-temperature-max-${index}"></span>
    <br />
    <img src="images/orange_polygon.svg" class="polygon-icon">
    </div>
    <div class="col">
    <span class="weather-forecast-temperature-min" id="weather-forecast-temperature-min-${index}"></span>
      <br />
      <img src="images/blue_polygon.svg" class="polygon-icon">
      </div>
    </div>
    </div>
    `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  displayTemperature();
}