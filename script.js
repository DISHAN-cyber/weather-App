//API
const API_KEY = '4b056774d7a11cdafba435d2b3306d03';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const SRI_LANKA_CITIES = ["Colombo", "kandy", "Galla" , "Jaffna", "Negombo", "Kurunagala", "Anuradhapura", "Polonnaruwa","Matara","Rathnapura","Badulla","Matale","Nuwara Eliya","Trincomalee","Batticaloa","Kaluthara","Mannar","Kilinochchi","Mullaithivu","Vauniya","Hambantota","Ampara","Monaragala","Puttalam","kegalle","GAmpaha"];

const body = document.body;
const loader = document.getElementById('loader');
const themeIndicator = document.getElementById('theme-indicator');
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');
const cloud = document.querySelector('.cloud');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const citySearch = document.getElementById('city-search');
const searchBtn = document.getElementById('search-btn');
const selectedCity = document.getElementById('selected-city');
const cityList = document.getElementById('city-list');
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const weatherIcon = document.getElementById('weather-icon');
const tempValue = document.getElementById('temp-value');
const weatherCondition = document.getElementById('weather-condition');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const  windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');

document.addEventListener('DOMContentLoaded',function () {
    createStars();
    populateCityList();
    const savedCity = localStorage.getItem('lastSelectedCity') || 'Colombo';
    updateSelectedCity(savedCity);
    fetchWeatherData(savedCity);
    setupEventListeners();
    updateCurrentDate();
});

function createStars(){
    const starsContainer = document.body;
     for (let i = 0; i < 50; i++) {
         const star = document.createElement('div');
         star. classList.add('star');
         star.style.left = `${Math.random() * 200}%`;
         star.style.top = `${Math.random() * 200}%`;
         star.style.animationDelay = `${Math.random() * 5}s`;
         starsContainer.appendChild(star);
        
     }
}

function populateCityList() {
    cityList.innerHTML = '';
    SRI_LANKA_CITIES.forEach(city =>{
        const cityItem = document.createElement('div');
        cityItem.classList.add('city-item');
        cityItem.textContent = city;
        cityItem.addEventListener('click' , () => {
            updateSelectedCity(city);
            fetchWeatherData(city);
            cityList.classList.remove('show');
        });
        cityList.appendChild(cityItem);
    });
}

function updateSelectedCity(city){
    selectedCity.querySelector('span').textContent = city;
    cityName.textContent = city; 
    localStorage.setItem('lastSelectedCity', city);
}

function setupEventListeners(){
    selectedCity.addEventListener('click', () => {
        cityList.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
    if(!selectedCity.contains(e.target) && !cityList.contains(e.target)){
        cityList.classList.remove('show');
    }
    });

    searchBtn.addEventListener('click', handleSearch);
    citySearch.addEventListener('keyup', (e) =>{
        if (e.key === 'Enter')  handleSearch();
    });

    citySearch.addEventListener('input', filterCityList);

}

function handleSearch(){
    const searchTerm = citySearch.ariaValueMax.trim();
    if(searchTerm){
        const foundCity = SRI_LANKA_CITIES.find(city =>
            city.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (foundCity) {
            updateSelectedCity(foundCity);
            fetchWeatherData(foundCity);
            citySearch.value = '';
        } else {
            showError(`city "${searchTerm}" Not FOund! Please selected from the list.`);
        }
    }
}


function filterCityList() {
    
}
