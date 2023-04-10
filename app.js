
const express = require("express");
const mongoose =require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const journeysTitle= "Bike Journeys"


// Connectiong to mongoose db
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/helsinkiCityBikesDB")


//Creating new schemas
const allDataSchema = {
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
};

const stationsDataSchema = {
  StationName: String,
  StationAddress: String,
  City: String,
  x: String,
  y: String,
  Departure: Array,
  Return: Array
};

//Creating models
const Alldatarow = mongoose.model("Alldatarow", allDataSchema);
const Station = mongoose.model("Station", stationSchema);
const StationDetails = mongoose.model("StationDetails", stationsDataSchema);

app.get("/", function(req, res) {
  res.redirect("/journeys?page=1&limit=25")
})

app.get("/journeys", paginatedResults(Alldatarow), (req, res) => {

//Finding all data and rendering to home page
Alldatarow.find().limit(100)
.then(function (datarows) {
  res.render("journeys", {
    journeysText:journeysTitle,
    allData:res.paginatedResults
  });
})
.catch(function (err) {
console.log(err);
});
});

app.post("/searchJourneys/:searchedStation", (req, res) => {
  let requestedSearch =req.body.searchedStation;
  let requestedDistanceMin;
  let requestedDistanceMax;
  let requestedDurationMin;
  let requestedDurationMax;

  // Setting min distance to 0 if no input 
  if (!req.body.distanceMin) {
    requestedDistanceMin = parseFloat(0);
  } else {
    requestedDistanceMin= parseFloat(req.body.distanceMin)*1000;
  }

  // Setting max distance to infinity if no input 
  if (!req.body.distanceMax) {
    requestedDistanceMax = parseFloat(Infinity);
  } else {
    requestedDistanceMax= parseFloat(req.body.distanceMax)*1000;
  }

  

  // Setting min duration to 0 if no input 
  if (!req.body.durationMin) {
    requestedDurationMin = parseFloat(0);
  } else {
    requestedDurationMin= parseFloat(req.body.durationMin)*60;
  }

  // Setting max duration to infinity if no input 
  if (!req.body.durationMax) {
    requestedDurationMax = parseFloat(Infinity);
  } else {
    requestedDurationMax= parseFloat(req.body.durationMax)*60;
  }

// Finding journey data from db
  Alldatarow.find({$and: [
    {$or: [{DepartureStationName:requestedSearch}, {ReturnStationName:requestedSearch}]}, 
    {$and: [ { Distance:{$gte:(requestedDistanceMin)} }, { Distance:{$lte:(requestedDistanceMax)} } ] },
    {$and: [ { Duration:{$gte:(requestedDurationMin)} }, { Duration:{$lte:(requestedDurationMax)} } ] }
    ]})
  .then(searchedData => {
    res.render("searchJourney", {
      searchedJourney:requestedSearch,
      searchedData:searchedData
   
    });
  })
  .catch(function (err) {
    res.redirect("/journeys")
    console.log(err);
    });
});



app.get("/stations", paginatedResults(Station), (req, res) => {
  Station.find()
  .then(function (stations) {
    res.render("stations", {
      allStations:res.paginatedResults
    });
  })
  .catch(function (err) {
  console.log(err);
});
});




// Creating dynamic page for stations
app.get("/stations/:Name", (req, res) => {
  let requestedStation = req.params.Name;

// Finding spesific stations info

StationDetails.findOne({StationName:requestedStation})

.then(StationDetails => {
  res.render("station", {
    stationName:StationDetails.StationName,
    stationAddress:StationDetails.StationAddress,
    departures:StationDetails.Departure,
    returns: StationDetails.Return,
    lng: parseFloat(StationDetails.x),
    lat: parseFloat(StationDetails.y)
  });
});

});


app.post("/searchStation/:requestedStation", function(req, res) {
  let requestedStation = req.body.requestedStation;

 
    StationDetails.findOne({StationName:requestedStation})
    .then(StationDetails => {
      res.render("station", {
        stationName:StationDetails.StationName,
        stationAddress:StationDetails.StationAddress,
        departures:StationDetails.Departure,
        returns: StationDetails.Return
      });
    })
    .catch(function (err) {
      res.redirect("/stations?page=1&limit=25")
      console.log(err);
    });

})




app.get("/map", (req, res) => {
  res.render("map")
})


app.get("/users", paginatedResults(Alldatarow), (req, res ) => {

  res.json(res.paginatedResults) 
})




function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
  
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
  
    const results = {}
  
    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
  
  
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }

    results.info = {
      page: page,
      limit: limit, 
      startIndex: startIndex,
      endIndex: endIndex
    }
  

    try{
      results.results = await model.find().limit(limit).skip(startIndex).exec()
      res.paginatedResults = results
      next()
    }catch (e) {
      res.status(500).json({message: e.message})
    }
    
    
  }
}






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
