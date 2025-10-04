const { Provincia } = require("../db/models");

//Obtiene todas las provincias disponibles desde el Endpoint: GET /api/provincias
const obtenerProvincias = async (_, res) => {
  try {
    const provincias = await Provincia.findAll();

    res.status(200).json(provincias);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Error interno al obtener la lista de provincias"});
  }
};

module.exports = {
  obtenerProvincias,
};
