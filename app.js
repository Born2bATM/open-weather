require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const city = req.body.cityName;
  const apiKey = process.env.apiKey;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const wTemp = weatherData.main.temp;
      const wDescription = weatherData.weather[0].description;
      const imgName = weatherData.weather[0].icon;
      const iconUrl =
        "https://openweathermap.org/img/wn/" + imgName + "@2x.png";
      res.write("<p>The weather is currently " + wDescription + "</p>");
      res.write(
        "<h1>The temperature in " +
          city +
          " is " +
          wTemp +
          " degree celcius.</h1>"
      );
      res.write("<img src='" + iconUrl + "' alt='weather-icon' />");
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
