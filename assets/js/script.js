const cityInputEl = document.querySelector("#city-input");
const cityInputButtonEl = document.querySelector("#city-input-button");
const currentWeatherDiv = document.querySelector("#current-weather");
const fiveDayForecastEl = document.querySelector('#five-day-forecast');
const topRowBoxEl = document.querySelector('#top-row-box');
const searchHistoryEl = document.querySelector('#search-history');

// ----------- utility functions----------- //
function kelvinToFahrenheit(kelvin){
    return Math.trunc((kelvin - 273.15) * 9/5 + 32);
};

function uviWarningCode(index){
    divEl = document.createElement('div');
    divEl.classList.add('flex');

    pTextEl = document.createElement('p');
    pTextEl.classList.add('pr-1');
    pTextEl.textContent = 'UV Index:';

    pUviEl = document.createElement('p');
    pUviEl.textContent = index;
    if (index <= 2) {
        //green
        pUviEl.classList.add('uvi-green');
        divEl.append(pTextEl, pUviEl);
        return divEl
    } else if (index > 2 && index < 6){
        pUviEl.classList.add('uvi-yellow');
        divEl.append(pTextEl, pUviEl);
        return divEl
    } else if (index >= 6 && index < 8){
        pUviEl.classList.add('uvi-orange');
        divEl.append(pTextEl, pUviEl);
        return divEl
    } else if (index >= 8 && index < 11){
        pUviEl.classList.add('uvi-red');
        divEl.append(pTextEl, pUviEl);
        return divEl
    } else if (index >= 11){
        pUviEl.classList.add('uvi-purple');
        divEl.append(pTextEl, pUviEl);
        return divEl
    }
}

function dateConstructor(unixTimestamp){
    const milliseconds = unixTimestamp * 1000; // 1575909015000
    const dateObject = new Date(milliseconds);

    const day = dateObject.toLocaleString("en-US", {weekday: "long"}); // Monday
    const month = dateObject.toLocaleString("en-US", {month: "long"}); // December
    const dayNum = dateObject.toLocaleString("en-US", {day: "numeric"}); // 9
    const year = dateObject.toLocaleString("en-US", {year: "numeric"}); // 2022

    const date = day + ", " + month + " " + dayNum + ", " + year;
    let dateP = document.createElement("p");
    dateP.classList.add('date-text')
    dateP.textContent = date;
    return dateP;
}

function generateWeatherInfoEl(data, purpose){
    for(const property in data){
        switch(purpose){
            case "current":
                let cElContainer = document.createElement('div');
                cElContainer.classList.add('fxcol');
                cElContainer.classList.add('default-text');

                let date = dateConstructor(data['dt']);
                let rightNowText = document.createElement('p');
                rightNowText.classList.add('underline');
                rightNowText.textContent = "Weather right now:";
                let cpDescEl = document.createElement('p');
                cpDescEl.textContent = data["weather"][0]["description"];
                let pTempEl = document.createElement('p');
                pTempEl.textContent = "Temperature: "+ kelvinToFahrenheit(data["temp"]) + "°";
                let pFeelTempEl = document.createElement("p");
                pFeelTempEl.textContent = "Feels like: "+ kelvinToFahrenheit(data["feels_like"]) + "°";
                let pHumidityEl = document.createElement("p");
                pHumidityEl.textContent = "Humidity: " + data["humidity"] + "%";
                let pWindSpeedEl = document.createElement("p");
                pWindSpeedEl.textContent = "Wind speed: " + data["wind_speed"] + " MPH";
                let pUviIndex = uviWarningCode(data['uvi']);

                cElContainer.append(date, rightNowText, cpDescEl, pTempEl, pFeelTempEl, pHumidityEl, pWindSpeedEl, pUviIndex);
                //append CURRENT weather loop
                return cElContainer
            break;
            case "eightDay":
                let edElContainer = document.createElement('div');
                edElContainer.classList.add('fxcol');
                edElContainer.classList.add('default-text');

                let pDayTempEl = document.createElement("p");
                pDayTempEl.textContent = "Temp: " + kelvinToFahrenheit(data["temp"]['day']) + "°";
                let pDayHumidityEl = document.createElement("p");
                pDayHumidityEl.textContent = "Humidity: " + data["humidity"] + "%";
                let pDayWindSpeedEl = document.createElement('p');
                pDayWindSpeedEl.textContent = "Wind: " + data["wind_speed"] + " MPH";

                edElContainer.append(pDayTempEl, pDayHumidityEl, pDayWindSpeedEl);
                return edElContainer
            break;
        }
        console.log(data);
    }
}

