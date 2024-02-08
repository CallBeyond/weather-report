// My Personal Weather Dashboard API key
const apiKey = '9008c8cc1911b8a9860da621a36b3303';

// Event listener for the city form submission
document.querySelector('#city-form').addEventListener('submit', function(event) {

    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the city name from the input field
    const city = document.querySelector('#city-input').value.trim();

    // Call the function to fetch weather data for the city
    getWeather(city);

    // Clear the input field
    document.querySelector('#city-input').value = '';

});

// Function to fetch weather data for a given city
function getWeather(city) {

    // Fetch current weather data for the city from the OpenWeatherMap API
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => {

            // Check if the response is OK
            if (!response.ok) {

            // Throw an error if the city is not found
            throw new Error('City not found');

            }

            // Parse the response JSON data
            return response.json();

        })
        .then(data => {

            // Display the current weather data for the city
            displayCurrentWeather(data);

            // Save the city to local storage
            saveCity(city);

            // Fetch forecast data for the city from the OpenWeatherMap API
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
        })

        .then(response => response.json())

        .then(data => {

            // Display the forecast data for the city
            displayForecast(data);
        })

        .catch(error => {

            // Log any errors to the console
            console.error(error);

        });
}

// Function to display the current weather data for a city
function displayCurrentWeather(data) {
    
    // Get the current weather container element
    const currentWeather = document.querySelector('#current-weather');

    // Round up the temperature to the nearest integer
    const temperature = Math.ceil(data.main.temp); 

    // Get the weather icon code and construct the URL for the weather icon
    const iconCode = data.weather[0].icon; 
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`; 

    // Update the HTML content of the current weather container with the weather data
    currentWeather.innerHTML = `
        <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
        <img src="${iconUrl}">
        <p>Temperature: ${temperature} °F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} mph</p>`;

}

// Function to display the forecast data for a city
function displayForecast(data) {

    // Get the forecast container element
    const forecast = document.querySelector('#forecast');

    // Clear previous forecast data
    forecast.innerHTML = ''; 

    for (let i = 0; i < data.list.length; i++) {

        const forecastData = data.list[i];
         
    // Create a new Date object representing the forecast date and time by parsing it as a date string
        const date = new Date(forecastData.dt_txt); 


    // Check if the forecast is for noon and display the forecast data for that day
    if (date.getHours() === 12) {

        // Round up the temperature to the nearest integer
        const temperature = Math.ceil(forecastData.main.temp); 

        // Get the weather icon code and construct the URL for the weather icon
        const iconCode = forecastData.weather[0].icon; 
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        // Append the forecast data to the forecast container
            forecast.innerHTML += `
                <div class="forecast-item">
                    <p>${date.toDateString()}</p>
                    <img src="${iconUrl}">
                    <p>Temperature: ${temperature} °F</p>
                    <p>Humidity: ${forecastData.main.humidity}%</p>
                    <p>Wind Speed: ${forecastData.wind.speed} mph</p>
                </div>`;
        }
    }
}

// Function to save the city to local storage
function saveCity(city) {

    // Get the saved cities from local storage or an empty array if there are no saved cities
    let cities = JSON.parse(localStorage.getItem('cities')) || []; 

    // Check if the city is already in the array
    if (!cities.includes(city)) {

        // Add the city to the array if it's not already in it
        cities.push(city); 
    }

    // Save the updated array of cities to local storage
    localStorage.setItem('cities', JSON.stringify(cities)); 
}

// Function to load the saved cities from local storage and display them in the search history
function loadCities() {

    // Get the saved cities from local storage or an empty array if there are no saved cities
    const cities = JSON.parse(localStorage.getItem('cities')) || []; 

    // Get the search history container element
    const history = document.querySelector('#search-history'); 

    // Set the heading for the search history
    history.innerHTML = '<h3>List of Recently Searched Cities:</h3>'; 

    // Iterate through the saved cities
    cities.forEach(city => {

        // Create a paragraph element for each city and add a click event listener to fetch weather data for the city 
        history.innerHTML += `<p class="city" onclick="getWeather('${city}')">${city}</p>`;
    });
}


// Event listener to load saved cities when the DOM content is loaded
document.addEventListener('DOMContentLoaded', loadCities);
