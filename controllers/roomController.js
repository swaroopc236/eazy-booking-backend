const { v4: uuidv4 } = require('uuid');
const { executeQuery, getLatestEvents, getLatestRooms } = require('../db');

exports.getRooms = (req, res) => {
	const query = {
		name: 'get-rooms',
		text: 'SELECT * FROM ROOMS',
		rowMode: 'string',
	};
	const queryErrMsg = 'Could not get rooms';

	executeQuery(query, queryErrMsg, (err, result) => {
		if (err) {
			return res.status(500).json({
				msg: err,
			});
		}
		return res.status(200).json({
			data: result,
		});
	});
};

exports.getRoomById = (req, res) => {
	const roomId = req.params.roomId;
	const query = {
		name: 'get-room-by-id',
		text: 'SELECT * FROM ROOMS where "roomId" = $1',
		values: [roomId],
		rowMode: 'string',
	};
	const queryErrMsg = 'Could not get the room';

	executeQuery(query, queryErrMsg, (err, result) => {
		if (err) {
			return res.status(500).json({
				msg: err,
			});
		}
		return res.status(200).json({
			data: result,
		});
	});
};

exports.addRoom = (req, res) => {
	const roomName = req.body.roomName;
	const roomDetails = req.body.roomDetails;

	const roomId = uuidv4();
	const query = {
		name: 'post-room',
		text: 'INSERT INTO ROOMS VALUES($1, $2, $3) RETURNING *',
		values: [roomId, roomName, roomDetails],
		rowMode: 'string',
	};
	var queryErrMsg = 'Could not add room';

	executeQuery(query, queryErrMsg, (err, result) => {
		if (err) {
			if (err.code == '23505') {
				queryErrMsg = 'A room with same name exists';
			}
			return res.status(500).json({
				msg: queryErrMsg,
			});
		}
		getLatestRooms();
		return res.status(200).json({
			data: result,
		});
	});
};

exports.updateRoom = (req, res) => {
	const roomId = req.params.roomId;
	const roomName = req.body.roomName;
	const roomDetails = req.body.roomDetails;

	const query = {
		name: 'update-room',
		text: 'UPDATE ROOMS SET "roomName" = $1, "roomDetails" = $2 WHERE "roomId" = $3 RETURNING *',
		values: [roomName, roomDetails, roomId],
		rowMode: 'string',
	};
	var queryErrMsg = 'Could not update room';

	executeQuery(query, queryErrMsg, (err, result) => {
		if (err) {
			if (err.code == '23505') {
				queryErrMsg = 'A room with same name exists';
			}
			return res.status(500).json({
				msg: queryErrMsg,
			});
		}
		getLatestEvents();
		getLatestRooms();
		return res.status(200).json({
			data: result,
		});
	});
};

exports.deleteRoom = (req, res) => {
	const roomId = req.params.roomId;

	const query = {
		name: 'delete-room',
		text: 'DELETE FROM ROOMS WHERE "roomId" = $1',
		values: [roomId],
		rowMode: 'string',
	};
	var queryErrMsg = 'Could not delete room';

	executeQuery(query, queryErrMsg, (err, result) => {
		if (err) {
			return res.status(500).json({
				msg: err,
			});
		}
		getLatestEvents();
		getLatestRooms();
		return res.status(200).json({
			data: result,
		});
	});
};
