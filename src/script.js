let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

let locationButton = document.querySelector("#button-location");
locationButton.addEventListener("click", activateGeoLocation);

let searchCityButton = document.querySelector("#button-search");
searchCityButton.addEventListener("click", searchButtonSubmit);

searchCity("Singapore");

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
  const dayBackground = "#ffd89d";
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
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  searchInput.value = searchInput.value.toUpperCase();
  searchInput.value = searchInput.value.trim();
  console.log(searchInput.value);

  let h1 = document.querySelector("h1");
  h1.innerHTML = searchInput.value;
}

// Date
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
}

// Convert to fahrenheit
function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let temperatureElementFahrenheit = 66;
  temperatureElement.innerHTML = `${temperatureElementFahrenheit}°`;
}

// Convert to celcius
function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let temperatureElementCelsius = 33;
  temperatureElement.innerHTML = `${temperatureElementCelsius}°`;
}

//Button - geolocation
function activateGeoLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

function showWeather(response) {
  let feelsLike = Math.round(response.data.main.feels_like);
  let humidity = Math.round(response.data.main.humidity);
  let wind = Math.round(response.data.wind.speed);
  let pressure = Math.round(response.data.main.pressure);
  let tempMin = Math.round(response.data.main.temp_min);
  let tempMax = Math.round(response.data.main.temp_max);
  let description = response.data.weather[0].description;
  let temperature = Math.round(response.data.main.temp);
  let location = response.data.name.toUpperCase();

  //Unix time
  //Sunrise
  console.log(response.data.sys.sunrise);
  let sunriseUnix = response.data.sys.sunrise;

  let date = new Date(sunriseUnix * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = "0" + date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let sunriseFormatTime = hours + ":" + minutes.substr(-2);
  console.log(sunriseFormatTime);

  //Sunset
  let sunsetUnix = response.data.sys.sunset;
  //console.log(response.data.sys.sunset);
  let sunsetDate = new Date(sunsetUnix * 1000);
  let sunsetHours = sunsetDate.getHours();
  if (sunsetHours < 10) {
    sunsetHours = `0${sunsetHours}`;
  }

  let sunsetMinutes = "0" + sunsetDate.getMinutes();
  if (sunsetMinutes < 10) {
    sunsetMinutes = `0${sunsetMinutes}`;
  }

  let sunsetFormatTime = sunsetHours + ":" + sunsetMinutes.substr(-2);
  console.log(sunsetFormatTime);

  // innerHTML
  let sunsetElement = document.querySelector("#sunset-element");
  sunsetElement.innerHTML = `Sunset | ${sunsetFormatTime}`;

  let sunriseElement = document.querySelector("#sunrise-element");
  sunriseElement.innerHTML = `Sunrise | ${sunriseFormatTime}`;

  let currentTemperatureHeading = document.querySelector("#singapore");
  currentTemperatureHeading.innerHTML = `${location}`;

  let currentTemperature = document.querySelector("#temperature");
  currentTemperature.innerHTML = `${temperature}`;

  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = `${feelsLike}°`;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${humidity} %`;

  let windElement = document.querySelector("#wind-speed");
  windElement.innerHTML = `${wind} m/s`;

  let pressureElement = document.querySelector("#pressure");
  pressureElement.innerHTML = `${pressure} m`;

  let tempMinElement = document.querySelector("#temp-min");
  tempMinElement.innerHTML = `${tempMin}°`;

  let tempMaxElement = document.querySelector("#temp-max");
  tempMaxElement.innerHTML = `${tempMax}°`;

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = `${description}`;

  changeBackground(sunriseUnix, sunsetUnix);
}

// Geolocation api
function retrievePosition(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "metric";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  console.log(apiUrl);

  axios.get(apiUrl).then(showWeather);
}

// Search Weather api
function searchCurrentCity(response) {
  let location = response.data.name.toUpperCase();
  let temperature = Math.round(response.data.main.temp);
  let feelsLike = Math.round(response.data.main.feels_like);
  let humidity = Math.round(response.data.main.humidity);
  let tempMin = Math.round(response.data.main.temp_min);
  let tempMax = Math.round(response.data.main.temp_max);
  let pressure = response.data.main.pressure;
  let wind = Math.round(response.data.wind.speed);
  let description = response.data.weather[0].description;
  let timezone = response.data.timezone / 3600;
  let h2 = document.querySelector("h2");
  let currentLocalTime = getLocalTime(Date.now() / 1000, timezone);
  h2.innerHTML = `Local time | ${currentLocalTime}`;

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
  descriptionElement.innerHTML = `${description}`;

  let sunsetElement = document.querySelector("#sunset-element");
  sunsetElement.innerHTML = `Sunset | ${sunsetFormatTime}`;

  let sunriseElement = document.querySelector("#sunrise-element");
  sunriseElement.innerHTML = `Sunrise | ${sunriseFormatTime}`;

  let searchHeadingElement = document.querySelector("#singapore");
  searchHeadingElement.innerHTML = `${location}`;

  let searchTemperatureElement = document.querySelector("#temperature");
  searchTemperatureElement.innerHTML = `${temperature}`;

  let searchFeelsLikeElement = document.querySelector("#feels-like");
  searchFeelsLikeElement.innerHTML = `${feelsLike} °`;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${humidity} %`;

  let tempMinElement = document.querySelector("#temp-min");
  tempMinElement.innerHTML = `${tempMin}°`;

  let tempMaxElement = document.querySelector("#temp-max");
  tempMaxElement.innerHTML = `${tempMax}°`;

  let pressureElement = document.querySelector("#pressure");
  pressureElement.innerHTML = `${pressure} hPA`;

  let windElement = document.querySelector("#wind-speed");
  windElement.innerHTML = `${wind} m/s`;

  changeBackground(sunriseUnix, sunsetUnix);
}

function searchCity(city) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(searchCurrentCity);
}

function searchButtonSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
}
