const express = require('express');
const router = express.Router();
const DiningRoomController = require('../controllers/DiningRoomController');
const verifyJWT = require('../../../../../shared/middleware/verifyJWT');
const authorize = require('../../../../../shared/middleware/authorize');

router.use(verifyJWT);

router.post('/', authorize('diningRooms.create'), (req, res, next) => DiningRoomController.create(req, res, next));
router.get('/', authorize('diningRooms.view'), (req, res, next) => DiningRoomController.getAll(req, res, next));
router.get('/search', authorize('diningRooms.view'), (req, res, next) => DiningRoomController.search(req, res, next));
router.get('/statistics', authorize('diningRooms.view'), (req, res, next) => DiningRoomController.statistics(req, res, next));
router.get('/:id', authorize('diningRooms.view'), (req, res, next) => DiningRoomController.getById(req, res, next));
router.put('/:id', authorize('diningRooms.edit'), (req, res, next) => DiningRoomController.update(req, res, next));
router.delete('/:id', authorize('diningRooms.delete'), (req, res, next) => DiningRoomController.delete(req, res, next));
router.patch('/:id/status', authorize('diningRooms.edit'), (req, res, next) => DiningRoomController.changeStatus(req, res, next));

module.exports = router;