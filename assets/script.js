const APIKey = "f2ec82988b671bb34b6eb5e3977fa9d6"
var citySearch = document.querySelector("#citySearchForm");
var cityInputEl = document.querySelector("#cityNameSearch");
var cityNameEl = document.querySelector("#cityNameDisplay");
var currentWeatherParagraph = document.querySelector("#currentWeatherParagraph")
var forecastCardsEl = document.querySelector("#forecastCards");

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

    cityNameEl.innerHTML = name + "<br>" + state + ", " + country
    
    if (state === undefined){ 
        cityNameEl.innerHTML = name + "<br>" + country
    }

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
    var currentWeatherIcon = WeatherInfo.current.weather[0].icon
    var iconSource0 = "http://openweathermap.org/img/wn/" + currentWeatherIcon + ".png"

    var currentDescription = WeatherInfo.current.weather[0].description.toUpperCase();
    var currentDate = dayjs.unix(WeatherInfo.current.dt)
    var infoSpan = ' - ' + currentDate.format('DD/MM/YYYY') + ' <img src=' + iconSource0 + '>';
    var temp = "Temp: " + WeatherInfo.current.temp + " °C";
    var wind = "Wind: " + WeatherInfo.current.wind_speed + " m/s";
    var humidity = "Humidity: " + WeatherInfo.current.humidity + "%";
    var UVIndex = "UV Index: " + '<span id="UV-index">' + WeatherInfo.current.uvi + '</span>';

    cityNameEl.innerHTML = cityNameEl.innerHTML + infoSpan
    currentWeatherParagraph.innerHTML = currentDescription + '<br>' + temp + '<br>' + wind + '<br>' + humidity + '<br>' + UVIndex;

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
    for (i = 1; i < 6; i++) {
        var dateDaily = '<strong>' + dayjs.unix(WeatherInfo.daily[i].dt).format('DD/MM/YYYY') + '</strong>';
        var iconSourceDaily = WeatherInfo.daily[i].weather[0].icon;
        var iconDaily = '<img src="http://openweathermap.org/img/wn/' + iconSourceDaily + '.png">'
        var tempDaily = "Temp: " + WeatherInfo.daily[i].temp.day + " °C";
        var windDaily = "Wind: " + WeatherInfo.daily[i].wind_speed + " m/s";
        var humidityDaily = "Humidity: " + WeatherInfo.daily[i].humidity + "%";

        var card = "<div class='border col-12 col-md-2 col-lg-2 pt-2 pb-2'>" + dateDaily + "<br>" + iconDaily + "<br>" + tempDaily + "<br>" + windDaily + "<br>" + humidityDaily + "</div>"
        forecastCardsEl.innerHTML += card;
    }
}

citySearch.addEventListener("submit", formSubmitHandler);