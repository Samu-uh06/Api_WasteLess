const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/ProductionOrderController');
const verifyJWT  = require('../../../../../shared/middleware/verifyJWT');
const authorize  = require('../../../../../shared/middleware/authorize');

router.use(verifyJWT);

router.get('/',  authorize('production-orders.view'),   (req, res, next) => controller.getAll(req, res, next));
router.post('/', authorize('production-orders.create'), (req, res, next) => controller.create(req, res, next));

module.exports = router;