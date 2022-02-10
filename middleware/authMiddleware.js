const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	// check jwt exists & verify
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
			if (err) {
				console.error(err);
				return res.status(401).json({
					msg: 'Invalid token',
				});
			} else {
				console.log(decodedToken);
				req.isAdmin = decodedToken.isAdmin;
				next();
			}
		});
	} else {
		return res.status(401).json({
			msg: 'No token',
		});
	}
};

const requireAdmin = (req, res, next) => {
	console.log(req.isAdmin);
	if (req.isAdmin) {
		next();
	} else {
		return res.status(403).json({
			msg: 'Not authorized',
		});
	}
};

module.exports = {
	requireAuth,
	requireAdmin,
};
