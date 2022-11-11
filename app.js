// Following the below tutorial
// (1) https://www.youtube.com/watch?v=A01KtJTv1oc
// (2) https://www.youtube.com/watch?v=SccSCuHhOw0
// (3) https://www.youtube.com/watch?v=vrj9AohVhPA


// Imports
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const dbService = require("./services/db")

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
	res.render('index', {"username":"Folks"});
});


// Temporary call to see data from db
app.get('/data', (req, res) => {
	// DB test show something
	const db = dbService.getDbServiceInstance();
	const result = db.getAllData();
	result
	    .then(data => res.json({data : data}))
	    .catch(err => console.log(err));
});

// Listen on port 3000
app.listen(process.env.PORT, () => console.info(`Listening on port ${process.env.PORT}`));

