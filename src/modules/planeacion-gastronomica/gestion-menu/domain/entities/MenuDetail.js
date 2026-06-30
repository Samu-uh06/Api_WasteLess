class MenuDetail {
  constructor({ idDetalle, idMenu, diaSemana, tipoComida, idPlatillo, nombrePlatillo, precio, imagen }) {
    this.idDetalle = idDetalle;
    this.idMenu = idMenu;
    this.diaSemana = diaSemana;
    this.tipoComida = tipoComida;
    this.idPlatillo = idPlatillo;
    this.nombrePlatillo = nombrePlatillo;
    this.precio = precio;
    this.imagen = imagen;
  }
}

module.exports = MenuDetail;