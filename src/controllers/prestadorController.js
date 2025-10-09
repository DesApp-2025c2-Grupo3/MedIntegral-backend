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
    integraCentroMedico,
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
      centroMedicoId: (integraCentroMedico ? centroMedicoQueIntegra : null) //Agregar en el middleware
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

    //Por cada lugar de atención creamos una dirección y un lugarAtención con esa direccionId y prestadorId
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

      //Por cada lugar extraemos el array de horarios y por cada uno lo creamos con la FK lugarAtencionId
      for (const horarioData of lugar.horarios) {
        const nuevoHorario = await HorarioAtencion.create({
          horaInicio: horarioData.horaInicio,
          horaFin: horarioData.horaFin,
          lugarAtencionId: nuevoLugarAtencion.id,
        });

        //y usamos setDias para poblar la tabla intermedia que lo relaciona con los días
        await nuevoHorario.setDias(horarioData.dias);
      }
    }
    //___________________________________________
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear el prestador." });
  }
};

module.exports = { crearPrestador };