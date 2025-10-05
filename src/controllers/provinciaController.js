const { Provincia } = require("../db/models");

const crearProvincia = async (req, res) => {
  try {
    const { provincia } = req.body;
    const nuevaProvincia = await Provincia.create({ provincia });
    res.status(201).json(nuevaProvincia);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Error al crear provincia" });
  }
};

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
