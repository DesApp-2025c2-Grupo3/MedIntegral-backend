const { Dia } = require("../db/models");

const crearDia = async (req, res) => {
  try {
    const { dia } = req.body;
    const nuevoDia = await Dia.create({dia});
    res.status(201).json(nuevoDia)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno al crear dia" });
  }
}

const obtenerDias = async (_, res) => {
  try {
    res.status(200).json(diasDeLaSemana);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno al obtener la lista de días" });
  }
};

module.exports = {
  createDia,
  obtenerDias,
};