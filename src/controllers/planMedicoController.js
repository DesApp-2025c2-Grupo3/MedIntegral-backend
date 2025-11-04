const { PlanMedico } = require("../db/models");

const obtenerPlanesMedicos = async (_, res) => {
  const planesMedicos = await PlanMedico.findAll();
  res.status(200).json(planesMedicos);
};

module.exports = {
  obtenerPlanesMedicos,
};
