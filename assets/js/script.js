const cityInputEl = document.querySelector("#city-input");
const cityInputButtonEl = document.querySelector("#city-input-button");
const currentWeatherDiv = document.querySelector("#current-weather");

function displayWeather(cityName, currentWeather, wholeData) {
    while(currentWeatherDiv.firstChild){
        currentWeatherDiv.firstChild.remove();
    };
    // city header
    let h2DivEl = document.createElement('div');

    const cityH2El = document.createElement("h2")
    cityH2El.textContent = cityName;
    cityH2El.classList.add("text-lg")
    cityH2El.classList.add("text-center")
    h2DivEl.appendChild(cityH2El);

    let rightDivEl = document.createElement('div');
    // end of city header
    
    // current day description
    let headerDivEl = document.createElement('div');
    headerDivEl.classList.add("flex");
    headerDivEl.classList.add("justify-center");

    let descDivEl = document.createElement('div');
    descDivEl.classList.add("flex");
    descDivEl.classList.add("flex-col");
    descDivEl.classList.add("text-base");
    // current day description

    // five day forecast section
    let fiveForecastDivEl = document.createElement("div");
    fiveForecastDivEl.classList.add("flex");
    fiveForecastDivEl.classList.add("flex-col");

    iconDateRowDivEl = document.createElement('div');
    iconDateRowDivEl.classList.add('flex');

    let iconRowDivEl = document.createElement("div");
    iconRowDivEl.classList.add("flex");
    let dateRowDivEl = document.createElement('div');
    dateRowDivEl.classList.add('flex');

    let infoRowDivEl = document.createElement("div");
    infoRowDivEl.classList.add("flex");


    // end of five day forecast section 

    // current day description p elements
    let pTempEl = document.createElement("p");
    let pFeelTempEl = document.createElement("p");
    let pHumidityEl = document.createElement("p");
    let pWindSpeedEl = document.createElement("p");

    // construct loop
    for(const property in wholeData){
        console.log(property);
        switch(property){
            case "current":
                const kelvin = wholeData[property]["temp"];
                let fahrenheit = Math.trunc((kelvin - 273.15) * 9/5 + 32)
                pTempEl.textContent = "Temperature: "+ fahrenheit + "°";

                const Fkelvin = wholeData[property]["feels_like"];
                let Ffahrenheit = Math.trunc((Fkelvin - 273.15) * 9/5 + 32)
                pFeelTempEl.textContent = "Feels like: "+ Ffahrenheit + "°";

                const percentHumidity = wholeData[property]["humidity"];
                pHumidityEl.textContent = "Humidity: " + percentHumidity + "%"

                const windSpeed = wholeData[property]["wind_speed"];
                pWindSpeedEl.textContent = "Wind speed: " + windSpeed + "mph"
                break;

            case "daily":
                console.log(wholeData[property])
                for (i=0; wholeData[property].length; i++){
                    // icon getter
                    const weatherData = wholeData[property];
                    var icon = "http://openweathermap.org/img/wn/"+ weatherData["icon"] +"@2x.png"
                    var iconImEl = document.createElement('img');
                    iconImEl.setAttribute("alt", "Image of weather");
                    iconImEl.setAttribute("src", icon);
                    iconRowDivEl.appendChild(iconImEl);
                    // date constructor
                    const unixTimestamp = wholeData[property]["dt"];

                    const milliseconds = unixTimestamp * 1000; // 1575909015000

                    const dateObject = new Date(milliseconds);

                    const day = dateObject.toLocaleString("en-US", {weekday: "long"}); // Monday
                    const month = dateObject.toLocaleString("en-US", {month: "long"}); // December
                    const dayNum = dateObject.toLocaleString("en-US", {day: "numeric"}); // 9
                    const year = dateObject.toLocaleString("en-US", {year: "numeric"}); // 2022

                    const date = day + ", " + month + " " + dayNum + ", " + year;
                    let dateP = document.createElement("p");
                    dateP.textContent = date;
                    dateRowDivEl.appendChild(dateP);
                    // end date constructor 
                }
        }
    }

    //append CURRENT weather loop
    for(const property in currentWeather){
        switch (property){
            case "description":
                var pDescEl = document.createElement("p");
                pDescEl.textContent = `${currentWeather[property]}`;
                descDivEl.appendChild(pDescEl);
                descDivEl.appendChild(pTempEl);
                descDivEl.appendChild(pFeelTempEl);
                descDivEl.appendChild(pHumidityEl);
                descDivEl.appendChild(pWindSpeedEl);
                break;
            case "icon":
                var icon = "http://openweathermap.org/img/wn/"+ currentWeather[property] +"@2x.png"
                var iconImEl = document.createElement('img');
                iconImEl.setAttribute("alt", "Image of current weather")
                iconImEl.setAttribute("src", icon)
                rightDivEl.appendChild(iconImEl);
        };
    };

    // append all content to page
    iconDateRowDivEl.appendChild(iconRowDivEl);
    iconDateRowDivEl.appendChild(dateRowDivEl);
    fiveForecastDivEl.appendChild(iconDateRowDivEl);
    fiveForecastDivEl.appendChild(infoRowDivEl);

    headerDivEl.appendChild(h2DivEl);
    headerDivEl.appendChild(rightDivEl);

    currentWeatherDiv.appendChild(headerDivEl);
    currentWeatherDiv.appendChild(descDivEl);
    currentWeatherDiv.appendChild(fiveForecastDivEl);
};

function getWeather(initData, lat, lon){
    const weatherApiLink = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&appid=33e105b40a9be724f9c8bf226184c956";
    fetch(weatherApiLink).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                const currentWeather = data.current.weather[0];
                const cityName = initData[0].name;
                displayWeather(cityName, currentWeather, data);
            })
        }else{
            alert("Error, no weather data for coordinates")
        }
    })
}

function getCity(event){
    event.preventDefault();
    let cityCap = cityInputEl.value.toLowerCase();
    let city = cityCap.charAt(0).toUpperCase() + cityCap.slice(1);
    const cityCoordinatesApi = "http://api.openweathermap.org/geo/1.0/direct?q="+ city +"&limit=1&appid=33e105b40a9be724f9c8bf226184c956";
    fetch(cityCoordinatesApi)
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                console.log(data)
                getWeather(data, data[0].lat, data[0].lon) //display city weather data
            })
        }else{
            alert("Not valid city")
        }
    })
}

cityInputButtonEl.addEventListener("click", getCity)

//Local storage add 5 most recent searches