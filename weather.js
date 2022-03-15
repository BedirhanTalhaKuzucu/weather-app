const form = document.querySelector("section.top-banner form");
const input = document.querySelector("div.container input");
const msg = document.querySelector("span.msg");
const cityList = document.querySelector(".ajax-section .cities")


localStorage.setItem( "apiKey", EncryptStringAES("5e4313a3292fa11b9ea4217bc1547166"));

form.addEventListener("submit", (event)=> {
    event.preventDefault();
    getWeatherDataFromApi();
})


const getWeatherDataFromApi = async() => {
    let apikey =  DecryptStringAES(localStorage.getItem("apiKey"));
    let inputVal = input.value;
    let units = "metric";
    let lang = "tr";
    let url = `https://api.openweathermap.org/data/2.5/weather?q= ${inputVal}&appid=${apikey}&units=${units}&lang=${lang}`


    try {

        const response = await axios(url);
        const{main, name, sys, weather}= response.data;
        const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

        let cityCardList = cityList.querySelectorAll(".city");
        let cityCardListArray = Array.from(cityCardList);
        if(cityCardListArray.length > 0){
            const filteredArray = cityCardListArray.filter(card => card.querySelector(".city-name span").innerText == name);
            if(filteredArray.length > 0){
                throw new Error(`You already know the weather for ${name}, Please search for another city 😉`);
                
            }
        }

        let createdCityCardLi = document.createElement("li");
        createdCityCardLi.classList.add("city");
        createdCityCardLi.innerHTML = 
        `<h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
        </figure>`;

        cityList.prepend(createdCityCardLi);


        form.reset();
        input.focus();

    } catch (error) {
        msg.innerText =error;
        setTimeout(()=> {
            msg.innerText ="";
        },5000)
    }


}
