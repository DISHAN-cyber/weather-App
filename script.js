  // API Configuration
        const API_KEY = 'YOUR_API_KEY_HERE'; 
        const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
        
        // Sri Lankan cities (27 major cities)
        const SRI_LANKA_CITIES = [
            "Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Kurunegala", 
            "Anuradhapura", "Polonnaruwa", "Matara", "Ratnapura", "Badulla", 
            "Matale", "Nuwara Eliya", "Trincomalee", "Batticaloa", "Kalutara",
            "Mannar", "Kilinochchi", "Mullaitivu", "Vavuniya", "Hambantota",
            "Ampara", "Moneragala", "Puttalam", "Kegalle", "Gampaha", "Kalu tar a"
        ];

        // DOM Elements
        const body = document.body;
        const loader = document.getElementById('loader');
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
        const windSpeed = document.getElementById('wind-speed');
        const pressure = document.getElementById('pressure');
        const themeIndicator = document.getElementById('theme-indicator');
        const sun = document.querySelector('.sun');
        const moon = document.querySelector('.moon');
        const cloud = document.querySelector('.cloud');

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Create stars for night mode
            createStars();
            
            // Populate city list
            populateCityList();
            
            // Load last selected city from localStorage or default to Colombo
            const savedCity = localStorage.getItem('lastSelectedCity') || 'Colombo';
            updateSelectedCity(savedCity);
            
            // Fetch weather for the selected city
            fetchWeatherData(savedCity);
            
            // Set up event listeners
            setupEventListeners();
            
            // Update date
            updateCurrentDate();
        });

        // Create stars for night background
        function createStars() {
            const starsContainer = document.body;
            for (let i = 0; i < 50; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.animationDelay = `${Math.random() * 5}s`;
                starsContainer.appendChild(star);
            }
        }

        // Populate the city dropdown list
        function populateCityList() {
            cityList.innerHTML = '';
            SRI_LANKA_CITIES.forEach(city => {
                const cityItem = document.createElement('div');
                cityItem.classList.add('city-item');
                cityItem.textContent = city;
                cityItem.addEventListener('click', () => {
                    updateSelectedCity(city);
                    fetchWeatherData(city);
                    cityList.classList.remove('show');
                });
                cityList.appendChild(cityItem);
            });
        }

        // Update the selected city display
        function updateSelectedCity(city) {
            selectedCity.querySelector('span').textContent = city;
            cityName.textContent = city;
            // Save to localStorage
            localStorage.setItem('lastSelectedCity', city);
        }

        // Set up event listeners
        function setupEventListeners() {
            // Toggle city dropdown
            selectedCity.addEventListener('click', () => {
                cityList.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!selectedCity.contains(e.target) && !cityList.contains(e.target)) {
                    cityList.classList.remove('show');
                }
            });

            // Search functionality
            searchBtn.addEventListener('click', handleSearch);
            citySearch.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') handleSearch();
            });

            // Filter city list when typing in search
            citySearch.addEventListener('input', filterCityList);
        }

        // Handle city search
        function handleSearch() {
            const searchTerm = citySearch.value.trim();
            if (searchTerm) {
                const foundCity = SRI_LANKA_CITIES.find(city => 
                    city.toLowerCase().includes(searchTerm.toLowerCase())
                );
                
                if (foundCity) {
                    updateSelectedCity(foundCity);
                    fetchWeatherData(foundCity);
                    citySearch.value = '';
                } else {
                    showError(`City "${searchTerm}" not found. Please select from the list.`);
                }
            }
        }

        // Filter city list based on search input
        function filterCityList() {
            const searchTerm = citySearch.value.toLowerCase();
            const cityItems = document.querySelectorAll('.city-item');
            
            cityItems.forEach(item => {
                const cityName = item.textContent.toLowerCase();
                if (cityName.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show dropdown if there's a search term
            if (searchTerm) {
                cityList.classList.add('show');
            }
        }

        // Fetch weather data from API
        async function fetchWeatherData(city) {
            showLoader();
            hideError();
            
            try {
                // For demo purposes, we'll use mock data since we don't have a real API key
                // In a real implementation, you would use:
                // const response = await fetch(`${BASE_URL}?q=${city},LK&appid=${API_KEY}&units=metric`);
                // const data = await response.json();
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Generate mock weather data
                const mockData = generateMockWeatherData(city);
                
                // Update UI with weather data
                updateWeatherUI(mockData);
                
                // Update theme based on time of day
                updateTheme(mockData.isDaytime);
                
            } catch (error) {
                console.error('Error fetching weather data:', error);
                showError('Failed to fetch weather data. Please check your connection and try again.');
            } finally {
                hideLoader();
            }
        }

        // Generate mock weather data for demonstration
        function generateMockWeatherData(city) {
            // Different weather conditions for variety
            const conditions = [
                { main: 'Clear', description: 'Sunny', icon: 'fa-sun' },
                { main: 'Clouds', description: 'Partly cloudy', icon: 'fa-cloud-sun' },
                { main: 'Rain', description: 'Light rain', icon: 'fa-cloud-rain' },
                { main: 'Thunderstorm', description: 'Thunderstorm', icon: 'fa-bolt' },
                { main: 'Drizzle', description: 'Drizzle', icon: 'fa-cloud-sun-rain' }
            ];
            
            // Get a consistent condition based on city name
            const cityIndex = SRI_LANKA_CITIES.indexOf(city);
            const conditionIndex = cityIndex % conditions.length;
            const condition = conditions[conditionIndex];
            
            // Generate temperature based on city (coastal vs hill country)
            let baseTemp = 28;
            if (['Nuwara Eliya', 'Badulla', 'Matale'].includes(city)) {
                baseTemp = 18; // Hill country is cooler
            } else if (['Jaffna', 'Trincomalee', 'Batticaloa'].includes(city)) {
                baseTemp = 32; // Northern/Eastern is warmer
            }
            
            // Add some random variation
            const tempVariation = Math.floor(Math.random() * 5) - 2;
            const temperature = baseTemp + tempVariation;
            
            // Determine if it's daytime (for demo, based on current hour)
            const currentHour = new Date().getHours();
            const isDaytime = currentHour >= 6 && currentHour < 18;
            
            return {
                name: city,
                main: {
                    temp: temperature,
                    feels_like: temperature + 2,
                    humidity: 60 + Math.floor(Math.random() * 30),
                    pressure: 1000 + Math.floor(Math.random() * 30)
                },
                weather: [{
                    main: condition.main,
                    description: condition.description
                }],
                wind: {
                    speed: 5 + Math.floor(Math.random() * 20)
                },
                isDaytime: isDaytime,
                iconCode: condition.icon
            };
        }

        // Update the UI with weather data
        function updateWeatherUI(data) {
            tempValue.textContent = Math.round(data.main.temp);
            feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
            humidity.textContent = `${data.main.humidity}%`;
            windSpeed.textContent = `${data.wind.speed} km/h`;
            pressure.textContent = `${data.main.pressure} hPa`;
            weatherCondition.textContent = data.weather[0].description;
            
            // Update weather icon
            updateWeatherIcon(data.iconCode);
        }

        // Update weather icon based on condition
        function updateWeatherIcon(iconCode) {
            const iconElement = weatherIcon.querySelector('i');
            iconElement.className = `fas ${iconCode}`;
            
            // Add animation
            iconElement.style.animation = 'pulse 2s infinite';
            setTimeout(() => {
                iconElement.style.animation = '';
            }, 2000);
        }

        // Update theme based on time of day
        function updateTheme(isDaytime) {
            if (isDaytime) {
                body.classList.remove('night-mode');
                themeIndicator.textContent = 'Day Mode';
                
                // Animate sun and cloud
                sun.style.transform = 'translateY(0)';
                sun.style.opacity = '1';
                cloud.style.opacity = '1';
            } else {
                body.classList.add('night-mode');
                themeIndicator.textContent = 'Night Mode';
                
                // Animate moon and hide sun
                sun.style.transform = 'translateY(100px)';
                sun.style.opacity = '0';
                moon.style.transform = 'translateY(0)';
                moon.style.opacity = '1';
                cloud.style.opacity = '0.5';
            }
        }

        // Update current date
        function updateCurrentDate() {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            currentDate.textContent = now.toLocaleDateString('en-US', options);
        }

        // Show loading spinner
        function showLoader() {
            loader.classList.add('active');
        }

        // Hide loading spinner
        function hideLoader() {
            loader.classList.remove('active');
        }

        // Show error message
        function showError(message) {
            errorText.textContent = message;
            errorMessage.classList.add('show');
            
            // Auto-hide error after 5 seconds
            setTimeout(hideError, 5000);
        }

        // Hide error message
        function hideError() {
            errorMessage.classList.remove('show');
        }