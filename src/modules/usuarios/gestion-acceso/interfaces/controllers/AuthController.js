const LoginUser = require('../../application/use-cases/LoginUser');
const LogoutUser = require('../../application/use-cases/LogoutUser');
const RecoverPassword = require('../../application/use-cases/RecoverPassword');
const ResetPassword = require('../../application/use-cases/ResetPassword');
const RefreshToken = require('../../application/use-cases/RefreshToken');
const UpdateProfile = require('../../application/use-cases/UpdateProfile');
const SqlAuthRepository = require('../../infrastructure/repository/SqlAuthRepository');

const LoginDTO = require('../dtos/LoginDTO');
const ResetPasswordDTO = require('../dtos/ResetPasswordDTO');
const UpdateProfileDTO = require('../dtos/UpdateProfileDTO');

const AppException = require('../../../../../shared/exceptions/AppException');

const repo = new SqlAuthRepository();

class AuthController {
 async login(req, res, next) {
  try {
    const { error, value } = LoginDTO.validate(req.body);
    if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

    const ip = req.ip;
    const dispositivo = req.headers['user-agent'] || 'desconocido';

    const result = await new LoginUser(repo).execute({ ...value, ip, dispositivo });

    res.json({ 
      success: true, 
      data: {
        token: result.token,
        refreshToken: result.refreshToken,
        idSesion: result.session?.idSesion || null,
        user: result.user
      }
    });
  } catch (err) { next(err); }
}

  async logout(req, res, next) {
    try {
      const { idSesion } = req.body;
      await new LogoutUser(repo).execute({ idSesion, idUsuario: req.user.idUsuario });
      res.json({ success: true, message: 'Sesión cerrada' });
    } catch (err) { next(err); }
  }

  async recoverPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await new RecoverPassword(repo).execute({ email });
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async resetPassword(req, res, next) {
    try {
      const { error, value } = ResetPasswordDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const result = await new ResetPassword(repo).execute(value);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await new RefreshToken(repo).execute({ refreshToken });
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async updateProfile(req, res, next) {
    try {
      const { error, value } = UpdateProfileDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const result = await new UpdateProfile(repo).execute({ idUsuario: req.user.idUsuario, ...value });
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async me(req, res) {
    res.json({ success: true, data: req.user });
  }
}

module.exports = new AuthController();