const {
  Prestador,
  Direccion,
  Provincia,
  Email,
  Telefono,
  LugarAtencion,
  HorarioAtencion,
  Especialidad,
  Dia,
} = require("../db/models");

//Crear prestador
const crearPrestador = async (req, res) => {
  const {
    nombre,
    cuilCuit,
    esCentroMedico,
    integraCentroMedico,
    centroMedicoQueIntegra,
    especialidades, // Array de IDs { id: X }
    emails, // Array de objetos { direccion:... }
    telefonos, // Array de objetos { numero: ... }
    lugaresAtencion, // Array de objetos , incluyendo la Dirección
  } = req.body;

  if (integraCentroMedico) {
    //ToDo: Middleware --> existe y esCentroMedico true
    const centroMedico = await Prestador.findByPk(centroMedicoQueIntegra); //ToDo: Validar en middleware y devolver error 400 si no existe
    if (!centroMedico) {
      return res
        .status(400)
        .json({ error: "El centro médico que se intenta integrar no existe." });
    }
    if (!centroMedico.esCentroMedico) {
      return res.status(400).json({
        error:
          "El prestador que se intenta asignar como centro médico no es un centro médico.",
      });
    }
  }

  const nuevoPrestador = await Prestador.create({
    nombre,
    cuilCuit,
    esCentroMedico,
    integraCentroMedico,
  });

  const nuevoPrestadorId = nuevoPrestador.id;

  if (integraCentroMedico) {
    await nuevoPrestador.update({ centroMedicoId: centroMedicoQueIntegra });
  }

  //Asignamos todos los mails
  const datosEmails = emails.map((e) => ({
    direccion: e.direccion,
    prestadorId: nuevoPrestadorId,
  }));
  await Email.bulkCreate(datosEmails); //<-- bulkCreate método de Sequelize para insertar múltiples registros en la db

  //Asignamos todos los teléfonos
  const datosTelefonos = telefonos.map((t) => ({
    numero: t.numero,
    prestadorId: nuevoPrestadorId,
  }));
  await Telefono.bulkCreate(datosTelefonos); //<-- bulkCreate método de Sequelize para insertar múltiples registros en la db

  especialidades.map(async (e) => {
    const esp = await Especialidad.findByPk(e);
    if (esp) {
      nuevoPrestador.addEspecialidad(esp);
    }
  });

  //Por cada lugar de atención creamos una dirección y un lugarAtención con esa direccionId y prestadorId
  for (const lugar of lugaresAtencion) {
    console.log(lugar);
    const nuevaDireccion = await Direccion.create({
      calle: lugar.calle,
      altura: lugar.altura,
      pisoDepto: lugar.pisoDepto,
      codigoPostal: lugar.codigoPostal,
      localidad: lugar.localidad,
      provinciaId: lugar.provincia,
    });

    const nuevoLugarAtencion = await LugarAtencion.create({
      prestadorId: nuevoPrestadorId,
      direccionId: nuevaDireccion.id,
    });

    //Por cada lugar extraemos el array de horarios y por cada uno lo creamos con la FK lugarAtencionId
    for (const horarioData of lugar.horarios) {
      const nuevoHorario = await HorarioAtencion.create({
        horaInicio: horarioData.horaInicio,
        horaFin: horarioData.horaFin,
        lugarAtencionId: nuevoLugarAtencion.id,
      });

      //Por cada horario extraemos el array de días
      for (const diaData of horarioData.dias) {
        const diaExistente = await Dia.findByPk(diaData);
        if (diaExistente) {
          await nuevoHorario.addDia(diaExistente); // Usamos addDia para agregar un solo día
        }
      }
    }
  }
  res.status(201).json(nuevoPrestador);
};

//obtener prestadores
const obtenerPrestadores = async (_, res) => {
  try {
    const prestadores = await Prestador.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        { model: Email, attributes: ["direccion"] },
        { model: Telefono, attributes: ["numero"] },
        {
          model: Especialidad,
          attributes: ["nombre"],
          through: { attributes: [] },
        },
        {
          model: LugarAtencion,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: Direccion,
              as: "Direccion",
              attributes: ["calle", "altura", "pisoDepto", "localidad"],
              include: [
                {
                  model: Provincia,
                  attributes: ["nombre"],
                },
              ],
            },
            {
              model: HorarioAtencion,
              attributes: ["horaInicio", "horaFin"],
              include: [
                {
                  model: Dia,
                  attributes: ["nombre"],
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
      ],
      order: [
        ["nombre", "ASC"], //ToDo: Opcional: ordenar los resultados alfabéticamente
      ],
    });

    return res.status(200).json(prestadores);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener los prestadores." });
  }
};