function createIconEl(iconCode, altDesc, widthClass){
    var icon = "http://openweathermap.org/img/wn/"+ iconCode +"@2x.png"
    var iconImEl = document.createElement('img');
    iconImEl.setAttribute("alt", altDesc);
    iconImEl.setAttribute("src", icon);
    if(widthClass){
        iconImEl.classList.add(widthClass); // width at md breakpoint
        iconImEl.classList.add("w-4/5") // width on small screens
    }
    return iconImEl;
};
// --------end utility functions---------- //

// takes weather data and dynamically popualtes elements with it to then display on the page
function displayWeather(cityName, data) {
    /* if there are child elements in the foundation division then remove them
        this clears the page for the new search data*/
    while(currentWeatherDiv.firstChild){
        currentWeatherDiv.firstChild.remove();
    };
    while(fiveDayForecastEl.firstChild){
        fiveDayForecastEl.firstChild.remove();
    };

    // uncenters search items and sets up weather layout
    topRowBoxEl.classList.add('top-row-box-dyn');

    // -------------- City Header + DESC Els -------------- //
    // div element that will hold the h2 of the city name
    let h2DivEl = document.createElement('div');
    h2DivEl.classList.add('flex-items-center');
    // header for the name of the city searched
    const cityH2El = document.createElement("h2");
    cityH2El.textContent = cityName;
    cityH2El.classList.add("h2-styling");
    // header appeneded to its own div
    h2DivEl.appendChild(cityH2El);

    // a div to hold the current weather icon
    let iconDivEl = document.createElement('div');

    // flexbox to hold the header and icon beside each other
    let headerFlexDiv = document.createElement('div');
    headerFlexDiv.classList.add("city-header-box");
    
    // -------------- current day description div+p els -------------- //
    let descDivEl = document.createElement('div');
    descDivEl.classList.add("default-text");
    descDivEl.classList.add('fxcol');
    // ----------current day description p elements------- //
    // ------------ end of current day description div+p els--------------- //

    // ------------ current day div --------------//
    let currentDayFlexBox = document.createElement('div');
    currentDayFlexBox.classList.add('fxcol');
    // ------------ current day div ---------//

    // --------------  END City Header+DESC Els -------------- //

    // --------------five day forecast section----------- //
    let fiveDayDivEl = document.createElement("div");
    fiveDayDivEl.classList.add("flex"); 
    let fiveDayH2El = document.createElement('h2');
    fiveDayH2El.textContent = "5-Day Forecast: ";
    fiveDayH2El.classList.add('five-day-header');
    fiveDayForecastEl.appendChild(fiveDayH2El);
    //----------- end of five day forecast section ---------- //


    // ------------- enternal function -------------//
    function fillContent(data) {
        // construct loop                        
        let i = 0
        for(const property in data){
            switch(property){
                case "current":
                    iconDivEl.appendChild(createIconEl(data[property]["weather"][0]["icon"],"Image of current weather"));
                    headerFlexDiv.appendChild(h2DivEl);
                    headerFlexDiv.appendChild(iconDivEl);
                    currentDayFlexBox.appendChild(headerFlexDiv);
                    currentDayFlexBox.appendChild(generateWeatherInfoEl(data[property], 'current'))
                    break;

                case "daily":
                    data[property].forEach((object) => {
                        i++
                        let dayContainer = document.createElement('div');
                        dayContainer.classList.add('fxcol')
                        dayContainer.classList.add('day-container')
                        for (const subproperty in object){
                            switch(subproperty){
                                case "weather":
                                    //sends icon code to generate an img element with icon
                                    if(i <= 6 && i !== 1){
                                        dayContainer.appendChild(createIconEl(object[subproperty][0]["icon"], "Image of weather", 'sm:w-1/2'));
                                        dayContainer.appendChild(generateWeatherInfoEl(object, 'eightDay'));
                                        fiveDayForecastEl.appendChild(dayContainer);
                                    }
                                    break;
                                case "dt":
                                    // sends unix time stamp to date constructor
                                    if(i <= 6 && i !== 1){
                                        dayContainer.appendChild(dateConstructor(object[subproperty]));
                                    }
                                    break;
                            }   
                        }
                    });
                    break;
            }
        }
    }
    fillContent(data);
    //-------------- end of enternal function ----------- //
    // ---------append all content to page---------- //
    currentWeatherDiv.appendChild(currentDayFlexBox);
};

