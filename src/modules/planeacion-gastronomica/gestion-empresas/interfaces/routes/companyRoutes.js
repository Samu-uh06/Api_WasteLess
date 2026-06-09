const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/CompanyController');
const verifyJWT = require('../../../../../shared/middleware/verifyJWT');
const authorize = require('../../../../../shared/middleware/authorize');

router.use(verifyJWT);

router.get('/cities', authorize('companies.view'), (req, res, next) => CompanyController.getCities(req, res, next));
router.post('/', authorize('companies.create'), (req, res, next) => CompanyController.create(req, res, next));
router.get('/', authorize('companies.view'), (req, res, next) => CompanyController.getAll(req, res, next));
router.get('/search', authorize('companies.view'), (req, res, next) => CompanyController.search(req, res, next));
router.get('/statistics', authorize('companies.view'), (req, res, next) => CompanyController.statistics(req, res, next));
router.get('/:id', authorize('companies.view'), (req, res, next) => CompanyController.getById(req, res, next));
router.get('/:id/indicators', authorize('companies.view'), (req, res, next) => CompanyController.indicators(req, res, next));
router.put('/:id', authorize('companies.edit'), (req, res, next) => CompanyController.update(req, res, next));
router.delete('/:id', authorize('companies.delete'), (req, res, next) => CompanyController.delete(req, res, next));
router.patch('/:id/status', authorize('companies.edit'), (req, res, next) => CompanyController.changeStatus(req, res, next));

module.exports = router;