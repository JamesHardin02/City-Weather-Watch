const cityInputEl = document.querySelector("#city-input");
const cityInputButtonEl = document.querySelector("#city-input-button");
const currentWeatherDiv = document.querySelector("#current-weather");

// ----------- utility functions----------- //
function dateConstructor(unixTimestamp){
    const milliseconds = unixTimestamp * 1000; // 1575909015000
    const dateObject = new Date(milliseconds);

    const day = dateObject.toLocaleString("en-US", {weekday: "long"}); // Monday
    const month = dateObject.toLocaleString("en-US", {month: "long"}); // December
    const dayNum = dateObject.toLocaleString("en-US", {day: "numeric"}); // 9
    const year = dateObject.toLocaleString("en-US", {year: "numeric"}); // 2022

    const date = day + ", " + month + " " + dayNum + ", " + year;
    let dateP = document.createElement("p");
    dateP.textContent = date;
    return dateP;
}
function createIconEl(iconCode, altDesc){
    var icon = "http://openweathermap.org/img/wn/"+ iconCode +"@2x.png"
    var iconImEl = document.createElement('img');
    iconImEl.setAttribute("alt", altDesc);
    iconImEl.setAttribute("src", icon);
    return iconImEl;
};

function kelvinToFahrenheit(kelvin){
    return Math.trunc((kelvin - 273.15) * 9/5 + 32);
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
    h2DivEl.classList.add('flex');
    h2DivEl.classList.add('items-center');
    // header for the name of the city searched
    const cityH2El = document.createElement("h2");
    cityH2El.textContent = cityName;
    cityH2El.classList.add("text-5xl");
    cityH2El.classList.add("md:text-6xl");
    cityH2El.classList.add('text-stone-700')
    // header appeneded to its own div
    h2DivEl.appendChild(cityH2El);

    // a div to hold the current weather icon
    let iconDivEl = document.createElement('div');

    // flexbox to hold the header and icon beside each other
    let headerFlexDiv = document.createElement('div');
    headerFlexDiv.classList.add("flex");
    
    // -------------- current day description -------------- //
    let descDivEl = document.createElement('div');
    descDivEl.classList.add("flex");
    descDivEl.classList.add("flex-col");
    descDivEl.classList.add("text-base");
    descDivEl.classList.add('md:text-xl');
    descDivEl.classList.add('items-center');
    descDivEl.classList.add('text-stone-700')
    // ------------current day description--------------- //

    // ------------ current day div --------------//
    let currentDayFlexBox = document.createElement('div');
    currentDayFlexBox.classList.add('flex');
    currentDayFlexBox.classList.add('flex-col');
    currentDayFlexBox.classList.add('mb-6');
    currentDayFlexBox.classList.add('lg:self-start')
    // ------------ current day div ---------//

    // --------------  END City Header+DESC Els -------------- //

    // --------------five day forecast section----------- //
    let eigthtDayFlexBox = document.createElement('div');
    eigthtDayFlexBox.classList.add('flex');
    eigthtDayFlexBox.classList.add('flex-col');
    eigthtDayFlexBox.classList.add('justify-center');
    eigthtDayFlexBox.classList.add('shadow-lg');

    let topEightDayDivEl = document.createElement("div");
    topEightDayDivEl.classList.add("flex"); 
    let bottomEightDayDivEl = document.createElement('div');
    bottomEightDayDivEl.classList.add('flex');
    //----------- end of five day forecast section ---------- //

    // ----------current day description p elements------- //
    let pTempEl = document.createElement("p");
    let pFeelTempEl = document.createElement("p");
    let pHumidityEl = document.createElement("p");
    let pWindSpeedEl = document.createElement("p");
    // ------------- enternal function -------------//
    function fillContent(data) {
        // construct loop                        
        let i = 0
        for(const property in data){
            switch(property){
                case "current":
                    pTempEl.textContent = "Temperature: "+ kelvinToFahrenheit(data[property]["temp"]) + "°";
                    pFeelTempEl.textContent = "Feels like: "+ kelvinToFahrenheit(data[property]["feels_like"]) + "°";
                    pHumidityEl.textContent = "Humidity: " + data[property]["humidity"] + "%"
                    pWindSpeedEl.textContent = "Wind speed: " + data[property]["wind_speed"] + "mph"
                    //append CURRENT weather loop
                    var pDescEl = document.createElement("p");
                    pDescEl.textContent = `${data[property]["weather"][0]["description"]}`;
                    descDivEl.append(pDescEl, pTempEl, pFeelTempEl, pHumidityEl, pWindSpeedEl);
                    iconDivEl.appendChild(createIconEl(data[property]["weather"][0]["icon"],"Image of current weather"));
                    break;
    
                case "daily":
                    data[property].forEach((object) => {
                        i++
                        let dayContainer = document.createElement('div');
                        dayContainer.classList.add('flex');
                        dayContainer.classList.add('flex-col');
                        dayContainer.classList.add('border-2');
                        dayContainer.classList.add('border-black');
                        dayContainer.classList.add('text-center');
                        dayContainer.classList.add('bg-indigo-300')
                        dayContainer.classList.add('w-full')
                        for (const subproperty in object){
                            switch(subproperty){
                                case "weather":
                                    //sends icon code to generate an img element with icon
                                    if(i <= 4){
                                        dayContainer.appendChild(createIconEl(object[subproperty][0]["icon"], "Image of weather"));
                                        topEightDayDivEl.appendChild(dayContainer);
                                    }else{
                                        dayContainer.appendChild(createIconEl(object[subproperty][0]["icon"], "Image of weather"));
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
    headerFlexDiv.appendChild(h2DivEl);
    headerFlexDiv.appendChild(iconDivEl);
    currentDayFlexBox.appendChild(headerFlexDiv);
    currentDayFlexBox.appendChild(descDivEl);

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