const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

var allowlist = ['https://eazy-booking-app.herokuapp.com', 'http://localhost:4200', 'http://localhost:8080', 'https://frosty-archimedes-3fc480.netlify.app']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

// var corsOptions = {
// 	origin: 'https://eazy-booking-app.herokuapp.com',
// 	credentials: true
// }

app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(cookieParser());

const usersRouter = require('./routes/users');
const roomsRouter = require('./routes/rooms');
const eventsRouter = require('./routes/events');

app.get('/', (req, res) => {
	res.status(200).json({
		msg: 'Base path',
	});
});

// Routes
app.use('/users', usersRouter);
app.use('/rooms', roomsRouter);
app.use('/events', eventsRouter);

var server = app.listen(port, () => {
	console.log('Server is running on port: ' + port);
});

module.exports = server;

const io = require('./ws');
