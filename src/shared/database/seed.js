const { getConnection, sql } = require('./sqlServerConnection');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    const pool = await getConnection();

    // Crear rol administrador si no existe
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

    // Asignar todos los permisos al rol administrador
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

    // Crear usuario admin si no existe
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
      console.log('✅ Permisos de empresas verificados');

seed();