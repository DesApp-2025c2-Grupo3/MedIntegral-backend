const { Especialidad } = require("../db/models");

//Obtenemos todas las especialidades desde el Endpoint: GET /api/especialidades
const obtenerEspecialidades = async (_, res) => {
  try {
    const especialidades = await Especialidad.findAll();

    res.status(200).json(especialidades);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      error: "Error interno al obtener la lista de especialidades" 
    });
  }
};

module.exports = {
  obtenerEspecialidades,
};