// Obtener prestador por id
const obtenerPrestador = async (req, res) => {
  try {
    const { id } = req.params;

    const prestador = await Prestador.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        { model: Email, attributes: ["direccion"] },
        { model: Telefono, attributes: ["numero"] },
        {
          model: Especialidad,
          attributes: ["nombre"],
          through: { attributes: [] },
        },
        {
          model: LugarAtencion,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: Direccion,
              as: "Direccion",
              attributes: ["calle", "altura", "pisoDepto", "localidad"],
              include: [
                {
                  model: Provincia,
                  attributes: ["nombre"],
                },
              ],
            },
            {
              model: HorarioAtencion,
              attributes: ["horaInicio", "horaFin"],
              include: [
                {
                  model: Dia,
                  attributes: ["nombre"],
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
      ],
    });

    // ToDo: Si no se encuentra, devolver un 404
    if (!prestador) {
      return res.status(404).json({ error: "Prestador no encontrado." });
    }

    return res.status(200).json(prestador);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener el prestador." });
  }
};

//Actualizar datos personales de un prestador
const actualizarDatosPersonalesPrestador = async (req, res) => {
  const { id } = req.params;
  const { nombre, cuilCuit, emails, telefonos } = req.body;

  try {
    const prestador = await Prestador.findByPk(id);

    await prestador.update({ nombre, cuilCuit });

    //Emails (Para que esto funcione al editar tendrían que volverse a enviar los mismos que tiene si no se modifican)
    await Email.destroy({ where: { prestadorId: id } });

    const datosEmails = emails.map((e) => ({
      direccion: e.direccion,
      prestadorId: id,
    }));
    await Email.bulkCreate(datosEmails); // Si falla, los emails viejos ya fueron borrados

    //Teléfonos (borramos los viejos e insertamos los nuevos)
    await Telefono.destroy({ where: { prestadorId: id } });

    const datosTelefonos = telefonos.map((tel) => ({
      numero: tel.numero,
      prestadorId: id,
    }));
    await Telefono.bulkCreate(datosTelefonos); // Si falla, los teléfonos viejos ya fueron borrados

    return res
      .status(200)
      .json({ message: "Prestador actualizado correctamente." }, prestador);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error:
        "Error al actualizar el prestador: Los datos pueden haber quedado inconsistentes.",
    });
  }
};

//Actualizar lugares de atencion y horarios
const actualizarLugaresAtencion = async (req, res) => {
  const { id } = req.params;
  const { lugaresAtencion } = req.body;

  try {
    const prestador = await Prestador.findByPk(id);
    if (!prestador) {
      return res.status(404).json({ error: "Prestador no encontrado." });
    }

    //Eliminacion:
    const lugaresActuales = await LugarAtencion.findAll({
      where: { prestadorId: id },
      include: [{ model: HorarioAtencion, as: "HorarioAtencions" }],
    });

    for (const lugar of lugaresActuales) {
      for (const horario of lugar.HorarioAtencions) {
        await horario.setDia([]); //primero vacío todos los dias de la tabla intermedia de cada horario actual
      }
      await HorarioAtencion.destroy({ where: { lugarAtencionId: lugar.id } });
      await lugar.destroy();
      //destruyo las direcciones? porque otros lugares de atención podrían usarla también
      await Direccion.destroy({ where: { id: lugar.direccionId } });
    }

    //Creacion:
    for (const lugar of lugaresAtencion) {
      //Si no elimino las direcciones, cómo sé que no estoy creando duplicados?
      const nuevaDireccion = await Direccion.create({
        calle: lugar.calle,
        altura: lugar.altura,
        pisoDepto: lugar.pisoDepto,
        codigoPostal: lugar.codigoPostal,
        localidad: lugar.localidad,
        provinciaId: lugar.provincia,
      });

      const nuevoLugarAtencion = await LugarAtencion.create({
        prestadorId: id,
        direccionId: nuevaDireccion.id,
      });

      for (const lugar of lugaresAtencion) {
        console.log(lugar.horarios);
      }

      for (const horarioData of lugar.horarios) {
        const nuevoHorario = await HorarioAtencion.create({
          horaInicio: horarioData.horaInicio,
          horaFin: horarioData.horaFin,
          lugarAtencionId: nuevoLugarAtencion.id,
        });

        //Por cada horario extraemos el array de días
        for (const diaData of horarioData.dias) {
          const diaExistente = await Dia.findByPk(diaData);
          if (diaExistente) {
            await nuevoHorario.addDia(diaExistente); // Usamos addDia para agregar un solo día
          }
        }
      }
    }

    return res
      .status(200)
      .json({
        message:
          "Lugares de atencion del Prestador actualizados correctamente.",
        prestador,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error:
        "Error al actualizar el prestador: Los datos pueden haber quedado inconsistentes.",
    });
  }
};

module.exports = {
  crearPrestador,
  obtenerPrestadores,
  obtenerPrestador,
  actualizarDatosPersonalesPrestador,
  actualizarLugaresAtencion,
};
