// use the express library
const express = require('express');

// api for web requests
const fetch = require('node-fetch');

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
    if (isNaN(req.cookies['visitorId'])) {
        nextVisitorId++;
    }

    // Update the visitor ID 
    res.cookie('visitorId', nextVisitorId);

    // To check for first time
    var vis = "";
    if (isNaN(myFunction(req.cookies['visited']))) {
        vis = "You have never visited";
    } else {
        vis = "It has been " + myFunction(req.cookies['visited']) + " seconds since your last visit";
    }

    // Update the time user visited
    res.cookie('visited', Date.now());

    res.render('welcome', {
        name: req.query.name || "All",
        last_accessed: new Date().toLocaleString() || "10/07/2022, 00:00:00 PM",
        visited: `${vis}`,
        visitorId: req.cookies['visitorId'] || nextVisitorId
    });

    console.log(req.cookies)

});

// Trivia
app.get("/trivia", async (req, res) => {
    // fetch the data
    const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

    // fail if bad response
    if (!response.ok) {
        res.status(500);
        res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
        return;
    }

    // interpret the body as json
    const content = await response.json();

    // fail if db failed
    if (content.response_code !== 0) {
        res.status(500);
        res.send(`Open Trivia Database failed with internal response code ${data.response_code}`);
        return;
    }

    // respond to the browser
    //res.send(JSON.stringify(content, 1));
    console.log(content.results)

    const questionResponse = content.results[0]
    var all_answers = []
    all_answers.push(questionResponse.correct_answer);
    final = all_answers.concat(questionResponse.incorrect_answers);

    console.log(final)

    let shuffled = final
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

    console.log(shuffled)

        const answerLinks = shuffled.map(answer => {
        return `<a href="javascript:alert('${
            answer === questionResponse.correct_answer ? 'Correct!' : 'Incorrect, Please Try Again!'
        }')">${answer}</a>`
    })

    console.log(answerLinks)

    res.render('trivia', {
        question: questionResponse.question,
        category: questionResponse.category,
        difficulty: questionResponse.difficulty,
        answers: answerLinks
    })


});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");
