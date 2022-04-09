const cityInputEl = document.querySelector("#city-input");
const cityInputButtonEl = document.querySelector("#city-input-button");
const currentWeatherDiv = document.querySelector("#current-weather");

// ----------- utility functions----------- //
function kelvinToFahrenheit(kelvin){
    return Math.trunc((kelvin - 273.15) * 9/5 + 32);
};

function generateWeatherInfoEl(data, purpose){
    for(const property in data){
        switch(purpose){
            case "current":
                let cElContainer = document.createElement('div');
                cElContainer.classList.add('fxcol');
                cElContainer.classList.add('default-text');

                let cpDescEl = document.createElement('p');
                cpDescEl.textContent = data["weather"][0]["description"];
                let pTempEl = document.createElement('p');
                pTempEl.textContent = "Temperature: "+ kelvinToFahrenheit(data["temp"]) + "°";
                let pFeelTempEl = document.createElement("p");
                pFeelTempEl.textContent = "Feels like: "+ kelvinToFahrenheit(data["feels_like"]) + "°";
                let pHumidityEl = document.createElement("p");
                pHumidityEl.textContent = "Humidity: " + data["humidity"] + "%"
                let pWindSpeedEl = document.createElement("p");
                pWindSpeedEl.textContent = "Wind speed: " + data["wind_speed"] + "mph"

                cElContainer.append(cpDescEl, pTempEl, pFeelTempEl, pHumidityEl, pWindSpeedEl);
                //append CURRENT weather loop
                return cElContainer
            break;
            case "eightDay":
                let edElContainer = document.createElement('div');
                edElContainer.classList.add('fxcol');
                edElContainer.classList.add('default-text');

                let edpDescEl = document.createElement('p');
                edpDescEl.textContent = data["weather"][0]["description"];
                let pHighTempEl = document.createElement("p");
                pHighTempEl.textContent = "High: " + kelvinToFahrenheit(data["temp"]["max"]) + "°";
                let pLowTempEl = document.createElement("p");
                pLowTempEl.textContent = "Low: " + kelvinToFahrenheit(data["temp"]["min"]) + "°";

                edElContainer.append(edpDescEl, pHighTempEl, pLowTempEl);
                return edElContainer
            break;
        }
        console.log(data);
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
    dateP.classList.add('default-text')
    dateP.textContent = date;
    return dateP;
}
function createIconEl(iconCode, altDesc, widthClass){
    var icon = "http://openweathermap.org/img/wn/"+ iconCode +"@2x.png"
    var iconImEl = document.createElement('img');
    iconImEl.setAttribute("alt", altDesc);
    iconImEl.setAttribute("src", icon);
    if(widthClass){
        console.log(widthClass)
        iconImEl.classList.add(widthClass);
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
    currentDayFlexBox.classList.add('current-day-box');
    // ------------ current day div ---------//

    // --------------  END City Header+DESC Els -------------- //

    // --------------five day forecast section----------- //
    let eigthtDayFlexBox = document.createElement('div');
    eigthtDayFlexBox.classList.add('fxcol');
    eigthtDayFlexBox.classList.add('eight-day-box');

    let topEightDayDivEl = document.createElement("div");
    topEightDayDivEl.classList.add("flex"); 
    let bottomEightDayDivEl = document.createElement('div');
    bottomEightDayDivEl.classList.add('flex');
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
                                    if(i <= 4){
                                        dayContainer.appendChild(createIconEl(object[subproperty][0]["icon"], "Image of weather", 'w-1/2'));
                                        dayContainer.appendChild(generateWeatherInfoEl(object, 'eightDay'))
                                        topEightDayDivEl.appendChild(dayContainer);
                                    }else{
                                        dayContainer.appendChild(createIconEl(object[subproperty][0]["icon"], "Image of weather", 'w-1/2'));
                                        dayContainer.appendChild(generateWeatherInfoEl(object, 'eightDay'))
                                        bottomEightDayDivEl.appendChild(dayContainer)
                                    }
                                    
                                    break;
                                case "dt":
                                    // sends unix time stamp to date constructor
                                    if(i <= 4){
                                        dayContainer.appendChild(dateConstructor(object[subproperty]));
                                        topEightDayDivEl.appendChild(dayContainer);
                                    }else{
                                        dayContainer.appendChild(dateConstructor(object[subproperty]));
                                        bottomEightDayDivEl.appendChild(dayContainer)
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


    eigthtDayFlexBox.appendChild(topEightDayDivEl);
    eigthtDayFlexBox.appendChild(bottomEightDayDivEl);

    currentWeatherDiv.appendChild(currentDayFlexBox);
    currentWeatherDiv.appendChild(eigthtDayFlexBox);
};

// call back function
function getCity(initData, lat, lon){
    const weatherApiLink = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&appid=33e105b40a9be724f9c8bf226184c956";
    fetch(weatherApiLink).then(function(response){
        if(response.ok){
            response.json().then(function(cityData){
                console.log("--------initial fetched data-------")
                console.log(initData)
                console.log("-------city weather data-------")
                console.log(cityData);
                const cityName = initData[0].name;
                displayWeather(cityName, cityData);
            })
        }else{
            alert("Error, no weather data for coordinates")
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



// event listener that fires when a city name is searched
cityInputButtonEl.addEventListener("click", getWeather)

//Local storage add 5 most recent searches