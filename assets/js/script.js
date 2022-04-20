const cityInputEl = document.querySelector("#city-input");
const cityInputButtonEl = document.querySelector("#city-input-button");
const currentWeatherDiv = document.querySelector("#current-weather");
const fiveDayForecastEl = document.querySelector('#five-day-forecast');
const topRowBoxEl = document.querySelector('#top-row-box');
const searchHistoryUlEl = document.querySelector('#search-history');

let citySearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

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
    if (index < 3) {
        //green
        pUviEl.classList.add('uvi-green');
        divEl.append(pTextEl, pUviEl);
        return divEl
    } else if (index >= 3 && index < 6){
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
/** <<** ----------- createWeatherInfoEl function ----------- **>>
*  Description: 
*  Creates weather descriptions/reports for either current weather or 5 day forecasts

*  @param {object} data - an object containing data for either current day weather
*                         or 5-day forecast
*  @param {string} purpose - used in the switch expression to execute the code that uses the data parameter sent
<<** ---------------------------------------------------------- **>> */
function createWeatherInfoEl(data, purpose){
    // loops through the data sent
    for(const property in data){
        // checks which code block to execute
        switch(purpose){
            // creates current weather report description elements
            case "current":
                // main container which holds all description elements
                let cElContainer = document.createElement('div');
                cElContainer.classList.add('fxcol');
                cElContainer.classList.add('default-text');

                // date element
                let date = dateConstructor(data['dt']);
                // p element that introduces cpDescEl
                let rightNowText = document.createElement('p');
                rightNowText.classList.add('underline');
                rightNowText.textContent = "Weather right now:";
                // description of current weather
                let cpDescEl = document.createElement('p');
                cpDescEl.textContent = data["weather"][0]["description"];
                // temperature right now
                let pTempEl = document.createElement('p');
                pTempEl.textContent = "Temperature: "+ kelvinToFahrenheit(data["temp"]) + "°";
                // the temperature it feels like now
                let pFeelTempEl = document.createElement("p");
                pFeelTempEl.textContent = "Feels like: "+ kelvinToFahrenheit(data["feels_like"]) + "°";
                // current humidity now
                let pHumidityEl = document.createElement("p");
                pHumidityEl.textContent = "Humidity: " + data["humidity"] + "%";
                // wind speed in miles per hour right now
                let pWindSpeedEl = document.createElement("p");
                pWindSpeedEl.textContent = "Wind speed: " + data["wind_speed"] + " MPH";
                // UV index number and safety color
                let pUviIndex = uviWarningCode(data['uvi']);

                // appends all description elements to cElContainer and returns it
                cElContainer.append(date, rightNowText, cpDescEl, pTempEl, pFeelTempEl, pHumidityEl, pWindSpeedEl, pUviIndex);
                return cElContainer
            break;
            // creates 5-day forecast weather report description elements
            case "eightDay":
                // main container which holds all description elements
                let edElContainer = document.createElement('div');
                edElContainer.classList.add('fxcol');
                edElContainer.classList.add('default-text');

                // temperature for the particular day's data that was sent
                let pDayTempEl = document.createElement("p");
                pDayTempEl.textContent = "Temp: " + kelvinToFahrenheit(data["temp"]['day']) + "°";
                // Humidity for the particular day's data that was sent
                let pDayHumidityEl = document.createElement("p");
                pDayHumidityEl.textContent = "Humidity: " + data["humidity"] + "%";
                // Wind speed for the particular day's data that was sent
                let pDayWindSpeedEl = document.createElement('p');
                pDayWindSpeedEl.textContent = "Wind: " + data["wind_speed"] + " MPH";

                // appends the three weather data elements to the main container and returns it
                edElContainer.append(pDayTempEl, pDayHumidityEl, pDayWindSpeedEl);
                return edElContainer
            break;
        }
    }
}

/** <<** ----------- createIconEl function ----------- **>>
*  Description: 
*  Create a weather symbol image from API's provided icon codes

*  @param {number} iconCode - code is concatenated to the image src url
*  @param {string} altDesc - the alt attribute content for the image tag
*  @param {string} widthClass - (optional) A tailwind width class, 
*                               purpose: responsiveness for the 5 day forecast icons.  
<<** ---------------------------------------------------------- **>> */
function createIconEl(iconCode, altDesc, widthClass){
    // src url for iconImEl
    var icon = "http://openweathermap.org/img/wn/"+ iconCode +"@2x.png"
    var iconImEl = document.createElement('img');
    iconImEl.setAttribute("alt", altDesc);
    iconImEl.setAttribute("src", icon);
    // optional responsive tailwind width class (currently only used for 5 day forecast)
    if(widthClass){
        iconImEl.classList.add(widthClass); // width at md breakpoint
        iconImEl.classList.add("w-4/5") // default width on smallest screens
    }
    return iconImEl;
};
// --------end utility functions---------- //

/** <<** ----------- displayWeather function ----------- **>>
*  Description: 
*  Dynamically appends weather data to the page

*  Process:
*  removes current weather and 5-day forecast data from the page ->
*  creates flexboxes, divs, and content elements and adds style classes to them ->
*  calls fillContent function which populates elements with weather data ->
*  the five day forecast elements are appended in fillContent ->
*  the current weather report elements are appended in the last line of displayWeather
<<** ---------------------------------------------------------- **>> */
function displayWeather(cityName, data) {
    // removes weather data children
    while(currentWeatherDiv.firstChild){
        currentWeatherDiv.firstChild.remove();
    };
    while(fiveDayForecastEl.firstChild){
        fiveDayForecastEl.firstChild.remove();
    };

    // uncenters search items and sets up weather layout
    topRowBoxEl.classList.add('top-row-box-dyn');

    // -------------- City Header Els -------------- //
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

    // holds all current day content: "CONTAINER"
    // - Weather data elements handled by createWeatherInfoEl()
    //   which returns a container appended in fillContent() to currentDayFlexBox
    let currentDayFlexBox = document.createElement('div');
    currentDayFlexBox.classList.add('fxcol');
    // --------------  END City Header Els -------------- //

    // --------------five day forecast section----------- //
    let fiveDayDivEl = document.createElement("div");
    fiveDayDivEl.classList.add("flex"); 
    let fiveDayH2El = document.createElement('h2');
    fiveDayH2El.textContent = "5-Day Forecast: ";
    fiveDayH2El.classList.add('five-day-header');
    fiveDayForecastEl.appendChild(fiveDayH2El);
    //----------- end of five day forecast section ---------- //

/** <<** ----------- fillContent function ----------- **>>
*  Description: 
*  Gets data and fills element content with it then appends those elements to containers. 
*  Multiple functions are used in order to make code cleaner and easier to modify
*  <<fillContent() params>>
*  @param {object} data - Weather data for the searched city
*  <<createIconEl() params>>
*  @param {number} data[property]['weather'][0]['icon'] - Icon code for weather API //This is concatenated in a url used for the img src
*  @param {string} "image of current weather - Alt description attribute
*  <<createWeatherInfoEl>>
*  @param {object} data[property] - Weather data for today's date
*  @param {string} 'current' - passed as the expression to be evaluated in a switch statement
*  <<dateConstructor() params>>
*  @param {number} object[subproperty] - Unix timestamp
*  Process: process commented throughout the code
<<** ---------------------------------------------------------- **>> */
    function fillContent(data) {
        // sets let i = 0 to keep count for control structure when creating 5 day weather forcast                    
        let i = 0
        //loops through entire city weather data
        for(const property in data){
            // switch statement executes code when the loop finds the case property
            switch(property){
                /*case: current - appends icon, and header to a container then appends to the current weather flexbox
                *                 current weather report is appended directly to the flexbox */
                case "current":
                    iconDivEl.appendChild(createIconEl(data[property]["weather"][0]["icon"],"Image of current weather"));
                    headerFlexDiv.appendChild(h2DivEl);
                    headerFlexDiv.appendChild(iconDivEl);
                    currentDayFlexBox.appendChild(headerFlexDiv);
                    currentDayFlexBox.appendChild(createWeatherInfoEl(data[property], 'current'))
                    break;
                /* loops through daily array creates a div container for each obj in array 
                *  then loops through each obj filling the div container with that days data*/
                case "daily":
                    data[property].forEach((object) => {
                        // iterates i to skip today's date in data 
                        i++
                        let dayContainer = document.createElement('div');
                        dayContainer.classList.add('fxcol')
                        dayContainer.classList.add('day-container')
                        // loops through a day's object in the daily array
                        for (const subproperty in object){
                            switch(subproperty){
                                case "dt":
                                    if(i <= 6 && i !== 1){
                                        dayContainer.appendChild(dateConstructor(object[subproperty]));
                                    }
                                    break;
                                case "weather":
                                    if(i <= 6 && i !== 1){
                                        dayContainer.appendChild(createIconEl(object[subproperty][0]["icon"], "Image of weather", 'sm:w-1/2'));
                                        dayContainer.appendChild(createWeatherInfoEl(object, 'eightDay'));
                                        /* appends only the 5 day containers which had their contents filled with data 
                                        *  to the 5 day forecast container */
                                        fiveDayForecastEl.appendChild(dayContainer);
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

    // ---------append current weather report content to page---------- //
    currentWeatherDiv.appendChild(currentDayFlexBox);
};

/** <<** ----------- displaySearchHistory function ----------- **>>
*  Description: 
*  Dynamically appends search history data to the page

*  Process:
*  loops through searchHistoryUlEl and rempoves all children ->
*  loops through citySearchHistory and creates li for each city name saved
*  to local storage, dynamically styles them, and appends them to searchHistoryUlEl
<<** ---------------------------------------------------------- **>> */
function displaySearchHistory() {
    while(searchHistoryUlEl.firstChild){
        searchHistoryUlEl.firstChild.remove();
    };
    for(i=0; i < citySearchHistory.length; i++){
        liEl = document.createElement('li');
        liEl.innerHTML = citySearchHistory[i];
        liEl.classList.add('search-history');
        searchHistoryUlEl.appendChild(liEl);
    };
};

/** <<** ----------- saveSearch function ----------- **>>
*  Description: 
*  Saves a sucessfully searched city to the search history in local storage
*  and displays the updated search history on the page via displaySearchHistory() 
*  - displaySearchHistory dynamically appends search history data to the page

*  Process:
*  loops through citySearchHistory array -> 
*  ?check if cityName equals the value at index 'i' ->
*  if true -> removes the value from index i "||" if false-> no code executed
*  -> cityName inserted to the front of the array
*  - (this is so the most recently searched city will be appended to the
*     the top of the search history column)
*  -> while loop ?checks if citySearchHistory.length > 5 -> if true ->
*     removes all positions greater than 5 from the array
*  -> citySearchHistory is saved to local storage -> displaySearchHistory is called
<<** ---------------------------------------------------------- **>> */
function saveSearch(cityName) {
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
};

/** <<** ----------- getCity function ----------- **>>
*  Description: 
*  Fetches a city's weather data and calls displayWeather function and 
*  saveSearch function. 
*  - displayWeather appends weather data to the page.
*  - saveSearch saves the searched city to local storage, and from there
*    appends the city name to search history.

*  Process:
*  lat (latitude) and lon (longitude) parameter values 
*  concatenated to api url -> fetch called on api url -> 
*  ?check if response.ok is truthy -> get json data from response -> 
*  pass the following parameters into displayWeather()
*  @param {string} cityName - Name of the city (argument of getCity)
*  @param {object} cityData - all weather data for the searched city
*  pass the following parameters into saveSearch()
*  @param {string} cityName - Name of the city (argument of getCity)
*  ?if falsy -> alert("Error, no weather data for coordinates")
<<** ---------------------------------------------------------- **>> */
function getCity(cityName, lat, lon){
    const weatherApiLink = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&appid=33e105b40a9be724f9c8bf226184c956";
    fetch(weatherApiLink).then(function(response){
        if(response.ok){
            response.json().then(function(cityData){
                displayWeather(cityName, cityData);
                saveSearch(cityName);
            })
        }else{
            alert("Error, no weather data for coordinates");
        }
    })
}

/** <<** ----------- getWeather function ----------- **>>
*  Description: 
*  Gets city name for api url then fetches data. Values from that data
*  are then sent as arguments/parameters to getCity function

*  Process:
*  city name edited and stored in a variable for api url -> 
*  concatenated into url -> fetch called on api url ->
*  ?check if response.ok is truthy -> get json data from response -> 
*  pass the following parameters into getCity()
*  @param {string} data[0].name - Name of the city
*  @param {number} data[0].lat - Latitude coordinates of the city searched
*  @param {number} data[0].lon - Longitude coordinates of the city searched
*  ?if falsy -> alert("please enter a valid city name")
<<** ---------------------------------------------------------- **>> */
function getWeather(event){
    console.log(event);
    event.preventDefault();
    //Gets city, caps 1st letter, and puts it in the url
    let cityCap = cityInputEl.value.toLowerCase();
    let city = cityCap.charAt(0).toUpperCase() + cityCap.slice(1);
    const cityCoordinatesApi = "https://api.openweathermap.org/geo/1.0/direct?q="+ city +"&limit=1&appid=33e105b40a9be724f9c8bf226184c956";

    fetch(cityCoordinatesApi)
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                getCity(data[0].name, data[0].lat, data[0].lon)
            })
        }else{
            alert("Please enter a valid city name")
        }
    })
}

function searchHistoryClick(event) {
    cityInputEl.value = event.target.innerHTML;
    getWeather(event);
    cityInputEl.value = null
}

/* <<** ----------- event listeners + function call ----------- **>>
* cityInputButtonEl event listener
*   - the getWeather function fetches weather data from submitted city name
* searchHistoryUlEl event listener
*   - listens for clicks on dynamically created li elements
* displaySearchHistory function call
*   - loads search history from local storage and appends data to the page
<<** ---------------------------------------------------------- **>>*/
cityInputButtonEl.addEventListener("click", getWeather);
searchHistoryUlEl.addEventListener('click', searchHistoryClick);
displaySearchHistory();