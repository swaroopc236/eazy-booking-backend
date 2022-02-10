const router = require('express').Router();
const eventController = require('../controllers/eventController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', eventController.getEvents);

router.post('/', requireAuth, eventController.addEvent);

router.put('/:eventId', requireAuth, eventController.updateEvent);

router.delete('/:eventId', requireAuth, eventController.deleteEvent);

module.exports = router;
