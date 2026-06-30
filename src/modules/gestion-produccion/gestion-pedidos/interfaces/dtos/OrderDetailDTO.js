const OrderResponseDTO = require('./OrderResponseDTO');
const MealDetailDTO = require('./MealDetailDTO');

const OrderDetailDTO = ({ order, planning }) => {
  const formattedPlanning = {};
  Object.entries(planning).forEach(([dia, comidas]) => {
    formattedPlanning[dia] = {};
    Object.entries(comidas).forEach(([tipoComida, items]) => {
      formattedPlanning[dia][tipoComida] = items.map(MealDetailDTO);
    });
  });

  return {
    order: OrderResponseDTO(order),
    planning: formattedPlanning,
  };
};

module.exports = OrderDetailDTO;