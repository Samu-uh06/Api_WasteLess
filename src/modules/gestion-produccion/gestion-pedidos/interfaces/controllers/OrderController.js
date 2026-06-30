const GetCompanies = require('../../application/use-cases/GetCompanies');
const GetDiningRooms = require('../../application/use-cases/GetDiningRooms');
const GetWeeks = require('../../application/use-cases/GetWeeks');
const GetOrderDetail = require('../../application/use-cases/GetOrderDetail');
const UpdateMealStatus = require('../../application/use-cases/UpdateMealStatus');
const GetDashboardStatistics = require('../../application/use-cases/GetDashboardStatistics');
const CreateOrder = require('../../application/use-cases/CreateOrder');

const SqlOrderRepository = require('../../infrastructure/repository/SqlOrderRepository');
const SqlMenuRepository = require('../../../../planeacion-gastronomica/gestion-menu/infrastructure/repository/SqlMenuRepository');

const UpdateMealStatusDTO = require('../dtos/UpdateMealStatusDTO');
const CreateOrderDTO = require('../dtos/CreateOrderDTO');
const OrderResponseDTO = require('../dtos/OrderResponseDTO');
const OrderDetailDTO = require('../dtos/OrderDetailDTO');
const MealDetailDTO = require('../dtos/MealDetailDTO');
const DashboardStatisticsDTO = require('../dtos/DashboardStatisticsDTO');
const AppException = require('../../../../../shared/exceptions/AppException');

const repo = new SqlOrderRepository();
const menuRepo = new SqlMenuRepository();

class OrderController {
  async create(req, res, next) {
    try {
      const { error, value } = CreateOrderDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const order = await new CreateOrder(repo, menuRepo).execute(value);
      res.status(201).json({ success: true, data: OrderResponseDTO(order) });
    } catch (err) { next(err); }
  }

  async dashboard(req, res, next) {
    try {
      const stats = await new GetDashboardStatistics(repo).execute();
      res.json({ success: true, data: DashboardStatisticsDTO(stats) });
    } catch (err) { next(err); }
  }

  async getCompanies(req, res, next) {
    try {
      const companies = await new GetCompanies(repo).execute();
      res.json({ success: true, data: companies });
    } catch (err) { next(err); }
  }

  async getDiningRoomsByCompany(req, res, next) {
    try {
      const diningRooms = await new GetDiningRooms(repo).execute(+req.params.companyId);
      res.json({ success: true, data: diningRooms });
    } catch (err) { next(err); }
  }

  async getWeeksByDiningRoom(req, res, next) {
    try {
      const weeks = await new GetWeeks(repo).execute(+req.params.diningRoomId);
      res.json({ success: true, data: weeks });
    } catch (err) { next(err); }
  }

  async getWeekDetail(req, res, next) {
    try {
      const result = await new GetOrderDetail(repo).execute(+req.params.weekId);
      res.json({ success: true, data: OrderDetailDTO(result) });
    } catch (err) { next(err); }
  }

  async updateMealStatus(req, res, next) {
    try {
      const { error, value } = UpdateMealStatusDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const updated = await new UpdateMealStatus(repo).execute(+req.params.detailId, value.estadoProduccion);
      res.json({ success: true, data: MealDetailDTO(updated) });
    } catch (err) { next(err); }
  }

  async statistics(req, res, next) {
    try {
      const stats = await new GetDashboardStatistics(repo).execute();
      res.json({ success: true, data: DashboardStatisticsDTO(stats) });
    } catch (err) { next(err); }
  }
}

module.exports = new OrderController();