// Following the below tutorial
// (1) Basic: https://www.youtube.com/watch?v=A01KtJTv1oc
// (2) Crash Course: https://www.youtube.com/watch?v=SccSCuHhOw0
// (3) Database Connection: https://www.youtube.com/watch?v=vrj9AohVhPA
// (4) Deploy to Heroku: https://www.youtube.com/watch?v=r2S89Hm1Uq0
// (5) Schedule Job: https://www.youtube.com/watch?v=StkFajPnd7w
// (6) Call External Api: https://www.youtube.com/watch?v=ZbtZ_79UmjI

// Imports
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const dbService = require("./services/db");
const schedule = require("node-schedule");
const dataCollectorService = require("./services/dataCollector");

// Variables
const db = dbService.getDbServiceInstance();

// load .env file
dotenv.config();

// Allow Json and form body data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Static Files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));


// Set View's
app.set('views', './views');
app.set('view engine', 'ejs');

// Show index file
app.get('', (req, res) => {
	res.render('index', {});
});

// Snapshot of all stations at a specified time
app.get('/stations', (req, res) => {
	const result = db.getStations(req.query.at);
	result
	    .then(data => res.json({data : data}))
	    .catch(err => console.log(err));
});

// Snapshot of one station at a specific time
app.get('/stations/:id', (req, res) => {
	const result = db.getStationById(req.params.id,req.query.at);
	result
	    .then(data => res.json({data : data}))
	    .catch(err => console.log(err));
});

// Forcefully collect data
app.get('/collectData', (req, res) => {
	const dataCollector = dataCollectorService.getDataCollectorServiceInstance();
	dataCollector.startDataCollection(db);
	res.json({"message" : "Success"});
});

// Listen on port 3000
app.listen(process.env.PORT, () => console.info(`Listening on port ${process.env.PORT}`));


// Define Schedule for running every hour
schedule.scheduleJob("1 * * * *", () => { // second(optional) minute hour day_of_month month day_of_week
	// console.log("Job ran @", new Date().toString());
	const dataCollector = dataCollectorService.getDataCollectorServiceInstance();
	dataCollector.startDataCollection(db);
});






