const APIKey = "f2ec82988b671bb34b6eb5e3977fa9d6"
var citySearch = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#cityName");

var formSubmitHandler = function (event) {
    // prevents browser from refreshing when clicking the submit button
    event.preventDefault();

    // get value from input element
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        alert("Searching for " + cityName);
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

citySearch.addEventListener("submit", formSubmitHandler);