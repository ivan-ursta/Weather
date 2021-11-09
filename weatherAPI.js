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
}

function openRequest(lat, lon) {
    let request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    let weatherObj;
    let weatherDiv = $(".weather");
    let infoDiv = $(".info");
    let iconDiv = $(".icon");
    let tempDiv = $(".temp");
    let dayTimeDiv = $(".dayTime");

    request.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&units=metric&APPID=a00b1af3da62c683cbdd2b93bb19dc93`);
    request.onload = function() {
        if (request.status === 200) {
            weatherObj = JSON.parse(request.response);
            console.log(weatherObj);

            let wDate = weatherObj.current.dt;
            let wIcon = weatherObj.current.weather[0].icon;
            let wDescription = weatherObj.current.weather[0].description;
            let wTemp = weatherObj.current.temp;
            let wFeels = weatherObj.current.feels_like;
            let wSunrise = weatherObj.current.sunrise;
            let wSunset = weatherObj.current.sunset;


            let weatherDate = new Date(1000 * wDate);
            let weatherDay = String(weatherDate.getDate());
            let weatherMonth = String(weatherDate.getMonth() + 1); //January is 0!
            let weatherYear = weatherDate.getFullYear();
            let dateElem = $("<h4></h4>").text(weatherDay + '.' + weatherMonth + '.' + weatherYear);

            let iconElem = $(`<img src = "https://openweathermap.org/img/wn/${wIcon}.png"></img>`);
            let descriptionElem = $("<p></p>").text(wDescription);
            let tempElem = $("<h1></h1>").html(wTemp + '&deg;' + 'C');
            let feelsElem = $("<p></p>").text("Real Feel " + wFeels);

            let sunriseDate = new Date(1000 * wSunrise);
            let sunriseHours = String(sunriseDate.getHours());
            let sunriseMinutes = String(sunriseDate.getMinutes());
            let sunriseElem = $("<p></p>").text("Sunrise: " + sunriseHours + ":" + sunriseMinutes);

            let sunsetDate = new Date(1000 * wSunset);
            let sunsetHours = String(sunsetDate.getHours());
            let sunsetMinutes = String(sunsetDate.getMinutes());
            let sunsetElem = $("<p></p>").text("Sunset: " + sunsetHours + ":" + sunsetMinutes);

            let wDurationHours = sunsetHours - sunriseHours;
            let wDurationMinutes = sunsetMinutes - sunriseMinutes;
            let durationElem = $("<p></p>").text("Duration: " + wDurationHours + ":" + wDurationMinutes);

            infoDiv.append(dateElem);
            iconDiv.append(iconElem);
            iconDiv.append(descriptionElem);
            tempDiv.append(tempElem);
            tempDiv.append(feelsElem);
            dayTimeDiv.append(sunriseElem);
            dayTimeDiv.append(sunsetElem);
            dayTimeDiv.append(durationElem);
        }
    }
    request.send();
}