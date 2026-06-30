const { MenuNotFoundException } = require('../../domain/exceptions/MenuExceptions');

class GetMenuPlanning {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  async execute(idMenu) {
    const menu = await this.menuRepository.getMenuById(idMenu);
    if (!menu) throw new MenuNotFoundException();

    const planning = await this.menuRepository.getMenuPlanning(idMenu);

    // Organizar por día y tipo de comida
    const organized = {};
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const mealTypes = ['Desayuno', 'Almuerzo', 'Media tarde'];

    days.forEach(day => {
      organized[day] = {};
      mealTypes.forEach(meal => {
        organized[day][meal] = planning.filter(
          p => p.diaSemana === day && p.tipoComida === meal
        );
      });
    });

    return { menu, planning: organized };
  }
}

module.exports = GetMenuPlanning;