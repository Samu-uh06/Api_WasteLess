const app = require('./app');
const { getConnection } = require('./shared/database/sqlServerConnection');
const { CREATE_TABLES, SEED_PERMISSIONS } = require('./modules/configuracion/roles/infrastructure/database/roleQueries');
const { CREATE_TABLE: CREATE_USERS_TABLE } = require('./modules/usuarios/gestion-usuarios/infrastructure/database/userQueries');
const { CREATE_TABLES: CREATE_AUTH_TABLES } = require('./modules/usuarios/gestion-acceso/infrastructure/database/authQueries');
const { CREATE_TABLES: CREATE_DISH_TABLES } = require('./modules/platillos/gestion-platillos/infrastructure/database/dishQueries');
const { CREATE_TABLES: CREATE_COMPANY_TABLES, SEED_CITIES } = require('./modules/planeacion-gastronomica/gestion-empresas/infrastructure/database/companyQueries');
const logger = require('./shared/utils/logger');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    const pool = await getConnection();
    logger.info('Conexión a SQL Server establecida');

    // Crear tablas en orden correcto (Roles primero por FK con Usuarios)
    await pool.request().query(CREATE_TABLES);
    logger.info('Tablas Roles, Permisos y RolPermiso verificadas');

    await pool.request().query(SEED_PERMISSIONS);
    logger.info('Permisos base verificados');

    await pool.request().query(CREATE_USERS_TABLE);
    logger.info('Tabla Usuarios verificada');

    await pool.request().query(CREATE_AUTH_TABLES);
    logger.info('Tablas Sesiones y RecuperacionPassword verificadas');

    await pool.request().query(CREATE_DISH_TABLES);
    logger.info('Tablas CategoriasPlatillo y Platillos verificadas');

    await pool.request().query(CREATE_COMPANY_TABLES);
    logger.info('✅ Tablas Ciudades y Empresas verificadas');

    await pool.request().query(SEED_CITIES);
    logger.info('✅ Ciudades base verificadas');

    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('Error al iniciar el servidor', { message: err.message, stack: err.stack });
    process.exit(1);
  }
};

start();