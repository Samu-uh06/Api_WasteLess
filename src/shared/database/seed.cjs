const { getConnection, sql } = require('./sqlServerConnection');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    const pool = await getConnection();

    const rolExiste = await pool.request()
      .query(`SELECT * FROM Roles WHERE nombre = 'Administrador'`);

    let idRol;
    if (rolExiste.recordset.length === 0) {
      const rol = await pool.request()
        .input('nombre', sql.NVarChar, 'Administrador')
        .input('descripcion', sql.NVarChar, 'Rol con acceso total')
        .query(`
          INSERT INTO Roles (nombre, descripcion)
          OUTPUT INSERTED.idRol
          VALUES (@nombre, @descripcion)
        `);
      idRol = rol.recordset[0].idRol;
      console.log('Rol Administrador creado');
    } else {
      idRol = rolExiste.recordset[0].idRol;
      console.log('Rol Administrador ya existe');
    }

    const newPermisos = [
      { nombre: 'Ver platillos', codigo: 'dishes.view', descripcion: 'Permite ver platillos' },
      { nombre: 'Crear platillos', codigo: 'dishes.create', descripcion: 'Permite crear platillos' },
      { nombre: 'Editar platillos', codigo: 'dishes.edit', descripcion: 'Permite editar platillos' },
      { nombre: 'Eliminar platillos', codigo: 'dishes.delete', descripcion: 'Permite eliminar platillos' },
    ];

    for (const permiso of newPermisos) {
      const existe = await pool.request()
        .input('codigo', sql.NVarChar, permiso.codigo)
        .query(`SELECT * FROM Permisos WHERE codigo = @codigo`);

      if (existe.recordset.length === 0) {
        await pool.request()
          .input('nombre', sql.NVarChar, permiso.nombre)
          .input('codigo', sql.NVarChar, permiso.codigo)
          .input('descripcion', sql.NVarChar, permiso.descripcion)
          .query(`INSERT INTO Permisos (nombre, codigo, descripcion) VALUES (@nombre, @codigo, @descripcion)`);
      }
    }
    console.log('Permisos de platillos verificados');

    const permisosEmpresas = [
      { nombre: 'Ver empresas', codigo: 'companies.view', descripcion: 'Permite ver empresas' },
      { nombre: 'Crear empresas', codigo: 'companies.create', descripcion: 'Permite crear empresas' },
      { nombre: 'Editar empresas', codigo: 'companies.edit', descripcion: 'Permite editar empresas' },
      { nombre: 'Eliminar empresas', codigo: 'companies.delete', descripcion: 'Permite eliminar empresas' },
    ];

    for (const permiso of permisosEmpresas) {
      const existe = await pool.request()
        .input('codigo', sql.NVarChar, permiso.codigo)
        .query(`SELECT * FROM Permisos WHERE codigo = @codigo`);

      if (existe.recordset.length === 0) {
        await pool.request()
          .input('nombre', sql.NVarChar, permiso.nombre)
          .input('codigo', sql.NVarChar, permiso.codigo)
          .input('descripcion', sql.NVarChar, permiso.descripcion)
          .query(`INSERT INTO Permisos (nombre, codigo, descripcion) VALUES (@nombre, @codigo, @descripcion)`);
      }
    }
    console.log('Permisos de empresas verificados');

    const permisosComedores = [
  { nombre: 'Ver comedores', codigo: 'diningRooms.view', descripcion: 'Permite ver comedores' },
  { nombre: 'Crear comedores', codigo: 'diningRooms.create', descripcion: 'Permite crear comedores' },
  { nombre: 'Editar comedores', codigo: 'diningRooms.edit', descripcion: 'Permite editar comedores' },
  { nombre: 'Eliminar comedores', codigo: 'diningRooms.delete', descripcion: 'Permite eliminar comedores' },
];

    for (const permiso of permisosComedores) {
      const existe = await pool.request()
        .input('codigo', sql.NVarChar, permiso.codigo)
        .query(`SELECT * FROM Permisos WHERE codigo = @codigo`);

      if (existe.recordset.length === 0) {
        await pool.request()
          .input('nombre', sql.NVarChar, permiso.nombre)
          .input('codigo', sql.NVarChar, permiso.codigo)
          .input('descripcion', sql.NVarChar, permiso.descripcion)
          .query(`INSERT INTO Permisos (nombre, codigo, descripcion) VALUES (@nombre, @codigo, @descripcion)`);
      }
    }
    console.log('✅ Permisos de comedores verificados');


        const permisosMenus = [
      { nombre: 'Ver menús', codigo: 'menus.view', descripcion: 'Permite ver menús' },
      { nombre: 'Crear menús', codigo: 'menus.create', descripcion: 'Permite crear menús' },
      { nombre: 'Editar menús', codigo: 'menus.edit', descripcion: 'Permite editar menús' },
      { nombre: 'Eliminar menús', codigo: 'menus.delete', descripcion: 'Permite eliminar menús' },
    ];

    for (const permiso of permisosMenus) {
      const existe = await pool.request()
        .input('codigo', sql.NVarChar, permiso.codigo)
        .query(`SELECT * FROM Permisos WHERE codigo = @codigo`);

      if (existe.recordset.length === 0) {
        await pool.request()
          .input('nombre', sql.NVarChar, permiso.nombre)
          .input('codigo', sql.NVarChar, permiso.codigo)
          .input('descripcion', sql.NVarChar, permiso.descripcion)
          .query(`INSERT INTO Permisos (nombre, codigo, descripcion) VALUES (@nombre, @codigo, @descripcion)`);
      }
    }
    console.log('✅ Permisos de menús verificados');

        const permisosPedidos = [
      { nombre: 'Ver pedidos', codigo: 'orders.view', descripcion: 'Permite ver pedidos' },
      { nombre: 'Editar pedidos', codigo: 'orders.edit', descripcion: 'Permite editar pedidos' },
      { nombre: 'Actualizar estado de producción', codigo: 'orders.update-status', descripcion: 'Permite actualizar el estado de producción de las comidas' },
    ];

    for (const permiso of permisosPedidos) {
      const existe = await pool.request()
        .input('codigo', sql.NVarChar, permiso.codigo)
        .query(`SELECT * FROM Permisos WHERE codigo = @codigo`);

      if (existe.recordset.length === 0) {
        await pool.request()
          .input('nombre', sql.NVarChar, permiso.nombre)
          .input('codigo', sql.NVarChar, permiso.codigo)
          .input('descripcion', sql.NVarChar, permiso.descripcion)
          .query(`INSERT INTO Permisos (nombre, codigo, descripcion) VALUES (@nombre, @codigo, @descripcion)`);
      }
    }
    console.log('✅ Permisos de pedidos verificados');

    const permisosOrdenesProduccion = [
      { nombre: 'Ver órdenes de producción', codigo: 'production-orders.view', descripcion: 'Permite ver el listado de órdenes de producción' },
      { nombre: 'Crear órdenes de producción', codigo: 'production-orders.create', descripcion: 'Permite pasar pedidos completados a producción' },
    ];

    for (const permiso of permisosOrdenesProduccion) {
      const existe = await pool.request()
        .input('codigo', sql.NVarChar, permiso.codigo)
        .query(`SELECT * FROM Permisos WHERE codigo = @codigo`);

      if (existe.recordset.length === 0) {
        await pool.request()
          .input('nombre', sql.NVarChar, permiso.nombre)
          .input('codigo', sql.NVarChar, permiso.codigo)
          .input('descripcion', sql.NVarChar, permiso.descripcion)
          .query(`INSERT INTO Permisos (nombre, codigo, descripcion) VALUES (@nombre, @codigo, @descripcion)`);
      }
    }
    console.log('✅ Permisos de órdenes de producción verificados');

    const permisos = await pool.request().query(`SELECT idPermiso FROM Permisos`);
    for (const p of permisos.recordset) {
      const existe = await pool.request()
        .input('idRol', sql.Int, idRol)
        .input('idPermiso', sql.Int, p.idPermiso)
        .query(`SELECT * FROM RolPermiso WHERE idRol = @idRol AND idPermiso = @idPermiso`);

      if (existe.recordset.length === 0) {
        await pool.request()
          .input('idRol', sql.Int, idRol)
          .input('idPermiso', sql.Int, p.idPermiso)
          .query(`INSERT INTO RolPermiso (idRol, idPermiso) VALUES (@idRol, @idPermiso)`);
      }
    }
    console.log('Permisos asignados al Administrador');

    const usuarioExiste = await pool.request()
      .input('email', sql.NVarChar, 'admin@wasteless.com')
      .query(`SELECT * FROM Usuarios WHERE email = @email`);

    if (usuarioExiste.recordset.length === 0) {
      const hash = await bcrypt.hash('Admin1234', 10);
      await pool.request()
        .input('nombres', sql.NVarChar, 'Super')
        .input('apellidos', sql.NVarChar, 'Admin')
        .input('tipoDocumento', sql.NVarChar, 'CC')
        .input('numeroDocumento', sql.NVarChar, '0000000000')
        .input('email', sql.NVarChar, 'admin@wasteless.com')
        .input('password', sql.NVarChar, hash)
        .input('idRol', sql.Int, idRol)
        .query(`
          INSERT INTO Usuarios (nombres, apellidos, tipoDocumento, numeroDocumento, email, password, idRol)
          VALUES (@nombres, @apellidos, @tipoDocumento, @numeroDocumento, @email, @password, @idRol)
        `);
      console.log('Usuario admin creado');
      console.log('Email: admin@wasteless.com');
      console.log('Password: Admin1234');
    } else {
      console.log('Usuario admin ya existe');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error en seed:', err.message);
    process.exit(1);
  }
};

seed();