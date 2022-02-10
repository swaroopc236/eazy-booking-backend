const router = require('express').Router();
const roomController = require('../controllers/roomController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/', roomController.getRooms);

router.post('/', requireAuth, requireAdmin, roomController.addRoom);

router.put('/:roomId', requireAuth, requireAdmin, roomController.updateRoom);

router.delete('/:roomId', requireAuth, requireAdmin, roomController.deleteRoom);

module.exports = router;
