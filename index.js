const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

var corsOptions = {
	origin: 'http://localhost:4200',
	credentials: true
}

app.use(cors(corsOptions));
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
