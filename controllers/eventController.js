const { v4: uuidv4 } = require('uuid');
const { executeQuery, getLatestEvents } = require('../db');

exports.getEvents = (req, res) => {
	const query = {
		name: 'get-events',
		text: `select et."eventId", ut."userName", ut."userId", rt."roomName", rt."roomId", et."eventDetails" from
                events et
                inner join users ut on et."userId" = ut."userId"
                inner join rooms rt on et."roomId" = rt."roomId"`,
		rowMode: 'string',
	};
	const queryErrMsg = 'Could not get events';

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

exports.getEventById = (req, res) => {
	const eventId = req.params.eventId;

	const query = {
		name: 'get-event-by-id',
		text: `select et."eventId", ut."userName", rt."roomName", et."eventDetails" from
                events et
                inner join users ut on et."userId" = ut."userId"
                inner join rooms rt on et."roomId" = rt."roomId"
				where et."eventId" = $1`,
		values: [eventId],
		rowMode: 'string',
	};
	const queryErrMsg = 'Could not get the event';

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

exports.getEventsInRoom = (req, res) => {
	const roomId = req.params.roomId;

	const query = {
		name: 'get-events-by-roomid',
		text: `select et."eventId", ut."userName", rt."roomName", et."eventDetails" from
                events et
                inner join users ut on et."userId" = ut."userId"
                inner join rooms rt on et."roomId" = rt."roomId"
				where et."roomId" = $1`,
		values: [roomId],
		rowMode: 'string',
	};
	const queryErrMsg = 'Could not get the events';

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

exports.addEvent = (req, res) => {
	const userId = req.body.userId;
	const roomId = req.body.roomId;
	const eventDetails = req.body.eventDetails;

	const eventId = uuidv4();
	const query = {
		name: 'post-event',
		text: 'INSERT INTO EVENTS VALUES($1, $2, $3, $4) RETURNING *',
		values: [eventId, userId, roomId, eventDetails],
		rowMode: 'string',
	};
	const queryErrMsg = 'Could not add event';

	executeQuery(query, queryErrMsg, (err, result) => {
		if (err) {
			return res.status(500).json({
				msg: err,
			});
		}
		getLatestEvents();
		return res.status(201).json({
			data: result,
		});
	});
};

exports.updateEvent = (req, res) => {
	const eventId = req.params.eventId;
	const roomId = req.body.roomId;
	const eventDetails = req.body.eventDetails;

	const query = {
		name: 'update-event',
		text: 'UPDATE EVENTS SET "roomId" = $1, "eventDetails" = $2 WHERE "eventId" = $3 RETURNING *',
		values: [roomId, eventDetails, eventId],
		rowMode: 'string',
	};
	var queryErrMsg = 'Could not update event';

	executeQuery(query, queryErrMsg, (err, result) => {
		if (err) {
			return res.status(500).json({
				msg: err,
			});
		}
		getLatestEvents();
		return res.status(200).json({
			data: result,
		});
	});
};

exports.deleteEvent = (req, res) => {
	const eventId = req.params.eventId;

	const query = {
		name: 'delete-event',
		text: 'DELETE FROM EVENTS WHERE "eventId" = $1',
		values: [eventId],
		rowMode: 'string',
	};

	var queryErrMsg = 'Could not delete event';

	executeQuery(query, queryErrMsg, (err, result) => {
		if (err) {
			return res.status(500).json({
				msg: err,
			});
		}
		getLatestEvents();
		return res.status(200).json({
			data: result,
		});
	});
};
