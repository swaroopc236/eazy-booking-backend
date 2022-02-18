const { executeQuery, getLatestEvents } = require('../db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;

const createToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: maxAge,
	});
};

exports.getUsers = (req, res) => {
	const query = {
		name: 'get-users',
		text: 'SELECT * FROM USERS',
		rowMode: 'string',
	};
	const queryErrMsg = 'Could not get users';

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

exports.getUserById = (req, res) => {
	const userId = req.params.userId;
	const query = {
		name: 'get-users',
		text: 'SELECT * FROM USERS where "userId" = $1',
		values: [userId],
		rowMode: 'string',
	};
	const queryErrMsg = 'Could not get the user';

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

exports.signupUser = async (req, res) => {
	const userName = req.body.userName;
	const emailId = req.body.emailId;
	const password = req.body.password;

	const userId = uuidv4();
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const query = {
		name: 'post-user-signup',
		text: 'INSERT INTO USERS VALUES($1, $2, $3, $4) RETURNING *',
		values: [userId, userName, emailId, hashedPassword],
		rowMode: 'string',
	};
	var queryErrMsg = 'Could not add user';

	executeQuery(query, queryErrMsg, (err, result) => {
		if (err) {
			if (err.code == '23505') {
				queryErrMsg = 'Email is already registered';
			}
			return res.status(500).json({
				msg: queryErrMsg,
			});
		}
		const userPayload = {
			id: result[0].userId,
			userName: result[0].userName,
			isAdmin: result[0].isAdmin,
		};
		const token = createToken(userPayload);
		res.cookie('jwt', token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: maxAge * 1000 });
		return res.status(201).json({
			data: result,
		});
	});
};

exports.loginUser = (req, res) => {
	const emailId = req.body.emailId;
	const password = req.body.password;

	const query = {
		name: 'post-user-login',
		text: 'SELECT * FROM USERS WHERE "emailId" = $1',
		values: [emailId],
		rowMode: 'string',
	};
	const queryErrMsg = 'Could not find user';

	executeQuery(query, queryErrMsg, async (err, result) => {
		if (err) {
			return res.status(500).json({
				msg: err,
			});
		}

		if (result.length == 0) {
			return res.status(401).json({
				msg: 'Incorrect email or password',
			});
		}
		const validPassword = await bcrypt.compare(
			password,
			result[0].hashedPassword
		);
		if (!validPassword) {
			return res.status(401).json({
				msg: 'Incorrect email or password',
			});
		}
		const userPayload = {
			id: result[0].userId,
			userName: result[0].userName,
			isAdmin: result[0].isAdmin,
		};
		const token = createToken(userPayload);
		res.cookie('jwt', token, { httpOnly: true, sameSite: 'none', maxAge: maxAge * 1000 });
		return res.status(200).json({
			data: result,
		});
	});
};

exports.updateUser = (req, res) => {
	const userId = req.params.userId;
	const userName = req.body.userName;
	const emailId = req.body.emailId;

	const query = {
		name: 'update-user',
		text: 'UPDATE USERS SET "userName" = $1, "emailId" = $2 WHERE "userId" = $3 RETURNING *',
		values: [userName, emailId, userId],
		rowMode: 'string',
	};
	var queryErrMsg = 'Could not update user';

	executeQuery(query, queryErrMsg, (err, result) => {
		if (err) {
			if (err.code == '23505') {
				queryErrMsg = 'Email is already registered';
			}
			return res.status(500).json({
				msg: queryErrMsg,
			});
		}
		console.log('*********** Update **********');
		console.log(result);
		const userPayload = {
			id: result[0].userId,
			userName: result[0].userName,
			isAdmin: result[0].isAdmin,
		};
		const token = createToken(userPayload);
		res.cookie('jwt', token, { httpOnly: true, sameSite: 'none', maxAge: maxAge * 1000 });
		return res.status(200).json({
			data: result,
		});
	});
};

exports.deleteUser = (req, res) => {
	const userId = req.params.userId;

	const query = {
		name: 'delete-user',
		text: 'DELETE FROM USERS WHERE "userId" = $1',
		values: [userId],
		rowMode: 'string',
	};
	const queryErrMsg = 'Could not delete user';

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

exports.logoutUser = (req, res) => {
	res.cookie('jwt', '', { maxAge: 1 });
	return res.status(200).json({
		msg: 'Logged out',
	});
};
