const { MenuNotFoundException, InvalidDishException, InvalidDayException, InvalidMealTypeException } = require('../../domain/exceptions/MenuExceptions');
const logger = require('../../../../../shared/utils/logger');

const VALID_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const VALID_MEAL_TYPES = ['Desayuno', 'Almuerzo', 'Media tarde'];

class AssignDishToMenu {
  constructor(menuRepository, dishRepository) {
    this.menuRepository = menuRepository;
    this.dishRepository = dishRepository;
  }

  async execute(idMenu, { diaSemana, tipoComida, idPlatillo }) {
    const menu = await this.menuRepository.getMenuById(idMenu);
    if (!menu) throw new MenuNotFoundException();

    if (!VALID_DAYS.includes(diaSemana)) throw new InvalidDayException();
    if (!VALID_MEAL_TYPES.includes(tipoComida)) throw new InvalidMealTypeException();

    const dish = await this.dishRepository.getDishById(idPlatillo);
    if (!dish) throw new InvalidDishException();

    const detail = await this.menuRepository.assignDishToMenu(idMenu, { diaSemana, tipoComida, idPlatillo });

    logger.info({ action: 'ASSIGN_DISH_TO_MENU', idMenu, idPlatillo, diaSemana, tipoComida });

    return detail;
  }
}

module.exports = AssignDishToMenu;