// search history

let citySearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

function displaySearchHistory() {
    while(searchHistoryEl.firstChild){
        searchHistoryEl.firstChild.remove();
    };
    for(i=0; i < citySearchHistory.length; i++){
        liEl = document.createElement('li');
        liEl.innerHTML = citySearchHistory[i];

        liEl.classList.add('search-history');
        searchHistoryEl.appendChild(liEl);
    };
};

function saveSearch(cityName) {
    console.log(citySearchHistory);
    for(i=0; i < citySearchHistory.length; i++){
        if(cityName === citySearchHistory[i]){
            citySearchHistory.splice(i, 1);
        };
    };
    citySearchHistory.unshift(cityName);
    while (citySearchHistory.length > 5){
        citySearchHistory.pop();
    };

    localStorage.setItem('searchHistory', JSON.stringify(citySearchHistory));

    displaySearchHistory();
    // only display 5 citys
    // if city re-searched then no duplicate saved in history
};

// call back function
function getCity(initData, lat, lon){
    const weatherApiLink = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&appid=33e105b40a9be724f9c8bf226184c956";
    fetch(weatherApiLink).then(function(response){
        if(response.ok){
            response.json().then(function(cityData){
                console.log("--------initial fetched data-------");
                console.log(initData);
                console.log("-------city weather data-------");
                console.log(cityData);
                const cityName = initData[0].name;
                displayWeather(cityName, cityData);
                saveSearch(cityName);
            })
        }else{
            alert("Error, no weather data for coordinates");
        }
    })
}

/* adds the city name searched into the api url and fetches the data
    if there is a resonse then it gets formated into json and json data is 
    sent to a function when then extracts that data and populates elements with it dynamically 
    onto the page*/
    //Higher order function
function getWeather(event){
    event.preventDefault();
    //Gets city, caps 1st letter, and puts it in the url
    let cityCap = cityInputEl.value.toLowerCase();
    let city = cityCap.charAt(0).toUpperCase() + cityCap.slice(1);
    const cityCoordinatesApi = "http://api.openweathermap.org/geo/1.0/direct?q="+ city +"&limit=1&appid=33e105b40a9be724f9c8bf226184c956";

    // fetches data from api url 
    fetch(cityCoordinatesApi)
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                getCity(data, data[0].lat, data[0].lon) //display city weather data
            })
        }else{
            alert("Not valid city")
        }
    })
}

function searchHistoryClick(event) {
    cityInputEl.value = event.target.innerHTML;
    getWeather(event);
    cityInputEl.value = null
}

// event listener that fires when a city name is searched
cityInputButtonEl.addEventListener("click", getWeather);
searchHistoryEl.addEventListener('click', searchHistoryClick);
displaySearchHistory();