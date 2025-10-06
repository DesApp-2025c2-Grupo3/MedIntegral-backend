const { Prestador, Direccion, Email, Telefono } = require("../models");

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
    if (!esCentroMedico && !profesionalIndependiente) {
      nuevoPrestador.centroMedico = centroMedicoQueIntegra;
    }

    //FALTAN LOS LUGARES DE ATENCION Y HORARIOS
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear el prestador." });
  }
};

module.exports = { crearPrestador };
