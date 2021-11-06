let request;
if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
} else {
    request = new ActiveXObject("Microsoft.XMLHTTP");
}
let weatherObj;
let city = "Uzhgorod";
let weatherDiv = document.getElementById("weather");
request.open("GET", `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=b03a2cfad336d11bd9140ffd92074504`);
request.onload = function() {
    if (request.status === 200) {
        weatherObj = JSON.parse(request.response);
        console.log(weatherObj);
        let weatherDescription = weatherObj.weather[0].description;
        let feelsObj = weatherObj.clouds;


        let weatherElem = document.createElement('p');
        let feelsElem = document.createElement('p');

        weatherElem.textContent = weatherDescription;
        weatherDiv.appendChild(weatherElem);
    }
}
request.send();