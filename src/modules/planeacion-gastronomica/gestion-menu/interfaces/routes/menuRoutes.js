const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const verifyJWT = require('../../../../../shared/middleware/verifyJWT');
const authorize = require('../../../../../shared/middleware/authorize');

router.use(verifyJWT);

router.post('/', authorize('menus.create'), (req, res, next) => MenuController.create(req, res, next));
router.get('/', authorize('menus.view'), (req, res, next) => MenuController.getAll(req, res, next));
router.get('/search', authorize('menus.view'), (req, res, next) => MenuController.search(req, res, next));
router.get('/statistics', authorize('menus.view'), (req, res, next) => MenuController.statistics(req, res, next));
router.get('/:id', authorize('menus.view'), (req, res, next) => MenuController.getById(req, res, next));
router.get('/:id/planning', authorize('menus.view'), (req, res, next) => MenuController.getPlanning(req, res, next));
router.put('/:id', authorize('menus.edit'), (req, res, next) => MenuController.update(req, res, next));
router.delete('/:id', authorize('menus.delete'), (req, res, next) => MenuController.delete(req, res, next));
router.patch('/:id/status', authorize('menus.edit'), (req, res, next) => MenuController.changeStatus(req, res, next));
router.post('/:id/dishes', authorize('menus.edit'), (req, res, next) => MenuController.assignDish(req, res, next));
router.delete('/:id/dishes/:detailId', authorize('menus.edit'), (req, res, next) => MenuController.removeDish(req, res, next));

module.exports = router;