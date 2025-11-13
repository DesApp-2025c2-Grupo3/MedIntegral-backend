const { Provincia } = require("../db/models");

const obtenerProvincias = async (_, res) => {
  const provincias = await Provincia.findAll({
    order: [
      ["nombre", "ASC"],
    ]
  });
  res.status(200).json(provincias);
};

module.exports = {
  obtenerProvincias,
};
