const { Telefono } = require("../db/models");

const crearTelefono = async (req, res) => {
  try {
    const { telefono } = req.body;
    const nuevoTelefono = await Telefono.create({ telefono });
    res.status(201).json(nuevoTelefono);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Error al crear teléfono" });
  }
};

const obtenerTelefonos = async (_, res) => {
  try {
    const telefonos = await Telefono.findAll();
    res.status(200).json(telefonos);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: "Error al obtener teléfonos" });
  }
};

const actualizarTelefono = async (req, res) => {
  try {
    const id = req.params.id;
    const telefono = await Telefono.findByPk(id);

    const { numero } = req.body;
    telefono.numero = numero;
    await telefono.save();
    res.status(200).json(telefono);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: "Error al actualizar teléfono" });
  }
};

const eliminarTelefono = async (req, res) => {
  try {
    const id = req.params.id;
    const telefono = await Tag.findByPk(id);

    await telefono.destroy();
    res.status(200).json({ message: "Teléfono eliminado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar teléfono" });
  }
};

module.exports = {
  crearTelefono,
  obtenerTelefonos,
  actualizarTelefono,
  eliminarTelefono,
};
