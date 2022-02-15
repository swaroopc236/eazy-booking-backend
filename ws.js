const WebSocket = require('ws');
const server = require('./index');

const socket = require('socket.io');

const io = socket(server, {
	cors: {
		origin: '*',
	},
});

io.on('connection', (client) => {
	console.log('connected');
	client.emit('NEW_CONNECTION', 'Hello from server');
});

// const wsPort = process.env.WS_PORT || 5001;
// const wss = new WebSocket.Server({ port: wsPort });

// wss.on('connection', (ws) => {
// 	console.log('Client connected');
// 	const welcomeMsg = {
// 		msgType: 'WELCOME',
// 		data: ['Welcome Client!'],
// 	};
// 	ws.send(JSON.stringify(welcomeMsg));

// 	ws.on('close', (ws) => {
// 		console.log('Client disconnected');
// 	});
// });

// module.exports = {
// 	wss: wss,
// 	io: io,
// };

module.exports = io;
