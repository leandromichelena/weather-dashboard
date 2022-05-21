const APIKey = "f2ec82988b671bb34b6eb5e3977fa9d6"
var citySearch = document.querySelector("#citySearchForm");
var cityInputEl = document.querySelector("#cityNameSearch");
var cityNameEl = document.querySelector("#cityNameDisplay");
var currentWeatherParagraph = document.querySelector("#currentWeatherParagraph")

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

    // make a request to the url
    fetch(apiGeo).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
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
    if (cityName.length === 0) {
        alert("Could not find that city in our database. Please check your search for possible spelling errors.")
    }
    var lat = cityName[0].lat
    var lon = cityName[0].lon
    var country = cityName[0].country
    var state = cityName[0].state
    var name = cityName[0].name

    cityNameEl.innerHTML = name + ", " + state + ", " + country

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
    currentWeatherIcon = WeatherInfo.current.weather[0].icon
    iconSource0 = "http://openweathermap.org/img/wn/" + currentWeatherIcon + ".png"
    console.log(iconSource0)
    var infoSpan = '<img src=' + iconSource0 + '>';
    var temp = WeatherInfo.current.temp + " °C";
    var wind = WeatherInfo.current.wind_speed + " meter/sec";
    var humidity = WeatherInfo.current.humidity + "%";
    var UVIndex = WeatherInfo.current.uvi;

    cityNameEl.innerHTML = cityNameEl.innerHTML + infoSpan
    currentWeatherParagraph.innerHTML = temp + '<br>' + wind + '<br>' + humidity + '<br>' + UVIndex;
}

citySearch.addEventListener("submit", formSubmitHandler);