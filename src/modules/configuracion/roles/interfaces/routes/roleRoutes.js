const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');
const verifyJWT = require('../../../../../shared/middleware/verifyJWT');
const authorize = require('../../../../../shared/middleware/authorize');

router.use(verifyJWT);

router.post('/', authorize('roles.create'), RoleController.create);
router.get('/', authorize('roles.view'), RoleController.getAll);
router.get('/search', authorize('roles.view'), RoleController.search);
router.get('/statistics', authorize('roles.view'), RoleController.statistics);
router.get('/:id', authorize('roles.view'), RoleController.getById);
router.put('/:id', authorize('roles.edit'), RoleController.update);
router.delete('/:id', authorize('roles.delete'), RoleController.delete);
router.patch('/:id/status', authorize('roles.edit'), RoleController.changeStatus);
router.put('/:id/permissions', authorize('roles.edit'), RoleController.assignPermissions);

module.exports = router;