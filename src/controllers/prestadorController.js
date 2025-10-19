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
  AgendaTurnos
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
    propietarioId: nuevoPrestadorId,
    propietarioTipo: 'Prestador',
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

  return res.status(200).json({ message: "Prestador actualizado correctamente." }, prestador);
};

//Actualizar lugares de atencion y horarios
const actualizarLugaresAtencionPrestador = async (req, res) => {
  const { id } = req.params;
  const { lugaresAtencion } = req.body;

  const prestador = await Prestador.findByPk(id);

  //Eliminacion:
  const lugaresActuales = await LugarAtencion.findAll({
    where: { prestadorId: id },
    include: [{ model: HorarioAtencion, as: "HorarioAtencions" }],
  });

  for (const lugar of lugaresActuales) {
    for (const horario of lugar.HorarioAtencions) {
      await horario.setDia([]); //Es setDia y no setDias porque se generó sin plural
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

  return res.status(200).json({ message: "Lugares de atencion del Prestador actualizados correctamente.", prestador });
};

//actualizar especialidades
const actualizarEspecialidadesPrestador = async (req, res) => {
  const { id } = req.params;
  const { especialidades } = req.body;

  const prestador = await Prestador.findByPk(id);

  //Vacío el array de especialidades actuales
  await prestador.setEspecialidads([]); // funciona con Especialidads porque así lo generó Sequelize

  for (const espId of especialidades) {
    const esp = await Especialidad.findByPk(espId);
    if (esp) {
      await prestador.addEspecialidad(esp); // Luego agrego las nuevas especialidades
    }
  }
  return res.status(200).json({ message: "Especialidades actualizadas correctamente." });
};

//actualizar si es centro médico
const actualizarCentroMedicoPrestador = async (req, res) => {
  const { id } = req.params;
  const { esCentroMedico, integraCentroMedico, centroMedicoQueIntegra } = req.body;

  const prestador = await Prestador.findByPk(id);
  await prestador.update({
    esCentroMedico,
    integraCentroMedico: (esCentroMedico ? false : integraCentroMedico),
    centroMedicoId: (integraCentroMedico ? centroMedicoQueIntegra : null),
  });
  return res.status(200).json({ message: "Prestador actualizado correctamente." }, prestador);
};

//falta eliminar entidades relacionadas
const eliminarPrestador = async (req, res) => {
  const { id } = req.params;

  const prestador = await Prestador.findByPk(id, {
    include: [
      { model: Email },
      { model: Telefono },
      { model: Especialidad },
      { model: LugarAtencion, include: [
          { model: Direccion, include: { model: Provincia } },
          { model: HorarioAtencion, include: { model: Dia } }
        ],
      }
    ]
  });

  await Email.destroy({ where: { prestadorId: id } });
  await Telefono.destroy({ where: { prestadorId: id } });
  await prestador.setEspecialidads([]);

  const lugaresActuales = await LugarAtencion.findAll({
    where: { prestadorId: id },
    include: [{ model: HorarioAtencion }],
  });

  for (const lugar of lugaresActuales) {
    for (const horario of lugar.HorarioAtencions) {
      await horario.setDia([]); //Es setDia y no setDias porque se generó sin plural
    }
    await HorarioAtencion.destroy({ where: { lugarAtencionId: lugar.id } });
    await lugar.destroy();
    //destruyo las direcciones? porque otros lugares de atención podrían usarla también
    await Direccion.destroy({ where: { id: lugar.direccionId } });
  }

  await prestador.destroy();

  return res.status(200).json({ message: "Prestador eliminado correctamente." });
}

const obtenerPrestadoresSinAgenda = async (req, res) => {
  const prestadoresConAgenda = await AgendaTurnos.findAll({
    attributes: ['prestadorId'],
    group: ['prestadorId']
  });
  const idsDePrestadoresConAgenda = prestadoresConAgenda.map(pa => pa.prestadorId);
  const prestadores = await Prestador.findAll({
    attributes: ["id", "nombre"]
  });
  const prestadoresSinAgenda = prestadores.filter(p => !idsDePrestadoresConAgenda.includes(p.id));
  return res.status(200).json(prestadoresSinAgenda);
};

module.exports = {
  crearPrestador,
  obtenerPrestadores,
  obtenerPrestador,
  actualizarDatosPersonalesPrestador,
  actualizarLugaresAtencionPrestador,
  actualizarEspecialidadesPrestador,
  actualizarCentroMedicoPrestador,
  obtenerPrestadoresSinAgenda,
  eliminarPrestador
};
