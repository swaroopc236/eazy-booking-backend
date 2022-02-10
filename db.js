const { Pool } = require('pg');
const wss = require('./ws');
const { WebSocket } = require('ws');

const pool = new Pool({
	connectionString: process.env.POSTGRESQL_URI,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

function executeQuery(query, queryErrMsg, queryResult) {
	var qRes = null;
	pool.connect((err, client, done) => {
		if (err) {
			return console.error('Connection error', err);
		}
		console.log('Connected to testdb.');
		client.query(query, (err, result) => {
			done();
			if (err) {
				console.error(queryErrMsg, err);
				qRes = queryErrMsg;
			} else {
				console.table(result.rows);
				qRes = result.rows;
			}

			queryResult(err, qRes);
		});
	});
}

function getLatestEvents() {
	const wsQuery = {
		name: 'get-events-ws',
		text: `select et."eventId", ut."userName", rt."roomName", et."eventDetails" from
				events et
				inner join users ut on et."userId" = ut."userId"
				inner join rooms rt on et."roomId" = rt."roomId"`,
		rowMode: 'string',
	};
	var wsQueryErrMsg = 'Could not fetch events via ws';
	var resultToBeSentViaWS = {
		msgType: 'ALL_EVENTS',
		data: [],
	};
	executeQuery(wsQuery, wsQueryErrMsg, (err, wsResult) => {
		if (err) {
			resultToBeSentViaWS.data = result;
		} else {
			resultToBeSentViaWS.data = wsResult;
		}
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(resultToBeSentViaWS));
			}
		});
	});
}

function getLatestRooms() {
	const wsQuery = {
		name: 'get-rooms-ws',
		text: 'SELECT * FROM ROOMS',
		rowMode: 'string',
	};
	var wsQueryErrMsg = 'Could not fetch rooms via ws';
	var resultToBeSentViaWS = {
		msgType: 'ALL_ROOMS',
		data: [],
	};
	executeQuery(wsQuery, wsQueryErrMsg, (err, wsResult) => {
		if (err) {
			resultToBeSentViaWS.data = result;
		} else {
			resultToBeSentViaWS.data = wsResult;
		}
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(resultToBeSentViaWS));
			}
		});
	});
}

module.exports = {
	pool: pool,
	executeQuery: executeQuery,
	getLatestEvents: getLatestEvents,
	getLatestRooms: getLatestRooms,
};
