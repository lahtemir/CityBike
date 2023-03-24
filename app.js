const express = require("express");
const mongoose =require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const homeTitle= "Bike Trips"


// Connectiong to mongoose db
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/Trips20")

//Creating new schema
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

//Creating model
const Datarow = mongoose.model("Datarow", dataSchema);

app.get("/", function(req, res) {

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

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
