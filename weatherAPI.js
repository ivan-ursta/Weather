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
    alert("Sorry, browser does not support geolocation! Enter city!");
}

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log("Latitude : " + latitude + " Longitude: " + longitude);

    openRequest(latitude, longitude);
    openRequest1(latitude, longitude);
}

$('#search').on('click', function() {

    let request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    let weatherObj;
    let latitude;
    let longitude;

    let cityName = $('#input').val();

    request.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=a00b1af3da62c683cbdd2b93bb19dc93`);

    request.onload = function() {
        if (request.status === 200) {
            weatherObj = JSON.parse(request.response);
            console.log(weatherObj);

            latitude = weatherObj.coord.lat;
            longitude = weatherObj.coord.lon;

            $(".currentInfo p").remove();
            $('.currentIcon').empty();
            $('.currentTemp').empty();
            $('.currentDayTime').empty();
            $('.hourlyValue').empty();
            $('.cityWeather').empty();
            openRequest(latitude, longitude);
            openRequest1(latitude, longitude)

        }
    }
    request.send();
});

function openRequest(lat, lon) {
    let request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    let weatherObj;

    request.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&cnt=2&exclude=minutely,daily,alerts&units=metric&APPID=a00b1af3da62c683cbdd2b93bb19dc93`);

    request.onload = function() {
        if (request.status === 200) {
            weatherObj = JSON.parse(request.response);
            console.log(weatherObj);

            let currentInfoDiv = $(".currentInfo");
            let currentIconDiv = $(".currentIcon");
            let currentTempDiv = $(".currentTemp");
            let currentDayTimeDiv = $(".currentDayTime");

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
            let currentDateElem = $("<p id='green'></p>").text(currentWeatherDay + '.' + currentWeatherMonth + '.' + currentWeatherYear);

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

                    hourlyValueDiv = $(`<div class='hourlyValueDiv${index} center'></div>`);
                    $(hourlyValue).append(hourlyValueDiv);

                    let dayDiv = $(`.hourlyValueDiv${index}`);

                    let dayWeather = weatherInfo.dt;
                    let hourlyDate = new Date(1000 * dayWeather);
                    let hourlyHours = hourlyDate.getHours() < 12 ? (hourlyDate.getHours() + "am") : ((hourlyDate.getHours() - 12) + "pm");
                    let hourlyTimeElem = $("<p class='hours'></p>").text(hourlyHours);
                    dayDiv.append(hourlyTimeElem);

                    let hourlyIcon = weatherInfo.weather[0].icon;
                    let hourlyIconElem = $(`<img src = "https://openweathermap.org/img/wn/${hourlyIcon}.png"></img>`);
                    dayDiv.append(hourlyIconElem);

                    let hourlyDescription = weatherInfo.weather[0].description;
                    let hourlyDescriptionElem = $("<p></p>").text(hourlyDescription);
                    dayDiv.append(hourlyDescriptionElem);

                    let hourlyTemp = weatherInfo.temp;
                    let hourlyTempElem = $("<p></p>").html(hourlyTemp + '&deg;');
                    dayDiv.append(hourlyTempElem);

                    let hourlyFeels = weatherInfo.feels_like;
                    let hourlyFeelsElem = $("<p></p>").html(hourlyFeels + '&deg;');
                    dayDiv.append(hourlyFeelsElem);

                    let windDeg = weatherInfo.wind_deg;
                    let hourlyWind = (weatherInfo.wind_speed * 3, 6) + " " + toCompass(windDeg);
                    let hourlyWindElem = $("<p></p>").html(hourlyWind);
                    dayDiv.append(hourlyWindElem);

                    index++;
                }
            });

        }
    }
    request.send();

    $('#day5_a').on('click', function() {
        $('#Today').css('display', 'none');
        $('#day-5').css('display', 'block');
        let request;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        let weatherObj1;

        request.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&APPID=a00b1af3da62c683cbdd2b93bb19dc93`);
        request.onload = function() {
            if (request.status === 200) {
                weatherObj1 = JSON.parse(request.response);
                console.log(weatherObj1);

                let dayValue = $(".dayValue");
                let dayValueDiv = "";
                let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                let dayWeatherSec = $('#dayWeather');

                $.each(weatherObj1.daily, function(index, weatherInfo) {
                    if (index <= 4) {
                        let dayWeather = weatherInfo.dt;
                        let dayDate = new Date(1000 * dayWeather);
                        let day = dayDate.getDay();
                        let month = dayDate.getMonth();
                        let date = dayDate.getDate();

                        dayValueDiv = $(`<div class='dayValueDiv${index} center'></div>`);
                        $(dayValue).append(dayValueDiv);

                        let dayDiv = $(`.dayValueDiv${index}`);

                        let dayElem = $("<h3 class='day' id='green'></h3>").text(days[day]);
                        let dateElem = $("<p class='day'></p>").text(months[month] + ' ' + date);
                        dayDiv.append(dayElem, dateElem);


                        let dayIcon = weatherInfo.weather[0].icon;
                        let dayIconElem = $(`<img src = "https://openweathermap.org/img/wn/${dayIcon}.png"></img>`);
                        dayDiv.append(dayIconElem);

                        let dayTemp = weatherInfo.temp.max;
                        let dayTempElem = $("<h2></h2>").html(dayTemp + '&deg;' + 'C');
                        dayDiv.append(dayTempElem);

                        let dayDescription = weatherInfo.weather[0].description;
                        let dayDescriptionElem = $("<p></p>").text(dayDescription);
                        dayDiv.append(dayDescriptionElem);

                        $('#hourly').clone().appendTo(dayWeatherSec);
                        index++;
                    }
                });



                $('.dayValueDiv0').addClass('active');

                $('.dayValue div').on('click', function() {
                    $(this).closest('.dayValue').find('.active').removeClass('active');
                    $(this).addClass('active');
                })

            }
        }
        request.send();

        let request1;
        if (window.XMLHttpRequest) {
            request1 = new XMLHttpRequest();
        } else {
            request1 = new ActiveXObject("Microsoft.XMLHTTP");
        }
        let weatherObj2;

        request1.open("GET", `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=a00b1af3da62c683cbdd2b93bb19dc93`);
        request1.onload = function() {
            if (request1.status === 200) {
                weatherObj2 = JSON.parse(request1.response);
                console.log(weatherObj2);


            }
        }
        request1.send();

    });


}


function openRequest1(lat, lon, req) {
    let request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    let weatherObj;

    request.open("GET", `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=4&units=metric&APPID=a00b1af3da62c683cbdd2b93bb19dc93`);

    request.onload = function() {
        if (request.status === 200) {
            weatherObj = JSON.parse(request.response);
            console.log(weatherObj);

            let cityWeather = $(".cityWeather");
            let cityWeatherDiv = "";
            $.each(weatherObj.list, function(index, cityInfo) {

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