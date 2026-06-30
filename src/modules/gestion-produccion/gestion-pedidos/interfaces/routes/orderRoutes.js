const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const verifyJWT = require('../../../../../shared/middleware/verifyJWT');
const authorize = require('../../../../../shared/middleware/authorize');

router.use(verifyJWT);

router.post('/', authorize('orders.edit'), (req, res, next) => OrderController.create(req, res, next));
router.get('/dashboard', authorize('orders.view'), (req, res, next) => OrderController.dashboard(req, res, next));
router.get('/companies', authorize('orders.view'), (req, res, next) => OrderController.getCompanies(req, res, next));
router.get('/companies/:companyId/dining-rooms', authorize('orders.view'), (req, res, next) => OrderController.getDiningRoomsByCompany(req, res, next));
router.get('/dining-rooms/:diningRoomId/weeks', authorize('orders.view'), (req, res, next) => OrderController.getWeeksByDiningRoom(req, res, next));
router.get('/weeks/:weekId', authorize('orders.view'), (req, res, next) => OrderController.getWeekDetail(req, res, next));
router.patch('/meals/:detailId/status', authorize('orders.update-status'), (req, res, next) => OrderController.updateMealStatus(req, res, next));
router.get('/statistics', authorize('orders.view'), (req, res, next) => OrderController.statistics(req, res, next));

module.exports = router;