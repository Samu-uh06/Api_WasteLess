const { getConnection, sql } = require('../../../../../shared/database/sqlServerConnection');
const DishRepository = require('../../domain/interfaces/DishRepository');
const Dish = require('../../domain/entities/Dish');
const DishCategory = require('../../domain/entities/DishCategory');

class SqlDishRepository extends DishRepository {
  // ==================== CATEGORIAS ====================
  async createCategory(data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombre', sql.NVarChar(100), data.nombre)
      .input('descripcion', sql.NVarChar(300), data.descripcion || null)
      .query(`
        INSERT INTO CategoriasPlatillo (nombre, descripcion)
        OUTPUT INSERTED.*
        VALUES (@nombre, @descripcion)
      `);
    return new DishCategory(result.recordset[0]);
  }

  async updateCategory(idCategoria, data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idCategoria', sql.Int, idCategoria)
      .input('nombre', sql.NVarChar(100), data.nombre)
      .input('descripcion', sql.NVarChar(300), data.descripcion || null)
      .query(`
        UPDATE CategoriasPlatillo SET
          nombre = @nombre,
          descripcion = @descripcion,
          fechaActualizacion = GETDATE()
        OUTPUT INSERTED.*
        WHERE idCategoria = @idCategoria
      `);
    return result.recordset[0] ? new DishCategory(result.recordset[0]) : null;
  }

  async deleteCategory(idCategoria) {
    const pool = await getConnection();
    await pool.request()
      .input('idCategoria', sql.Int, idCategoria)
      .query(`
        UPDATE CategoriasPlatillo SET estado = 'eliminado', fechaActualizacion = GETDATE()
        WHERE idCategoria = @idCategoria
      `);
  }

