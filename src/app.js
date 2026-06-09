const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./shared/middleware/errorHandler');
const authRoutes = require('./modules/usuarios/gestion-acceso/interfaces/routes/authRoutes');
const userRoutes = require('./modules/usuarios/gestion-usuarios/interfaces/routes/userRoutes');
const roleRoutes = require('./modules/configuracion/roles/interfaces/routes/roleRoutes');
const dishRoutes = require('./modules/platillos/gestion-platillos/interfaces/routes/dishRoutes');
const companyRoutes = require('./modules/planeacion-gastronomica/gestion-empresas/interfaces/routes/companyRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/companies', companyRoutes);

app.use(errorHandler);

module.exports = app;