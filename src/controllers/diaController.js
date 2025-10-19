const { Dia } = require("../db/models");

const obtenerDias = async (_, res) => {
  const dias = await Dia.findAll();
  res.status(200).json(dias);
};

module.exports = {
  obtenerDias,
};