const cityInputEl = document.querySelector("#city-input");
const cityInputButtonEl = document.querySelector("#city-input-button");
const currentWeatherDiv = document.querySelector("#current-weather");

function displayWeather(cityName, currentWeather, wholeData) {
    while(currentWeatherDiv.firstChild){
        currentWeatherDiv.firstChild.remove();
    };

    let h2DivEl = document.createElement('div');
    h2DivEl.classList.add("w-full")
    h2DivEl.classList.add("basis-full")
    const cityH2El = document.createElement("h2")
    cityH2El.textContent = cityName;
    cityH2El.classList.add("text-lg")
    cityH2El.classList.add("text-center")
    h2DivEl.appendChild(cityH2El);

    let descDivEl = document.createElement('div');
    descDivEl.classList.add("flex");
    descDivEl.classList.add("w-full");
    descDivEl.classList.add("justify-around");

    let leftDivEl = document.createElement('div');
    leftDivEl.classList.add("flex");
    leftDivEl.classList.add("flex-col");

    let rightDivEl = document.createElement('div');

    // make control structure for wholeData instead of currentWeather
    var pTempEl = document.createElement("p");
    for(const property in wholeData){
        console.log(property)
        if(property === "current"){
            const kelvin = wholeData[property]["temp"];
            let fahrenheit = Math.trunc((kelvin - 273.15) * 9/5 + 32)
                pTempEl.textContent = "Temperature: "+ fahrenheit;
        }
    }
    for(const property in currentWeather){
        switch (property){
            case "description":
                var pDescEl = document.createElement("p");
                pDescEl.textContent = `${currentWeather[property]}`;
                leftDivEl.appendChild(pDescEl);
                leftDivEl.appendChild(pTempEl);
                break;
            case "icon":
                var icon = "http://openweathermap.org/img/wn/"+ currentWeather[property] +"@2x.png"
                var iconImEl = document.createElement('img');
                iconImEl.setAttribute("alt", "Image of current weather")
                iconImEl.setAttribute("src", icon)
                iconImEl.classList.add("w-64")
                iconImEl.classList.add("h-64")
                rightDivEl.appendChild(iconImEl);
        };
    };
    currentWeatherDiv.appendChild(h2DivEl);
    descDivEl.appendChild(leftDivEl);
    descDivEl.appendChild(rightDivEl);
    currentWeatherDiv.appendChild(descDivEl);
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