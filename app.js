const express = require("express");
const mongoose =require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));




// Connectiong to mongoose db
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/Trips20")

//Creating new schema
const dataSchema = {
  departure: String,
  return: String,
  departureStationId: String,
  departureStationName: String,
  returnStationId: String,
  returnStationName: String,
  distance: Number,
  duration: Number
};

//Creating model
const Datarow = mongoose.model("Datarow", dataSchema);

app.get("/", function(req, res) {

Datarow.find()
.then(function (datarows) {
console.log(datarows);
  })
.catch(function (err) {
console.log(err);
});


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
