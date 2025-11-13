'use strict';

const { Prestador, Email, Telefono, Especialidad, Direccion, LugarAtencion, HorarioAtencion } = require("../models")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    const prestadoresARegistrar = [
      {
        "nombre": "Dr Pepe Grillo",
        "cuilCuit": "12345678901",
        "esCentroMedico": false,
        "integraCentroMedico": false,
        "centroMedicoQueIntegra": null,
        "especialidades": [1, 2],
        "emails": [
          { "direccion": "pepeg@gmail.com" },
          { "direccion": "drgrillo@gmail.com" }
        ],
        "telefonos": [
          { "numero": "1234567890" },
          { "numero": "0123456789" }
        ],
        "lugaresAtencion": [{
          "calle": "Avenida Siempre Viva",
          "altura": 123,
          "codigoPostal": "a123",
          "localidad": "Tigre",
          "provincia": 1,
          "horarios": [
            { "horaInicio": "08:00", "horaFin": "12:00", "dias": ["Lunes", "Miércoles", "Viernes"] },
            { "horaInicio": "08:00", "horaFin": "18:00", "dias": ["Martes", "Jueves"] }
          ]
        }]
      },
      {
        "nombre": "Centro Medico Springfield",
        "cuilCuit": "12345654321",
        "esCentroMedico": true,
        "integraCentroMedico": false,
        "centroMedicoQueIntegra": null,
        "especialidades": [1, 2, 3, 4, 5],
        "emails": [
          { "direccion": "centromedicos@gmail.com" },
          { "direccion": "springfieldmedic@gmail.com" }
        ],
        "telefonos": [
          { "numero": "1234554321" },
          { "numero": "5432112345" }
        ],
        "lugaresAtencion": [{
          "calle": "Calle Falsa",
          "altura": 123,
          "codigoPostal": "c123",
          "localidad": "Leon",
          "provincia": 2,
          "horarios": [
            { "horaInicio": "08:00", "horaFin": "20:00", "dias": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] },
            { "horaInicio": "10:00", "horaFin": "12:00", "dias": ["Sábado", "Domingo"] }
          ]
        }]
      },
      {
        "nombre": "Dr Armando Paredes",
        "cuilCuit": "11223344556",
        "esCentroMedico": false,
        "integraCentroMedico": true,
        "centroMedicoQueIntegra": 2,
        "especialidades": [4, 5],
        "emails": [
          { "direccion": "armandop@gmail.com" },
          { "direccion": "drparedes@gmail.com" }
        ],
        "telefonos": [
          { "numero": "3344556677" },
          { "numero": "4455667788" }
        ],
        "lugaresAtencion": [{
          "calle": "Avenida Springfield",
          "altura": 654,
          "codigoPostal": "s123",
          "localidad": "Pantera",
          "provincia": 2,
          "horarios": [
            { "horaInicio": "10:00", "horaFin": "15:00", "dias": ["Martes", "Jueves"] },
            { "horaInicio": "12:00", "horaFin": "20:00", "dias": ["Lunes", "Miércoles", "Viernes"] }
          ]
        }]
      }
    ]


    for (const prestador of prestadoresARegistrar) {

      const nuevoPrestador = await Prestador.create({
        nombre: prestador.nombre,
        cuilCuit: prestador.cuilCuit,
        esCentroMedico: prestador.esCentroMedico,
        integraCentroMedico: (prestador.esCentroMedico ? null : prestador.integraCentroMedico),
        centroMedicoId: (prestador.integraCentroMedico ? prestador.centroMedicoQueIntegra : null)
      });

      const datosEmails = prestador.emails.map((e) => ({
        direccion: e.direccion,
        propietarioId: nuevoPrestador.id,
        propietarioTipo: 'Prestador',
      }));
      await Email.bulkCreate(datosEmails);

      const datosTelefonos = prestador.telefonos.map((t) => ({
        numero: t.numero,
        propietarioId: nuevoPrestador.id,
        propietarioTipo: 'Prestador',
      }));
      await Telefono.bulkCreate(datosTelefonos);

      prestador.especialidades.map(async (e) => {
        const esp = await Especialidad.findByPk(e);
        if (esp) {
          nuevoPrestador.addEspecialidad(esp);
        }
      });

      for (const lugar of prestador.lugaresAtencion) {
        const nuevaDireccion = await Direccion.create({
          calle: lugar.calle,
          altura: lugar.altura,
          pisoDepto: lugar.pisoDepto,
          codigoPostal: lugar.codigoPostal,
          localidad: lugar.localidad,
          provinciaId: lugar.provincia,
        });

        const nuevoLugarAtencion = await LugarAtencion.create({
          prestadorId: nuevoPrestador.id,
          direccionId: nuevaDireccion.id,
        });

        for (const horarioData of lugar.horarios) {

          for (const dia of horarioData.dias) {
            const nuevoHorario = await HorarioAtencion.create({
              horaInicio: horarioData.horaInicio,
              horaFin: horarioData.horaFin,
              lugarAtencionId: nuevoLugarAtencion.id,
              dia: dia,
              disponible: true
            });

          }

        }
      }

    }
  },

  async down(queryInterface, Sequelize) {

    await Prestador.destroy({ where: {}, truncate: true, cascade: true });
    
  }
};
