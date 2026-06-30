const DashboardStatisticsDTO = (stats) => ({
  totalEmpresas: stats.totalEmpresas || 0,
  totalComedores: stats.totalComedores || 0,
  totalSemanas: stats.totalSemanas || 0,
});

module.exports = DashboardStatisticsDTO;