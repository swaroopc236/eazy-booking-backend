const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5050 });

wss.on('connection', (ws) => {
	console.log('Client connected');
	const welcomeMsg = {
		msgType: 'WELCOME',
		data: ['Welcome Client!'],
	};
	ws.send(JSON.stringify(welcomeMsg));

	ws.on('close', (ws) => {
		console.log('Client disconnected');
	});
});

module.exports = wss;
