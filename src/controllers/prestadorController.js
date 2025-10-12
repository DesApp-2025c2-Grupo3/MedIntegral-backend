const {
  Prestador,
  Direccion,
  Provincia,
  Email,
  Telefono,
  LugarAtencion,
  HorarioAtencion,
  Especialidad,
  Dia
} = require("../db/models");

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
    lugaresAtencion // Array de objetos , incluyendo la Dirección
    
  } = req.body;

  const nuevoPrestador = await Prestador.create({
    nombre,
    cuilCuit,
    esCentroMedico,
    integraCentroMedico
  });

  const nuevoPrestadorId = nuevoPrestador.id;

  if (integraCentroMedico) nuevoPrestador.update({ centroMedicoId: centroMedicoQueIntegra });

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
      provinciaId: lugar.provincia
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

module.exports = { crearPrestador };