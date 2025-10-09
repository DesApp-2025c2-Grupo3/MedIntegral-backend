const { Telefono } = require("../db/models");

const crearTelefono = async (req, res) => {
  const { telefono } = req.body;
  const nuevoTelefono = await Telefono.create({ telefono });
  res.status(201).json(nuevoTelefono);
};

const obtenerTelefonos = async (_, res) => {
  const telefonos = await Telefono.findAll();
  res.status(200).json(telefonos);
};

const actualizarTelefono = async (req, res) => {
  const id = req.params.id;
  await Telefono.update(
    { numero },
    { where: { id } } 
  );
  res.status(200).json({message: "Teléfono actualizado"});
};

const eliminarTelefono = async (req, res) => {
  const id = req.params.id;
  await Telefono.destroy({ where: { id } } );
  res.status(200).json({ message: "Teléfono eliminado" });
};

module.exports = {
  crearTelefono,
  obtenerTelefonos,
  actualizarTelefono,
  eliminarTelefono,
};
