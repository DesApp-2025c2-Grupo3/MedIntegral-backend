const {
  Prestador,
  Direccion,
  Email,
  Telefono,
  LugarAtencion,
  HorarioAtencion,
} = require("../models");

const crearPrestador = async (req, res) => {
  const {
    nombre,
    cuilCuit,
    esCentroMedico,
    profesionalIndependiente,
    centroMedicoQueIntegra,
    especialidades, // Array de IDs o de objetos { id: X }
    emails, // Array de objetos { direccion:... }
    telefonos, // Array de objetos { numero: ... }
    lugaresAtencion, // Array de objetos , incluyendo la Dirección
  } = req.body;

  try {
    const nuevoPrestador = await Prestador.create({
      nombre,
      cuilCuit,
      esCentroMedico,
    });

    const prestadorId = nuevoPrestador.id;

    //Asignamos todos los mails
    const datosEmails = emails.map((e) => ({
      direccion: e.direccion,
      prestadorId: prestadorId,
    }));
    await Email.bulkCreate(datosEmails); //<-- bulkCreate es un método de Sequelize para insertar múltiples registros en la db en una sola operación

    //Asignamos todos los teléfonos
    const datosTelefonos = telefonos.map((t) => ({
      numero: t.numero,
      prestadorId: prestadorId,
    }));
    await Telefono.bulkCreate(datosTelefonos); //<-- bulkCreate es un método de Sequelize para insertar múltiples registros en la db en una sola operación

    //asignamos todas las especialidades a la tabla intermedia
    await nuevoPrestador.setEspecialidades(especialidades);

    //Cuando es centro médico ya viene profesionalIndependiente en false y centroMedicoQueIntegra en ""
    //Cuando no es centro medico pero sí es profesional independiente ya viene profesionalIndependiente en true y el centroMedicoQueIntegra en ""
    if (
      !esCentroMedico &&
      !profesionalIndependiente &&
      centroMedicoQueIntegra
    ) {
      await nuevoPrestador.update({ centroMedicoId: centroMedicoQueIntegra });
    }




    
    //___________________________________________
    for (const lugar of lugaresAtencion) {
      const nuevaDireccion = await Direccion.create({
        calle: lugar.calle,
        altura: lugar.altura,
        pisoDepto: lugar.pisoDepto,
        codigoPostal: lugar.codigoPostal,
        localidad: lugar.localidad,
        provinciaId: lugar.provinciaId,
      });

      const nuevoLugarAtencion = await LugarAtencion.create({
        prestadorId: prestadorId,
        direccionId: nuevaDireccion.id,
      });

      const horariosLugar = lugar.horarios.map((h) => ({
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
      }));

      for (const horario of lugar.horarios) {
        //<-- No sé cómo obtener el array de objetos de horarios de cada lugar de atención
        const horariosLugarAtencion = await HorarioAtencion.create({
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
          lugarAtencionId: horario.horarioId,
        });
        await horario.addDias(dias);
      }
    }
    //___________________________________________




  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear el prestador." });
  }
};

module.exports = { crearPrestador };