  async getCategoryById(idCategoria) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idCategoria', sql.Int, idCategoria)
      .query(`SELECT * FROM CategoriasPlatillo WHERE idCategoria = @idCategoria AND estado != 'eliminado'`);
    return result.recordset[0] ? new DishCategory(result.recordset[0]) : null;
  }

  async getAllCategories() {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`SELECT * FROM CategoriasPlatillo WHERE estado != 'eliminado' ORDER BY nombre ASC`);
    return result.recordset.map(r => new DishCategory(r));
  }

  async findCategoryByName(nombre) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombre', sql.NVarChar(100), nombre)
      .query(`SELECT * FROM CategoriasPlatillo WHERE nombre = @nombre AND estado != 'eliminado'`);
    return result.recordset[0] ? new DishCategory(result.recordset[0]) : null;
  }

  // ==================== PLATILLOS ====================
  async createDish(data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombre', sql.NVarChar(150), data.nombre)
      .input('descripcion', sql.NVarChar(500), data.descripcion || null)
      .input('precio', sql.Decimal(10, 2), data.precio)
      .input('calorias', sql.Decimal(10, 2), data.calorias || null)
      .input('proteinas', sql.Decimal(10, 2), data.proteinas || null)
      .input('carbohidratos', sql.Decimal(10, 2), data.carbohidratos || null)
      .input('grasas', sql.Decimal(10, 2), data.grasas || null)
      .input('imagen', sql.NVarChar(500), data.imagen || null)
      .input('idCategoria', sql.Int, data.idCategoria)
      .query(`
        INSERT INTO Platillos (nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, imagen, idCategoria)
        OUTPUT INSERTED.*
        VALUES (@nombre, @descripcion, @precio, @calorias, @proteinas, @carbohidratos, @grasas, @imagen, @idCategoria)
      `);
    return new Dish(result.recordset[0]);
  }

  async updateDish(idPlatillo, data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idPlatillo', sql.Int, idPlatillo)
      .input('nombre', sql.NVarChar(150), data.nombre)
      .input('descripcion', sql.NVarChar(500), data.descripcion || null)
      .input('precio', sql.Decimal(10, 2), data.precio)
      .input('calorias', sql.Decimal(10, 2), data.calorias || null)
      .input('proteinas', sql.Decimal(10, 2), data.proteinas || null)
      .input('carbohidratos', sql.Decimal(10, 2), data.carbohidratos || null)
      .input('grasas', sql.Decimal(10, 2), data.grasas || null)
      .input('idCategoria', sql.Int, data.idCategoria)
      .query(`
        UPDATE Platillos SET
          nombre = @nombre, descripcion = @descripcion, precio = @precio,
          calorias = @calorias, proteinas = @proteinas, carbohidratos = @carbohidratos,
          grasas = @grasas, idCategoria = @idCategoria, fechaActualizacion = GETDATE()
        OUTPUT INSERTED.*
        WHERE idPlatillo = @idPlatillo
      `);
    return result.recordset[0] ? new Dish(result.recordset[0]) : null;
  }

  async deleteDish(idPlatillo) {
    const pool = await getConnection();
    await pool.request()
      .input('idPlatillo', sql.Int, idPlatillo)
      .query(`UPDATE Platillos SET estado = 'eliminado', fechaActualizacion = GETDATE() WHERE idPlatillo = @idPlatillo`);
  }

  async getDishById(idPlatillo) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idPlatillo', sql.Int, idPlatillo)
      .query(`
        SELECT p.*, c.nombre AS nombreCategoria
        FROM Platillos p
        LEFT JOIN CategoriasPlatillo c ON p.idCategoria = c.idCategoria
        WHERE p.idPlatillo = @idPlatillo AND p.estado != 'eliminado'
      `);
    return result.recordset[0] ? new Dish(result.recordset[0]) : null;
  }

  async getAllDishes({ page = 1, limit = 10, orderBy = 'fechaCreacion', orderDir = 'DESC', idCategoria }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const request = pool.request()
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset);

    let filter = `WHERE p.estado != 'eliminado'`;
    if (idCategoria) {
      request.input('idCategoria', sql.Int, idCategoria);
      filter += ` AND p.idCategoria = @idCategoria`;
    }

    const result = await request.query(`
      SELECT p.*, c.nombre AS nombreCategoria, COUNT(*) OVER() AS totalRegistros
      FROM Platillos p
      LEFT JOIN CategoriasPlatillo c ON p.idCategoria = c.idCategoria
      ${filter}
      ORDER BY p.${orderBy} ${orderDir}
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return {
      data: result.recordset.map(r => new Dish(r)),
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async searchDishes({ search = '', idCategoria, estado, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const request = pool.request()
      .input('search', sql.NVarChar(200), `%${search}%`)
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset);

    let filter = `WHERE p.estado != 'eliminado' AND (p.nombre LIKE @search OR p.descripcion LIKE @search)`;

    if (idCategoria) {
      request.input('idCategoria', sql.Int, idCategoria);
      filter += ` AND p.idCategoria = @idCategoria`;
    }
    if (estado) {
      request.input('estado', sql.NVarChar(20), estado);
      filter += ` AND p.estado = @estado`;
    }

    const result = await request.query(`
      SELECT p.*, c.nombre AS nombreCategoria, COUNT(*) OVER() AS totalRegistros
      FROM Platillos p
      LEFT JOIN CategoriasPlatillo c ON p.idCategoria = c.idCategoria
      ${filter}
      ORDER BY p.fechaCreacion DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return {
      data: result.recordset.map(r => new Dish(r)),
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async changeDishStatus(idPlatillo, estado) {
    const pool = await getConnection();
    await pool.request()
      .input('idPlatillo', sql.Int, idPlatillo)
      .input('estado', sql.NVarChar(20), estado)
      .query(`UPDATE Platillos SET estado = @estado, fechaActualizacion = GETDATE() WHERE idPlatillo = @idPlatillo`);
  }

  async updateDishImage(idPlatillo, imagen) {
    const pool = await getConnection();
    await pool.request()
      .input('idPlatillo', sql.Int, idPlatillo)
      .input('imagen', sql.NVarChar(500), imagen)
      .query(`UPDATE Platillos SET imagen = @imagen, fechaActualizacion = GETDATE() WHERE idPlatillo = @idPlatillo`);
  }

  async removeDishImage(idPlatillo) {
    const pool = await getConnection();
    await pool.request()
      .input('idPlatillo', sql.Int, idPlatillo)
      .query(`UPDATE Platillos SET imagen = NULL, fechaActualizacion = GETDATE() WHERE idPlatillo = @idPlatillo`);
  }

  async getDishStatistics() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN p.estado = 'activo' THEN 1 ELSE 0 END) AS activos,
        SUM(CASE WHEN p.estado = 'inactivo' THEN 1 ELSE 0 END) AS inactivos,
        (SELECT COUNT(*) FROM CategoriasPlatillo WHERE estado != 'eliminado') AS totalCategorias
      FROM Platillos p
      WHERE p.estado != 'eliminado'
    `);
    return result.recordset[0];
  }

  async findByName(nombre) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombre', sql.NVarChar(150), nombre)
      .query(`SELECT * FROM Platillos WHERE nombre = @nombre AND estado != 'eliminado'`);
    return result.recordset[0] ? new Dish(result.recordset[0]) : null;
  }
}

module.exports = SqlDishRepository;