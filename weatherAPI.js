import toCompass from "./degToCompass.js";

let geoLoc = navigator.geolocation;
let watchID;

function errorHandler(err) {
    if (err.code == 1) {
        alert("Error: Access is denied!");
    } else if (err.code == 2) {
        alert("Error: Position is unavailable!");
    }
}

if (geoLoc) {
    // timeout at 60000 milliseconds (60 seconds)
    let options = { timeout: 60000 };
    watchID = geoLoc.getCurrentPosition(showPosition, errorHandler, options);
} else {
    alert("Sorry, browser does not support geolocation!");
}

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log("Latitude : " + latitude + " Longitude: " + longitude);
    openRequest(latitude, longitude);
    openRequest1(latitude, longitude);
}

function openRequest(lat, lon) {
    let request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    let weatherObj;
    let currentInfoDiv = $(".currentInfo");
    let currentIconDiv = $(".currentIcon");
    let currentTempDiv = $(".currentTemp");
    let currentDayTimeDiv = $(".currentDayTime");

    request.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&cnt=2&exclude=minutely,daily,alerts&units=metric&APPID=a00b1af3da62c683cbdd2b93bb19dc93`);

    request.onload = function() {
        if (request.status === 200) {
            weatherObj = JSON.parse(request.response);
            console.log(weatherObj);

            let currentDate = weatherObj.current.dt;
            let currentIcon = weatherObj.current.weather[0].icon;
            let currentDescription = weatherObj.current.weather[0].description;
            let currentTemp = weatherObj.current.temp;
            let currentFeels = weatherObj.current.feels_like;
            let currentSunrise = weatherObj.current.sunrise;
            let currentSunset = weatherObj.current.sunset;

            let currentWeatherDate = new Date(1000 * currentDate);
            let currentWeatherDay = String(currentWeatherDate.getDate());
            let currentWeatherMonth = String(currentWeatherDate.getMonth() + 1); //January is 0!
            let currentWeatherYear = currentWeatherDate.getFullYear();
            let currentDateElem = $("<h4></h4>").text(currentWeatherDay + '.' + currentWeatherMonth + '.' + currentWeatherYear);

            let currentIconElem = $(`<img src = "https://openweathermap.org/img/wn/${currentIcon}.png"></img>`);
            let currentDescriptionElem = $("<p></p>").text(currentDescription);
            let currentTempElem = $("<h1></h1>").html(currentTemp + '&deg;' + 'C');
            let currentFeelsElem = $("<p></p>").html("Real Feel " + currentFeels + '&deg;');

            let currentSunriseDate = new Date(1000 * currentSunrise);
            let currentSunriseHours = String(currentSunriseDate.getHours());
            let currentSunriseMinutes = String(currentSunriseDate.getMinutes());
            let currentSunriseElem = $("<p></p>").text("Sunrise: " + currentSunriseHours + ":" + currentSunriseMinutes);

            let currentSunsetDate = new Date(1000 * currentSunset);
            let currentSunsetHours = String(currentSunsetDate.getHours());
            let currentSunsetMinutes = String(currentSunsetDate.getMinutes());
            let currentSunsetElem = $("<p></p>").text("Sunset: " + currentSunsetHours + ":" + currentSunsetMinutes);

            let currentDurationHours = currentSunsetHours - currentSunriseHours;
            let currentDurationMinutes = currentSunsetMinutes - currentSunriseMinutes;
            let currentDurationElem = $("<p></p>").text("Duration: " + currentDurationHours + ":" + currentDurationMinutes);

            currentInfoDiv.append(currentDateElem);
            currentIconDiv.append(currentIconElem);
            currentIconDiv.append(currentDescriptionElem);
            currentTempDiv.append(currentTempElem);
            currentTempDiv.append(currentFeelsElem);
            currentDayTimeDiv.append(currentSunriseElem);
            currentDayTimeDiv.append(currentSunsetElem);
            currentDayTimeDiv.append(currentDurationElem);


            let hourlyValue = $(".hourlyValue");
            let hourlyValueDiv = "";
            $.each(weatherObj.hourly, function(index, weatherInfo) {
                if (index <= 6) {

                    hourlyValueDiv = $(`<div class='hourlyValueDiv${index}'></div>`);
                    $(hourlyValue).append(hourlyValueDiv);

                    let valueDiv = $(`.hourlyValueDiv${index}`);

                    let hourlyWeatherTime = weatherInfo.dt;
                    let hourlyDate = new Date(1000 * hourlyWeatherTime);
                    let hourlyHours = hourlyDate.getHours() < 12 ? (hourlyDate.getHours() + "am") : ((hourlyDate.getHours() - 12) + "pm");
                    let hourlyTimeElem = $("<p class='hours'></p>").text(hourlyHours);
                    valueDiv.append(hourlyTimeElem);

                    let hourlyIcon = weatherInfo.weather[0].icon;
                    let hourlyIconElem = $(`<img src = "https://openweathermap.org/img/wn/${hourlyIcon}.png"></img>`);
                    valueDiv.append(hourlyIconElem);

                    let hourlyDescription = weatherInfo.weather[0].description;
                    let hourlyDescriptionElem = $("<p></p>").text(hourlyDescription);
                    valueDiv.append(hourlyDescriptionElem);

                    let hourlyTemp = weatherInfo.temp;
                    let hourlyTempElem = $("<p></p>").html(hourlyTemp + '&deg;');
                    valueDiv.append(hourlyTempElem);

                    let hourlyFeels = weatherInfo.feels_like;
                    let hourlyFeelsElem = $("<p></p>").html(hourlyFeels + '&deg;');
                    valueDiv.append(hourlyFeelsElem);

                    let windDeg = weatherInfo.wind_deg;
                    let hourlyWind = (weatherInfo.wind_speed * 3, 6) + " " + toCompass(windDeg);
                    let hourlyWindElem = $("<p></p>").html(hourlyWind);
                    valueDiv.append(hourlyWindElem);

                    index++;

                }
            });

        }
    }
    request.send();
}


function openRequest1(lat, lon) {
    let request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    let weatherObj1;

    request.open("GET", `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=4&units=metric&APPID=a00b1af3da62c683cbdd2b93bb19dc93`);

    request.onload = function() {
        if (request.status === 200) {
            weatherObj1 = JSON.parse(request.response);
            console.log(weatherObj1);

            let cityWeather = $(".cityWeather");
            let cityWeatherDiv = "";
            $.each(weatherObj1.list, function(index, cityInfo) {

                cityWeatherDiv = $(`<div class='cityDiv${index} city'></div>`);
                $(cityWeather).append(cityWeatherDiv);
                let cityDiv = $(`.cityDiv${index}`);

                let cityName = cityInfo.name;
                let cityNameElem = $("<p></p>").text(cityName);
                cityDiv.append(cityNameElem);

                let cityIcon = cityInfo.weather[0].icon;
                let cityIconElem = $(`<img src = "https://openweathermap.org/img/wn/${cityIcon}.png"></img>`);
                cityDiv.append(cityIconElem);

                let cityTemp = cityInfo.main.temp;
                let cityTempElem = $("<p></p>").html(cityTemp + '&deg;' + 'C');
                cityDiv.append(cityTempElem);

                index++;


            });
        }
    }
    request.send();
}