const apiKey = '772864e350fdb3ff4601e244ec562e2f';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const searchApiUrl = 'https://api.openweathermap.org/data/2.5/find';

const locationInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-btn');
const locationElement = document.querySelector('.location-info');
const temperatureElement = document.querySelector('.temperature');
const descriptionElement = document.querySelector('.weather');
const weatherIconElement = document.querySelector('.icon');
const daylist = document.querySelector('.weekend-info');
const details = document.querySelector('.more-details i');
const locationacc = document.querySelector('.location i');


searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeather(location);
    }
});
let a = 0;
details.addEventListener("click", ()=>{
    if (a === 0) {
        document.querySelector(".short").style.display= "block";
        a = 1;
    } else if( a === 1) {
        document.querySelector(".short").style.display= "none";
        a = 0;
    }
})
locationacc.addEventListener("click", ()=>{
    if (a === 0) {
        document.querySelector(".short").style.display= "block";
        a = 1;
    } else if( a === 1) {
        document.querySelector(".short").style.display= "none";
        a = 0;
    }
})

window.addEventListener('load', () => {
    // Fetch weather data for Sylhet
    fetchWeather('Sylhet');
    formatDate(new Date())
});


const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            locationElement.textContent = `${data.city.name}, ${data.city.country}`;
            temperatureElement.textContent = `${Math.round(data.list[0].main.temp)}°C`;
            descriptionElement.textContent = data.list[0].weather[0].description;
            const todayWeatherIconCode = data.list[0].weather[0].icon; // extract the iconcode from the api
            const todayPrecipitation = `${data.list[0].pop}%`;  // extract the precipitation from the api
            const todayHumidity = `${data.list[0].main.humidity}%`; // extract the humidity from the api
            const todayWindSpeed = `${data.list[0].wind.speed} km/h`;// extract the wind-speed from the api
            const todayFeeLike = `${Math.round(data.list[0].main.feels_like)}°C`;// extract the FEEL-LIKE from the api
            const icon = weatherIconMap[todayWeatherIconCode]; // filter the iconcode with the weathericoncode
            document.querySelector(".PRECIPITATION").textContent = todayPrecipitation; // Change the precipitation by location
            document.querySelector(".HUMIDITY").textContent = todayHumidity; // Change the humidity by location
            document.querySelector(".WIND-SPEED").textContent = todayWindSpeed; // Change the wind-speed  by location
            document.querySelector(".FEEL-LIKE").textContent = todayFeeLike; // Change the FEEL-LIKE  by location
            weatherIconElement.innerHTML = `<i class='bx bx-${icon}'></i>`; // tempareture icon show 
            const nextDaysData = data.list.slice(0,4);
            daylist.innerHTML = ''; // Clear the existing content
            for (let i = 0; i < 4; i++) {
                const weekendtemp = `${nextDaysData[i].main.temp}°C`;
                const weekendIconCode = nextDaysData[i].weather[0].icon;
                const weekendIcon = weatherIconMap[weekendIconCode];
                const time = nextDaysData[i].dt_txt;
                const hour24 = parseInt(nextDaysData[i].dt_txt.split(" ")[1].split(":")[0], 10);
                const hour12 = (hour24 >= 12) ? hour24 - 12 : hour24;
                const amPm = (hour24 >= 12) ? "PM" : "AM";
            daylist.innerHTML += `
                <div class="day-info">
                <i class='bx bx-${weekendIcon}'></i>
                <p>${hour12} ${amPm}</p>
                <p>${weekendtemp}°</p>
                </div>
            `;
            }
            
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}
function formatDate(dateTime) {
    const day = dateTime.toLocaleString('en-GB', { weekday: 'long' }); // Get the full day name
    const date = dateTime.getDate();
    const month = dateTime.toLocaleString('en-GB', { month: 'long' }); // Get the full month name
    const year = dateTime.getFullYear();
    document.querySelector(".date").textContent = `${date} ${month} ${year}`;
    document.querySelector(".day").textContent = `${day}`;
    return `${day}, ${date} ${month} ${year}`;
}

// // Auto-complete search bar logic
// locationInput.addEventListener('input', async () => {
//     const location = locationInput.value.trim();
//     console.log(location);
    
//     if (location) {
//     try {
//         const response = await fetch(`${searchApiUrl}?q=${location}&appid=${apiKey}`);
//         const data = await response.json();
//         const suggestions = data.list.map(item => item.name);
//         const suggestionList = document.querySelector('.suggestion-list');
//         suggestionList.innerHTML = '';
//     suggestions.forEach(suggestion => {
//         const suggestionItem = document.createElement('div');
//         suggestionItem.textContent = suggestion;
//         suggestionItem.addEventListener('click', () => {
//         locationInput.value = suggestion;
//         fetchWeather(suggestion);
//         });
//         suggestionList.appendChild(suggestionItem);
//     });
//     } catch (error) {
//     console.error('Error fetching auto-complete suggestions:', error);
//     }
// }
// });