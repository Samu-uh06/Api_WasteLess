const express = require('express');
const router = express.Router();
const DishController = require('../controllers/DishController');
const verifyJWT = require('../../../../../shared/middleware/verifyJWT');
const authorize = require('../../../../../shared/middleware/authorize');
const { upload } = require('../../infrastructure/database/cloudinary');

router.use(verifyJWT);

// Categorias
router.post('/categories', authorize('dishes.create'), (req, res, next) => DishController.createCategory(req, res, next));
router.get('/categories', authorize('dishes.view'), (req, res, next) => DishController.getAllCategories(req, res, next));
router.put('/categories/:id', authorize('dishes.edit'), (req, res, next) => DishController.updateCategory(req, res, next));
router.delete('/categories/:id', authorize('dishes.delete'), (req, res, next) => DishController.deleteCategory(req, res, next));

// Platillos
router.post('/', upload.single('imagen'), authorize('dishes.create'), (req, res, next) => DishController.create(req, res, next));
router.get('/', authorize('dishes.view'), (req, res, next) => DishController.getAll(req, res, next));
router.get('/search', authorize('dishes.view'), (req, res, next) => DishController.search(req, res, next));
router.get('/statistics', authorize('dishes.view'), (req, res, next) => DishController.statistics(req, res, next));
router.get('/:id', authorize('dishes.view'), (req, res, next) => DishController.getById(req, res, next));
router.put('/:id', authorize('dishes.edit'), (req, res, next) => DishController.update(req, res, next));
router.delete('/:id', authorize('dishes.delete'), (req, res, next) => DishController.delete(req, res, next));
router.patch('/:id/status', authorize('dishes.edit'), (req, res, next) => DishController.changeStatus(req, res, next));
router.post('/:id/image', upload.single('imagen'), authorize('dishes.edit'), (req, res, next) => DishController.uploadImage(req, res, next));
router.delete('/:id/image', authorize('dishes.edit'), (req, res, next) => DishController.removeImage(req, res, next));

module.exports = router;