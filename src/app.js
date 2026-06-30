const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./shared/middleware/errorHandler');
const authRoutes = require('./modules/usuarios/gestion-acceso/interfaces/routes/authRoutes');
const userRoutes = require('./modules/usuarios/gestion-usuarios/interfaces/routes/userRoutes');
const roleRoutes = require('./modules/configuracion/roles/interfaces/routes/roleRoutes');
const dishRoutes = require('./modules/platillos/gestion-platillos/interfaces/routes/dishRoutes');
const companyRoutes = require('./modules/planeacion-gastronomica/gestion-empresas/interfaces/routes/companyRoutes');
const diningRoomRoutes = require('./modules/planeacion-gastronomica/gestion-comedores/interfaces/routes/diningRoomRoutes');
const menuRoutes = require('./modules/planeacion-gastronomica/gestion-menu/interfaces/routes/menuRoutes');
const orderRoutes = require('./modules/gestion-produccion/gestion-pedidos/interfaces/routes/orderRoutes');
const productionOrderRoutes = require('./modules/gestion-produccion/orden-produccion/interfaces/routes/productionOrderRoutes');


dotenv.config();

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/dining-rooms', diningRoomRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/production-orders', productionOrderRoutes);

app.get('/api/fix-deleted-roles', async (req, res) => {
  const { getConnection, sql } = require('./shared/database/sqlServerConnection');
  const pool = await getConnection();
  await pool.request().query(`
    UPDATE Roles 
    SET nombre = nombre + '_eliminado_' + CAST(idRol AS NVARCHAR(10))
    WHERE estado = 'eliminado'
  `);
});

app.use(errorHandler);

module.exports = app;