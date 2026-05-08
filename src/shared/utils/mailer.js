const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT) || 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendRecoveryEmail = async (to, token) => {
  const link = `${process.env.APP_URL}/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Soporte" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Recuperación de contraseña',
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${link}">${link}</a>
      <p>Este enlace expira en 1 hora.</p>
    `,
  });
};

module.exports = { sendRecoveryEmail };