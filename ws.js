const socket = require('socket.io');
const server = require('./index');

const io = socket(server, {
	cors: {
		origin: '*',
	},
});

io.on('connection', (client) => {
	console.log('connected ', client.id);
	client.emit('NEW_CONNECTION', 'Hello from server');
	io.sockets.emit('BROADCAST', 'This is a broadcast message');
});

module.exports = io;
