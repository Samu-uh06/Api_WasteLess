const CreateProductionOrder  = require('../../application/use-cases/CreateProductionOrder');
const GetProductionOrders    = require('../../application/use-cases/GetProductionOrders');
const SqlProductionOrderRepository = require('../../infrastructure/repository/SqlProductionOrderRepository');
const AppException = require('../../../../../shared/exceptions/AppException');
const {
  DayNotCompletedException,
  ProductionOrderAlreadyExistsException,
} = require('../../domain/exceptions/ProductionOrderExceptions');

const repo = new SqlProductionOrderRepository();

class ProductionOrderController {
  async create(req, res, next) {
    try {
      const { idPedido, diaSemana } = req.body;
      if (!idPedido || !diaSemana)
        throw new AppException('idPedido y diaSemana son requeridos', 400, 'VALIDATION_ERROR');

      const order = await new CreateProductionOrder(repo).execute({
        idPedido: parseInt(idPedido),
        diaSemana,
      });
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      if (err instanceof DayNotCompletedException || err instanceof ProductionOrderAlreadyExistsException) {
        return res.status(err.statusCode).json({ success: false, code: err.code, message: err.message });
      }
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const orders = await new GetProductionOrders(repo).execute();
      res.json({ success: true, data: orders });
    } catch (err) { next(err); }
  }
}

module.exports = new ProductionOrderController();