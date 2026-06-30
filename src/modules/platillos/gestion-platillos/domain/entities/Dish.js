class Dish {
  constructor({
    idPlatillo, nombre, descripcion, precio, calorias, proteinas,
    carbohidratos, grasas, imagen, idCategoria, nombreCategoria,
    estado, fechaCreacion, fechaActualizacion, Bebida
  }) {
    this.idPlatillo = idPlatillo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.calorias = calorias;
    this.proteinas = proteinas;
    this.carbohidratos = carbohidratos;
    this.grasas = grasas;
    this.imagen = imagen;
    this.idCategoria = idCategoria;
    this.nombreCategoria = nombreCategoria;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.fechaActualizacion = fechaActualizacion;
    this.bebida = Bebida === true || Bebida === 1;
  }

  isActive() {
    return this.estado === 'activo';
  }
}

module.exports = Dish;