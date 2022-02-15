const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// const exercisesRouter = require('./routes/exercises');
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

// const WebSocket = require('ws');
// const { OPEN } = require('ws');

// const wss = new WebSocket.Server({
// 	server: app,
// 	host: 'eazy-booking-staging.herokuapp.com/',
// });

// console.log('*******');
// console.log(wss);

// app.on('upgrade', (request, socket, head) => {
// 	wss.handleUpgrade(request, socket, head, (websocket) => {
// 		wss.emit('connection', websocket, request);
// 	});
// });

// wss.on('connection', (ws) => {
// 	console.log('Client connected....');
// 	ws.send('Welcome Client!');
// 	const welcomeMsg = {
// 		msgType: 'WELCOME',
// 		data: ['Welcome Client!'],
// 	};
// 	ws.send(JSON.stringify(welcomeMsg));
// 	ws.on('close', (ws) => {
// 		console.log('Client disconnected');
// 	});
// });

const socket = require('socket.io');

const io = socket(server, {
	cors: {
		origin: '*',
	},
});

io.on('connection', (client) => {
	console.log('Connected ', client.id);
	client.emit('NEW_CONNECTION', 'Hello from server');
	io.sockets.emit('BROADCAST', 'This is a broadcast message');
});

module.exports = {
	server: server,
	io: io,
};
