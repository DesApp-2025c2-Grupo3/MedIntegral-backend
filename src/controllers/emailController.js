const { Email } = require("../db/models");

const crearEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const nuevoEmail = await Email.create({ email });
    res.status(201).json(nuevoEmail);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Error al crear email" });
  }
};

const obtenerEmails = async (_, res) => {
  try {
    const emails = await Email.findAll();
    res.status(200).json(emails);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: "Error al obtener emails" });
  }
};

const actualizarEmail = async (req, res) => {
  try {
    const id = req.params.id;
    const email = await Email.findByPk(id);

    const { direccion } = req.body;
    email.direccion = direccion;
    await email.save();
    res.status(200).json(email);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: "Error al actualizar email" });
  }
};

const eliminarEmail = async (req, res) => {
  try {
    const id = req.params.id;
    const email = await Tag.findByPk(id);

    await email.destroy();
    res.status(200).json({ message: "Email eliminado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar email" });
  }
};

module.exports = {
  crearEmail,
  obtenerEmails,
  actualizarEmail,
  eliminarEmail,
};
