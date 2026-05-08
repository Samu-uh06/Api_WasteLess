const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const verifyJWT = require('../../../../../shared/middleware/verifyJWT');

router.post('/login', AuthController.login);
router.post('/logout', verifyJWT, AuthController.logout);
router.post('/recover-password', AuthController.recoverPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/refresh-token', AuthController.refreshToken);
router.put('/profile', verifyJWT, AuthController.updateProfile);
router.get('/me', verifyJWT, AuthController.me);

module.exports = router;