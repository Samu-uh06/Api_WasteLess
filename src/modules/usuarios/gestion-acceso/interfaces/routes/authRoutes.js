const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const verifyJWT = require('../../../../../shared/middleware/verifyJWT');

router.post('/login', (req, res, next) => AuthController.login(req, res, next));
router.post('/logout', verifyJWT, (req, res, next) => AuthController.logout(req, res, next));
router.post('/recover-password', (req, res, next) => AuthController.recoverPassword(req, res, next));
router.post('/reset-password', (req, res, next) => AuthController.resetPassword(req, res, next));
router.post('/refresh-token', (req, res, next) => AuthController.refreshToken(req, res, next));
router.put('/profile', verifyJWT, (req, res, next) => AuthController.updateProfile(req, res, next));
router.get('/me', verifyJWT, (req, res, next) => AuthController.me(req, res, next));

module.exports = router;