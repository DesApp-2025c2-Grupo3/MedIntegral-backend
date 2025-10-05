const { Especialidad } = require("../db/models");

const crearEspecialidad = async (req, res) =>{
  try {
    const { especialidad } = req.body;
    const nuevaEspecialidad = await Especialidad.create({ especialidad })
    res.status(201).json(nuevaEspecialidad)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      error: "Error interno al crear especialidade" 
    });
  }
}

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
  crearEspecialidad,
  obtenerEspecialidades,
};