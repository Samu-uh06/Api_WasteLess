const app = require('./app');
const { getConnection } = require('./shared/database/sqlServerConnection');
const { CREATE_TABLES, SEED_PERMISSIONS } = require('./modules/configuracion/roles/infrastructure/database/roleQueries');
const { CREATE_TABLE: CREATE_USERS_TABLE } = require('./modules/usuarios/gestion-usuarios/infrastructure/database/userQueries');
const { CREATE_TABLES: CREATE_AUTH_TABLES } = require('./modules/usuarios/gestion-acceso/infrastructure/database/authQueries');
const { CREATE_TABLES: CREATE_DISH_TABLES } = require('./modules/platillos/gestion-platillos/infrastructure/database/dishQueries');
const { CREATE_TABLES: CREATE_COMPANY_TABLES, SEED_CITIES } = require('./modules/planeacion-gastronomica/gestion-empresas/infrastructure/database/companyQueries');
const { CREATE_TABLES: CREATE_DINING_ROOM_TABLES } = require('./modules/planeacion-gastronomica/gestion-comedores/infrastructure/database/diningRoomQueries');
const { CREATE_TABLES: CREATE_MENU_TABLES } = require('./modules/planeacion-gastronomica/gestion-menu/infrastructure/database/menuQueries');
const { CREATE_TABLES: CREATE_ORDER_TABLES } = require('./modules/gestion-produccion/gestion-pedidos/infrastructure/database/orderQueries');
const { CREATE_TABLES: CREATE_PRODUCTION_ORDER_TABLES, SEED_PERMISSIONS: SEED_PRODUCTION_ORDER_PERMISSIONS } = require('./modules/gestion-produccion/orden-produccion/infrastructure/database/productionOrderQueries');

const logger = require('./shared/utils/logger');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    const pool = await getConnection();
    logger.info('Conexión a SQL Server establecida');

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

    await pool.request().query(CREATE_DINING_ROOM_TABLES);
    logger.info('✅ Tabla Comedores verificada');

    await pool.request().query(CREATE_MENU_TABLES);
    logger.info('✅ Tablas Menus y MenuDetalle verificadas');

    await pool.request().query(CREATE_ORDER_TABLES);
    logger.info('✅ Tablas Pedidos y PedidoDetalle verificadas');

    await pool.request().query(CREATE_PRODUCTION_ORDER_TABLES);
    logger.info('✅ Tabla OrdenesProduccion verificada');

    await pool.request().query(SEED_PRODUCTION_ORDER_PERMISSIONS);
    logger.info('✅ Permisos de Órdenes de Producción verificados');
    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('Error al iniciar el servidor', { message: err.message, stack: err.stack });
    process.exit(1);
  }
};

start();