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

// Routes
app.use('/users', usersRouter);
app.use('/admin/rooms', roomsRouter);
app.use('/events', eventsRouter);

app.listen(port, () => {
	console.log('Server is running on port: ' + port);
});

// const WebSocket = require('ws');
// const { OPEN } = require('ws');

// const wss = new WebSocket.Server({ port: 5050 });

// wss.on('connection', (ws) => {
// 	console.log('Client connected');
// 	ws.send('Welcome Client!');
// 	ws.on('message', (data) => {
// 		console.log(data.toString());
// 		wss.clients.forEach((client) => {
// 			if (client !== ws && client.readyState == OPEN) {
// 				client.send(data);
// 			}
// 		});
// 	});
// 	ws.on('close', (ws) => {
// 		console.log('Client disconnected');
// 	});
// });
