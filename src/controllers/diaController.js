const { Dia } = require("../db/models");

const crearDia = async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevoDia = await Dia.create({nombre});
    res.status(201).json(nuevoDia)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno al crear dia" });
  }
}

const obtenerDias = async (_, res) => {
  try {
    const dias = await Dia.findAll();
    res.status(200).json(dias);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno al obtener los días" });
  }
};

module.exports = {
  crearDia,
  obtenerDias,
};