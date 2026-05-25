const DishResponseDTO = (dish) => ({
  idPlatillo: dish.idPlatillo,
  nombre: dish.nombre,
  descripcion: dish.descripcion,
  precio: dish.precio,
  informacionNutricional: {
    calorias: dish.calorias,
    proteinas: dish.proteinas,
    carbohidratos: dish.carbohidratos,
    grasas: dish.grasas,
  },
  imagen: dish.imagen,
  idCategoria: dish.idCategoria,
  nombreCategoria: dish.nombreCategoria,
  estado: dish.estado,
  fechaCreacion: dish.fechaCreacion,
  fechaActualizacion: dish.fechaActualizacion,
});

module.exports = DishResponseDTO;