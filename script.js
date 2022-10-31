const citysearch = document.getElementById("citysearch");
const cityElement = document.getElementById("city");
const currentTemp = document.getElementById("currentT");
const feelslikeElement = document.getElementById("feelslike");
const humidityElement = document.getElementById("humid");
const weatherElement = document.getElementById("weather");
const formsearch = document.getElementById("search");
const imageauthor = document.getElementById("author");
const units = document.getElementById("units");
let cityinput = document.getElementById("citysearch");
let data = [];
let lat = "";
let lon = "";
let city = "";
if (localStorage.getItem("setcity")) {
  city = localStorage.getItem("setcity");
  cityinput.value = city;
  if (units.checked == false) {
    reportw();
    searchUnsplash(city);
  } else if (units.checked == true) {
    reportwF();
    searchUnsplash(city);
  }
}

async function getWeather() {
  localStorage.setItem("setcity", formsearch.cityname.value);
  if (units.checked == false) {
    await fetch(
      "http://api.openweathermap.org/data/2.5/weather?q=" +
        formsearch.cityname.value +
        "&units=metric&&APPID=a5f182cf976716a7e32f62e39ff8fe22"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        data = response;
        lat = response.coord.lat;
        lon = response.coord.lon;
      });
    await fetch(
      "http://api.openweathermap.org/geo/1.0/reverse?lat=" +
        lat +
        "&lon=" +
        lon +
        "&limit=1&appid=a5f182cf976716a7e32f62e39ff8fe22"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        city =
          response[0].name +
          ", " +
          response[0].state +
          ", " +
          response[0].country;
      });
  } else if (units.checked == true) {
    await fetch(
      "http://api.openweathermap.org/data/2.5/weather?q=" +
        formsearch.cityname.value +
        "&units=imperial&&APPID=a5f182cf976716a7e32f62e39ff8fe22"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        data = response;
        lat = response.coord.lat;
        lon = response.coord.lon;
      });
    await fetch(
      "http://api.openweathermap.org/geo/1.0/reverse?lat=" +
        lat +
        "&lon=" +
        lon +
        "&limit=1&appid=a5f182cf976716a7e32f62e39ff8fe22"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        city =
          response[0].name +
          ", " +
          response[0].state +
          ", " +
          response[0].country;
      });
  }
}
function camelCase(str) {
  const arr = str.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const str2 = arr.join(" ");
  return str2;
}
async function reportw() {
  await getWeather().then(function () {
    cityElement.innerText = city;
    currentTemp.innerText = "Current Temp: " + data.main.temp + " C";
    humidityElement.innerText = "Humidity: " + data.main.humidity + "%";
    feelslikeElement.innerText = "Feels Like: " + data.main.feels_like + " C";
    weatherElement.innerText = camelCase(data.weather[0].description);
  });
}
async function reportwF() {
  await getWeather().then(function () {
    cityElement.innerText = city;
    currentTemp.innerText = "Current Temp: " + data.main.temp + " F";
    humidityElement.innerText = "Humidity: " + data.main.humidity + "%";
    feelslikeElement.innerText = "Feels Like: " + data.main.feels_like + " F";
    weatherElement.innerText = camelCase(data.weather[0].description);
  });
}
units.addEventListener("change", function () {
  if (cityinput.value == "") {
    return;
  } else if (units.checked == false) {
    reportw();
  } else if (units.checked == true) {
    reportwF();
  }
});

formsearch.addEventListener("submit", async function (event) {
  if (units.checked == false) {
    event.preventDefault();
    await searchUnsplash(formsearch.cityname.value).then(reportw);
  } else if (units.checked == true) {
    event.preventDefault();
    await searchUnsplash(formsearch.cityname.value).then(reportwF);
  }
});
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

async function searchUnsplash(city) {
  const endpoint =
    "https://api.unsplash.com/search/photos?query=" +
    city +
    "&per_page=30&page=1&client_id=LtBlgoYeC47ukKwP9ZdQu7WEIm1MuuYrMxDhOZJBd-k";
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const rndInt = Math.floor(Math.random() * 9) + 1;
  const json = await response.json();
  const instagramname = json.results[0].user.instagram_username;
  let name = "";
  if (json.results[rndInt].user.last_name != null) {
    name =
      json.results[rndInt].user.first_name +
      " " +
      json.results[rndInt].user.last_name;
  } else if (json.results[rndInt].user.first_name != null) {
    name = json.results[rndInt].user.first_name;
  } else {
    name = json.results[rndInt].user.instagram_username;
  }
  json.results[rndInt].user.first_name +
    " " +
    json.results[rndInt].user.last_name;
  loadImage(json.results[rndInt].urls.full).then(
    (document.body.style.backgroundImage = `url(${json.results[rndInt].urls.full})`)
  );
  imageauthor.innerHTML =
    '<a href="https://www.instagram.com/' +
    instagramname +
    '/?hl=en" target=”_blank” >' +
    "Image by: " +
    name +
    "</a>";
  return json;
}

document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1656706593663-837f683cfc35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)`;
imageauthor.innerHTML =
  '<a href="https://unsplash.com/photos/ZcMUiZuOirY" target=”_blank” >' +
  "Image by: Aimee Giles";
("</a>");
