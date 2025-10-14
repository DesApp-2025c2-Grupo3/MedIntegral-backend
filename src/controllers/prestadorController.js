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
};

// Obtener prestador por id
const obtenerPrestador = async (req, res) => {

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
    return res.status(200).json(prestador);
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

module.exports = {
  crearPrestador,
  obtenerPrestadores,
  obtenerPrestador,
  actualizarDatosPersonalesPrestador,
};