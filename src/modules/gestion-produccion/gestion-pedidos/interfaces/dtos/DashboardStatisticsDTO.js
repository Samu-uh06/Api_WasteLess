function calcVariacion(actual, anterior) {
  const a = Number(actual) || 0;
  const b = Number(anterior) || 0;
  if (b === 0) return a > 0 ? 100 : 0;
  return Number((((a - b) / b) * 100).toFixed(1));
}

const DashboardStatisticsDTO = (stats) => {
  const { completado = 0, en_proceso = 0, pendiente = 0 } = stats.pedidosPorEstado || {};
  const totalPedidos = completado + en_proceso + pendiente;

  const impactoActual = Number(stats.impactoEconomico?.totalMesActual || 0);
  const impactoAnterior = Number(stats.impactoEconomico?.totalMesAnterior || 0);

  return {
    pedidos: {
      total: totalPedidos,
      completados: completado,
      enProceso: en_proceso,
      pendientes: pendiente,
      variacionPorcentual: calcVariacion(stats.pedidosMesActual, stats.pedidosMesAnterior),
    },
    impactoEconomico: {
      totalMesActual: impactoActual,
      totalMesAnterior: impactoAnterior,
      variacionPorcentual: calcVariacion(impactoActual, impactoAnterior),
    },
    ordenesProduccionHoy: (stats.ordenesProduccionHoy || []).map(o => ({
      idOrden: o.idOrden,
      codigo: o.codigo,
      diaSemana: o.diaSemana,
      estado: o.estado,
      nombreComedor: o.nombreComedor,
      nombreEmpresa: o.nombreEmpresa,
      cantPlatillos: o.cantPlatillos,
      fechaCreacion: o.fechaCreacion,
    })),
    topComedores: (stats.topComedores || []).map(c => ({
      idComedor: c.idComedor,
      nombreComedor: c.nombreComedor,
      nombreEmpresa: c.nombreEmpresa,
      totalPedidos: c.totalPedidos,
      facturacionTotal: Number(c.facturacionTotal || 0),
      variacionPorcentual: calcVariacion(c.facturacionMesActual, c.facturacionMesAnterior),
    })),
    totalFacturadoMes: impactoActual,
  };
};

module.exports = DashboardStatisticsDTO;