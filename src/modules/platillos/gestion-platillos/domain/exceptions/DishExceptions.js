const AppException = require('../../../../../shared/exceptions/AppException');

class DishNotFoundException extends AppException {
  constructor() {
    super('Platillo no encontrado', 404, 'DISH_NOT_FOUND');
  }
}

class DishNameDuplicatedException extends AppException {
  constructor() {
    super('Ya existe un platillo con ese nombre', 409, 'DISH_NAME_DUPLICATED');
  }
}

class InvalidCategoryException extends AppException {
  constructor() {
    super('La categoría especificada no existe', 400, 'INVALID_CATEGORY');
  }
}

class InvalidImageException extends AppException {
  constructor() {
    super('Formato de imagen no permitido. Use JPG, JPEG o PNG', 400, 'INVALID_IMAGE');
  }
}

class ImageTooLargeException extends AppException {
  constructor() {
    super('La imagen no puede superar los 5MB', 400, 'IMAGE_TOO_LARGE');
  }
}

class CategoryNotFoundException extends AppException {
  constructor() {
    super('Categoría no encontrada', 404, 'CATEGORY_NOT_FOUND');
  }
}

class CategoryNameDuplicatedException extends AppException {
  constructor() {
    super('Ya existe una categoría con ese nombre', 409, 'CATEGORY_NAME_DUPLICATED');
  }
}

module.exports = {
  DishNotFoundException,
  DishNameDuplicatedException,
  InvalidCategoryException,
  InvalidImageException,
  ImageTooLargeException,
  CategoryNotFoundException,
  CategoryNameDuplicatedException,
};