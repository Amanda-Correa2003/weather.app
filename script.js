// Pegando elementos do DOM
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const cityNameEl = document.getElementById('city-name');
const tempEl = document.getElementById('temperature');
const descEl = document.getElementById('description');
const iconEl = document.getElementById('weather-icon');

// Sua chave da API OpenWeather (já configurada)
const apiKey = '198d867ecc1fb4ac3761c6aeae3f4578';

// Função principal de buscar o clima
async function getWeather() {
  const city = cityInput.value;
  if (!city) return alert('Digite uma cidade!');

  // Requisição para a API
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Cidade não encontrada');
    const data = await res.json();

    // Atualizando a interface com os dados
    cityNameEl.textContent = data.name + ', ' + data.sys.country;
    tempEl.textContent = `${Math.round(data.main.temp)}°C`;
    descEl.textContent = data.weather[0].description;
    iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherInfo.style.display = 'flex'; // Mostra o cartão de clima
  } catch (err) {
    alert(err.message);
  }
}

// Evento de clique no botão
searchBtn.addEventListener('click', getWeather);

// Permitir apertar Enter para buscar
cityInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') getWeather();
});
