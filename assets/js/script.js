const cityInputEl = document.querySelector("#city-input");
const cityInputButtonEl = document.querySelector("#city-input-button");
const currentWeatherDiv = document.querySelector("#current-weather");
const cityH2El = document.querySelector("#city-header");

function displayWeather(cityName, currentWeather, wholeData) {
    if(currentWeatherDiv.firstChild){
        currentWeatherDiv.firstChild.remove();
    };
    
    // make control structure for wholeData instead of currentWeather
    for(const property in wholeData){
        if(property === current){
            const kelvin = property.temp
            let fahrenheit = (kelvin - 273.15) * 9/5 + 32
        }
    }
    
    
    
    
    //description: "clear sky"
    //icon: "01d"
    //id: 800
    //main: "Clear"
    cityH2El.textContent = cityName;
    for(const property in currentWeather){
        let divEl = document.createElement('div');
        let iconEl = document.createElement('i');
        switch (property){
            case "description":
                var pEl = document.createElement("p");
                pEl.textContent = `${currentWeather[property]}`;
                divEl.appendChild(pEl);
                break;
                // need icon case
                //convert kelvins to f to display degrees
                ///(xK − 273.15) × 9/5 + 32 = y°F
            case
        };
        currentWeatherDiv.appendChild(divEl);
    };
};

function getWeather(initData, lat, lon){
    const weatherApiLink = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&appid=33e105b40a9be724f9c8bf226184c956"
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