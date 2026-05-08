const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const verifyJWT = require('../../../../../shared/middleware/verifyJWT');
const authorize = require('../../../../../shared/middleware/authorize');

router.use(verifyJWT);

router.post('/', authorize('users.create'), UserController.create);
router.get('/', authorize('users.view'), UserController.getAll);
router.get('/search', authorize('users.view'), UserController.search);
router.get('/statistics', authorize('users.view'), UserController.statistics);
router.get('/:id', authorize('users.view'), UserController.getById);
router.put('/:id', authorize('users.edit'), UserController.update);
router.delete('/:id', authorize('users.delete'), UserController.delete);
router.patch('/:id/status', authorize('users.edit'), UserController.changeStatus);

module.exports = router;