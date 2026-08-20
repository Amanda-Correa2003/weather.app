const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const messageContainer = document.getElementById('message-container');
const messageText = document.getElementById('message-text');
const weatherContent = document.getElementById('weather-content');

const cityNameEl = document.getElementById('city-name');
const currentDateEl = document.getElementById('current-date');
const tempEl = document.getElementById('temperature');
const descEl = document.getElementById('description');
const iconEl = document.getElementById('weather-icon');
const tempMaxEl = document.getElementById('temp-max');
const tempMinEl = document.getElementById('temp-min');
const feelsLikeEl = document.getElementById('feels-like');

const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const pressureEl = document.getElementById('pressure');
const visibilityEl = document.getElementById('visibility');
const sunriseEl = document.getElementById('sunrise');
const sunsetEl = document.getElementById('sunset');
const forecastContainer = document.getElementById('forecast-container');

const apiKey = '198d867ecc1fb4ac3761c6aeae3f4578';

function showMessage(text) {
  messageText.textContent = text;
  messageContainer.classList.remove('hidden');
  weatherContent.classList.add('hidden');
}

function showWeather() {
  messageContainer.classList.add('hidden');
  weatherContent.classList.remove('hidden');
}

function formatTime(timestamp, timezoneOffset) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toUTCString().match(/(\d{2}:\d{2})/)[0];
}

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    showMessage('Por favor, digite o nome de uma cidade.');
    return;
  }

  showMessage('Buscando dados do clima...');

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    updateCurrentWeather(currentData);
    updateForecast(forecastData);
    showWeather();

  } catch (err) {
    showMessage(err.message);
  }
}

function updateCurrentWeather(data) {
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  
  const options = { weekday: 'long', day: 'numeric', month: 'short' };
  currentDateEl.textContent = new Date().toLocaleDateString('pt-BR', options);

  tempEl.textContent = `${Math.round(data.main.temp)}°`;
  descEl.textContent = data.weather[0].description;
  iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  iconEl.alt = data.weather[0].description;

  tempMaxEl.textContent = `${Math.round(data.main.temp_max)}°`;
  tempMinEl.textContent = `${Math.round(data.main.temp_min)}°`;
  feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°`;

  humidityEl.textContent = `${data.main.humidity}%`;
  windSpeedEl.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
  pressureEl.textContent = `${data.main.pressure} hPa`;
  visibilityEl.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

  const tz = data.timezone;
  sunriseEl.textContent = formatTime(data.sys.sunrise, tz);
  sunsetEl.textContent = formatTime(data.sys.sunset, tz);
}

function updateForecast(data) {
  forecastContainer.innerHTML = '';

  const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));

  dailyData.forEach(day => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });

    const card = document.createElement('div');
    card.classList.add('forecast-card');
    card.innerHTML = `
      <span class="day">${dayName.replace('.', '')}</span>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
      <div class="temps">
        <span class="max">${Math.round(day.main.temp_max)}°</span>
        <span class="min">${Math.round(day.main.temp_min)}°</span>
      </div>
    `;
    forecastContainer.appendChild(card);
  });
}

searchBtn.addEventListener('click', getWeather);

cityInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    getWeather();
  }
});

showMessage('Pesquise por uma cidade para ver a previsão.');