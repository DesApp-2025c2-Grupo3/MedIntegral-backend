const { Direccion, Provincia } = require("../db/models"); // Asegúrate de importar Provincia

const crearDireccion = async (req, res) => {
  try {
    const { calle, altura, pisoDepto, codigoPostal, localidad, provinciaId } =
      req.body;

    //Validación acá, pero puede moverse a un middleware
    if (!calle || !altura || !localidad || !provinciaId) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios para crear la dirección." });
    }

    const nuevaDireccion = await Direccion.create({
      calle,
      altura,
      pisoDepto,
      codigoPostal,
      localidad,
      //clave foránea a Provincia
      provinciaId,
    });

    res.status(201).json(nuevaDireccion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear la dirección." });
  }
};

const obtenerDirecciones = async (_, res) => {
  try {
    const direcciones = await Direccion.findAll({
      //Incluyo el modelo Provincia para obtener el nombre
      include: [
        {
          model: Provincia,
          attributes: ["nombre"],
        },
      ],
    });

    res.status(200).json(direcciones);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener las direcciones." });
  }
};

const actualizarDireccion = async (req, res) => {
  try {
    const id = req.params.id;

    await Direccion.update(req.body, {
      where: { id: id },
    });
    const direccionActualizada = await Direccion.findByPk(id);

    res.status(200).json(direccionActualizada);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar la dirección." });
  }
};

const eliminarDireccion = async (req, res) => {
  try {
    const id = req.params.id;

    await Direccion.destroy({
      where: { id: id },
    });

    res.status(200).json({ message: "Dirección eliminada correctamente." });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar la dirección." });
  }
};

module.exports = {
  crearDireccion,
  obtenerDirecciones,
  actualizarDireccion,
  eliminarDireccion,
};
