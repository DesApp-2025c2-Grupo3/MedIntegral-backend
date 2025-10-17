const { Especialidad } = require("../db/models");

const obtenerEspecialidades = async (_, res) => {
  const especialidades = await Especialidad.findAll();
  res.status(200).json(especialidades);
};

module.exports = {
  obtenerEspecialidades,
};