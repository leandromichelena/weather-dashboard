const APIKey = "f2ec82988b671bb34b6eb5e3977fa9d6"
var citySearch = document.querySelector("#citySearchForm");
var cityInputEl = document.querySelector("#cityNameSearch");
var cityNameEl = document.querySelector("#cityNameDisplay");
var currentWeatherParagraph = document.querySelector("#currentWeatherParagraph")
var forecastCardsEl = document.querySelector("#forecastCards");
var previousSearchesEl = document.querySelector("#previousSearches");
// Creates an array to store locally the previous searches for quick access
var previousSearches = [];

var formSubmitHandler = function (event) {
    // prevents browser from refreshing when clicking the submit button
    event.preventDefault();

    // get value from input element
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        searchCity(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please type a city name to begin your search");
    }
};

var searchCity = function(cityName) {
    // format the github api url
    var apiGeo = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey

    // checks if cityName already exists in the array, if it doesn't, add it to the array of previous searches
    if (previousSearches.indexOf(cityName) === -1){
        previousSearches.push(cityName);
    };

    saveSearchItems();

    // make a request to the url
    fetch(apiGeo).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data);
                getWeatherInfo(data);
            });
        } else {
            alert("Error: Could not find " + cityName + "in search. Please check for typos and make sure that you are connected to the internet.");
        }
    })
        .catch(function (error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
        });
};

var getWeatherInfo = function(cityName) {
    // if the weather API returns zero results
    if (cityName.length === 0) {
        alert("Could not find that city in our database. Please check your search for possible spelling errors.")
    }
    var lat = cityName[0].lat
    var lon = cityName[0].lon
    var country = cityName[0].country
    var state = cityName[0].state
    var name = cityName[0].name

    cityNameEl.innerHTML = name + "<br>" + state + ", " + country
    
    // Removes the state info from the page if it's not available
    if (state === undefined){ 
        cityNameEl.innerHTML = name + "<br>" + country
    }

    // uses the lat and lon variables from the previous API call to query the weather data
    var apiWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + APIKey

    fetch(apiWeather).then(function(response){
        if (response.ok) {
            response.json().then(function (data) {
                displayWeatherInfo(data);
            })
        }
        else {
            alert("Something went wrong");
        }
    });
};

var displayWeatherInfo = function(WeatherInfo) {
    // gets an open weather icon id for the current weather status
    var currentWeatherIcon = WeatherInfo.current.weather[0].icon
    var iconSource0 = "http://openweathermap.org/img/wn/" + currentWeatherIcon + ".png"

    // reads the current weather description and converts to upper case for better presentation
    var currentDescription = WeatherInfo.current.weather[0].description.toUpperCase();

    // uses DayJS to convert the time provided by the API from milliseconds
    var currentDate = dayjs.unix(WeatherInfo.current.dt)
    var infoSpan = ' - ' + currentDate.format('DD/MM/YYYY') + ' <img src=' + iconSource0 + '>';
    var temp = "Temp: " + WeatherInfo.current.temp + " °C";
    var wind = "Wind: " + WeatherInfo.current.wind_speed + " m/s";
    var humidity = "Humidity: " + WeatherInfo.current.humidity + "%";
    var UVIndex = "UV Index: " + '<span id="UV-index">' + WeatherInfo.current.uvi + '</span>';

    cityNameEl.innerHTML = cityNameEl.innerHTML + infoSpan
    // builds the weather info paragraph from the variables defined above
    currentWeatherParagraph.innerHTML = currentDescription + '<br>' + temp + '<br>' + wind + '<br>' + humidity + '<br>' + UVIndex;

    // determines the range of the UV index and changes the background color accordingly 
    var uvSpan = document.querySelector("#UV-index");
    uvSpan.style.padding = "2px 8px";
    if (WeatherInfo.current.uvi <= 2) {
        uvSpan.style.backgroundColor = "green";
        uvSpan.style.color = "white";
    } else if (WeatherInfo.current.uvi > 2 && WeatherInfo.current.uvi <= 5) {
        uvSpan.style.backgroundColor = "yellow";
        uvSpan.style.color = "black";
    } else if (WeatherInfo.current.uvi > 5 && WeatherInfo.current.uvi <= 7){
        uvSpan.style.backgroundColor = "orange";
        uvSpan.style.color = "white";
    } else {
        uvSpan.style.backgroundColor = "red";
        uvSpan.style.color = "white";
    }

    forecastCardsEl.innerHTML = "<h3 class='pt-3'> Five days forecast:</h3>"
    // loops through the 5 days forecast data, starting from the second array object
    for (i = 1; i < 6; i++) {
        var dateDaily = '<strong>' + dayjs.unix(WeatherInfo.daily[i].dt).format('DD/MM/YYYY') + '</strong>';
        var iconSourceDaily = WeatherInfo.daily[i].weather[0].icon;
        var iconDaily = '<img src="http://openweathermap.org/img/wn/' + iconSourceDaily + '.png">'
        var tempDaily = "Temp: " + WeatherInfo.daily[i].temp.day + " °C";
        var windDaily = "Wind: " + WeatherInfo.daily[i].wind_speed + " m/s";
        var humidityDaily = "Humidity: " + WeatherInfo.daily[i].humidity + "%";

        // creates a card with the data variables defined above
        var card = "<div class='border col-12 col-md-2 col-lg-2 pt-2 pb-2'>" + dateDaily + "<br>" + iconDaily + "<br>" + tempDaily + "<br>" + windDaily + "<br>" + humidityDaily + "</div>"
        forecastCardsEl.innerHTML += card;
    }

    loadSearchItems();
};

var saveSearchItems = function () {
    localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
}

var loadSearchItems = function () {
    // get from local storage 
    var savedSearchItems = localStorage.getItem("previousSearches");

    if (!savedSearchItems) {
        return false;
    }

    console.log("Loaded previous searches successfully");
    // convert string back to array 
    savedSearchItems = JSON.parse(savedSearchItems);
    previousSearches = savedSearchItems;
    displayPrevious(previousSearches);
};

var displayPrevious = function (previousSearches){
    previousSearchesEl.innerHTML = "";
    for (i = 0; i < previousSearches.length; i++){
        var html = '<button type="button" class="btn btn-block btn-light btn-outline-primary">' + previousSearches[i] + '</button>'
        previousSearchesEl.innerHTML += html;
    };
};

var searchPrevious = function(event) {
    var previousCityName = event.target.textContent;
    console.log(previousCityName);
    searchCity(previousCityName);
};

citySearch.addEventListener("submit", formSubmitHandler);
loadSearchItems();
previousSearchesEl.addEventListener("click", searchPrevious);