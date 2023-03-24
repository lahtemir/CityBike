const express = require("express");
const mongoose =require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const homeTitle= "Bike Trips"


// Connectiong to mongoose db
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/Trips20")

//Creating new schemas
const dataSchema = {
  Departure: String,
  Return: String,
  DepartureStationId: String,
  DepartureStationName: String,
  ReturnStationId: String,
  ReturnStationName: String,
  Distance: Number,
  Duration: Number
};

const stationSchema = {
  Id: String,
  Name: String,
  Osoite: String,
  Kaupunki: String
}

//Creating models
const Datarow = mongoose.model("Datarow", dataSchema);
const Station = mongoose.model("Station", stationSchema);

app.get("/", function(req, res) {

//Finding all data and rendering to home page
Datarow.find()
.then(function (datarows) {
  res.render("home", {
    homeText:homeTitle,
    allData:datarows
  });
})
.catch(function (err) {
console.log(err);
});

});

app.get("/stations", function(req, res) {
  Station.find()
  .then(function (stations) {
    res.render("stations", {
      allStations:stations
    });
  })
  .catch(function (err) {
  console.log(err);
});
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
