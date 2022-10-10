// use the express library
const express = require('express');

// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;
let nextVisitorId = 1;
const {encode} = require('html-entities');
const cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());

// Function to calculate for how long you have been here
function myFunction(last_accessed) {
    var timeOnSite = Date.now() - last_accessed;
    var secondsTotal = timeOnSite / 1000;
    var seconds = Math.floor(secondsTotal);
    return seconds;
}

// ... snipped out code ...

app.get('/', (req, res) => {

    // Increament visitor id if it doesn't exist
    if (isNaN(req.cookies['visitorId'])){
      nextVisitorId++;
    }

    // Update the visitor ID 
    res.cookie('visitorId', nextVisitorId);

    // To check for first time
    var vis =  "";
    if (isNaN(myFunction(req.cookies['visited']))){
        vis =  "You have never visited";
    }else{
        vis = "It has been " + myFunction(req.cookies['visited']) + " seconds since your last visit";
    }

    // Update the time user visited
    res.cookie('visited', Date.now());

    res.render('welcome', {
        name: req.query.name || "All",
        last_accessed : new Date().toLocaleString() || "10/07/2022, 00:00:00 PM",
        visited:`${vis}`,
        visitorId: req.cookies['visitorId'] || nextVisitorId
      });

    console.log(req.cookies)
  
  });

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");
