const { SituacionTerapeutica } = require("../db/models");

const obtenerSituacionesTerapeuticas = async (_, res) => {
  const situaciones = await SituacionTerapeutica.findAll();
  res.status(200).json(situaciones);
};

module.exports = {
  obtenerSituacionesTerapeuticas,
};
