'use strict';



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { Prestador, Email, Telefono, Especialidad, Direccion, LugarAtencion, HorarioAtencion, Dia } = require("../models")
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
      },
      {
        "nombre": "Centro Médico San Martín",
        "cuilCuit": "20999888777",
        "esCentroMedico": true,
        "integraCentroMedico": false,
        "centroMedicoQueIntegra": null,
        "especialidades": [1, 3, 6],
        "emails": [
          { "direccion": "contacto@cmsanmartin.com" },
          { "direccion": "guardia@cmsanmartin.com" }
        ],
        "telefonos": [
          { "numero": "1100223344" },
          { "numero": "1100223345" }
        ],
        "lugaresAtencion": [{
          "calle": "Av. San Martín",
          "altura": 2500,
          "codigoPostal": "b1650",
          "localidad": "San Martín",
          "provincia": 1,
          "horarios": [
            { "horaInicio": "07:00", "horaFin": "19:00", "dias": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] },
            { "horaInicio": "08:00", "horaFin": "13:00", "dias": ["Sábado"] }
          ]
        }]
      },
      {
        "nombre": "Dra Laura Nieve",
        "cuilCuit": "27456789012",
        "esCentroMedico": false,
        "integraCentroMedico": true,
        "centroMedicoQueIntegra": 4,
        "especialidades": [2, 6],
        "emails": [
          { "direccion": "laura.nieve@medmail.com" }
        ],
        "telefonos": [
          { "numero": "1167890045" }
        ],
        "lugaresAtencion": [{
          "calle": "Belgrano",
          "altura": 780,
          "codigoPostal": "b1642",
          "localidad": "Vicente López",
          "provincia": 1,
          "horarios": [
            { "horaInicio": "09:00", "horaFin": "13:00", "dias": ["Lunes", "Miércoles", "Viernes"] },
            { "horaInicio": "14:00", "horaFin": "18:00", "dias": ["Martes", "Jueves"] }
          ]
        }]
      },
      {
        "nombre": "Clínica Los Olivos",
        "cuilCuit": "30765432109",
        "esCentroMedico": true,
        "integraCentroMedico": false,
        "centroMedicoQueIntegra": null,
        "especialidades": [3, 4, 7],
        "emails": [
          { "direccion": "turnos@losolivos.com" }
        ],
        "telefonos": [
          { "numero": "1133004455" },
          { "numero": "1133004466" }
        ],
        "lugaresAtencion": [{
          "calle": "Los Olivos",
          "altura": 1200,
          "codigoPostal": "x5000",
          "localidad": "Córdoba",
          "provincia": 3,
          "horarios": [
            { "horaInicio": "08:00", "horaFin": "20:00", "dias": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] }
          ]
        }]
      },
      {
        "nombre": "Dr Juan Herrera",
        "cuilCuit": "20123456780",
        "esCentroMedico": false,
        "integraCentroMedico": true,
        "centroMedicoQueIntegra": 6,
        "especialidades": [3],
        "emails": [
          { "direccion": "juan.herrera@medmail.com" }
        ],
        "telefonos": [
          { "numero": "1144455566" }
        ],
        "lugaresAtencion": [{
          "calle": "Av. Colón",
          "altura": 3456,
          "codigoPostal": "x5002",
          "localidad": "Córdoba",
          "provincia": 3,
          "horarios": [
            { "horaInicio": "10:00", "horaFin": "14:00", "dias": ["Lunes", "Miércoles", "Viernes"] },
            { "horaInicio": "16:00", "horaFin": "19:00", "dias": ["Martes", "Jueves"] }
          ]
        }]
      },
      {
        "nombre": "Dra María Solís",
        "cuilCuit": "27890123456",
        "esCentroMedico": false,
        "integraCentroMedico": false,
        "centroMedicoQueIntegra": null,
        "especialidades": [5],
        "emails": [
          { "direccion": "maria.solis@medmail.com" }
        ],
        "telefonos": [
          { "numero": "1177008800" }
        ],
        "lugaresAtencion": [{
          "calle": "Ituzaingó",
          "altura": 220,
          "codigoPostal": "b1708",
          "localidad": "Morón",
          "provincia": 1,
          "horarios": [
            { "horaInicio": "08:30", "horaFin": "12:30", "dias": ["Martes", "Jueves"] },
            { "horaInicio": "15:00", "horaFin": "18:00", "dias": ["Sábado"] }
          ]
        }]
      },
      {
        "nombre": "Dr Ricardo Tapia",
        "cuilCuit": "20900112233",
        "esCentroMedico": false,
        "integraCentroMedico": true,
        "centroMedicoQueIntegra": 2,
        "especialidades": [1, 4],
        "emails": [
          { "direccion": "ricardo.tapia@medmail.com" }
        ],
        "telefonos": [
          { "numero": "1166112288" }
        ],
        "lugaresAtencion": [{
          "calle": "Primera Junta",
          "altura": 910,
          "codigoPostal": "c1425",
          "localidad": "CABA",
          "provincia": 2,
          "horarios": [
            { "horaInicio": "09:00", "horaFin": "13:00", "dias": ["Lunes", "Miércoles"] },
            { "horaInicio": "14:00", "horaFin": "19:00", "dias": ["Viernes"] }
          ]
        }]
      },
      {
        "nombre": "Centro Pediátrico Norte",
        "cuilCuit": "30555111222",
        "esCentroMedico": true,
        "integraCentroMedico": false,
        "centroMedicoQueIntegra": null,
        "especialidades": [4, 8],
        "emails": [
          { "direccion": "info@cpnorte.com" },
          { "direccion": "pediatria@cpnorte.com" }
        ],
        "telefonos": [
          { "numero": "1122003344" },
          { "numero": "1122003355" }
        ],
        "lugaresAtencion": [{
          "calle": "Av. del Libertador",
          "altura": 15000,
          "codigoPostal": "b1640",
          "localidad": "Martínez",
          "provincia": 1,
          "horarios": [
            { "horaInicio": "08:00", "horaFin": "18:00", "dias": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] }
          ]
        }]
      },
      {
        "nombre": "Dra Ana Torres",
        "cuilCuit": "27999888111",
        "esCentroMedico": false,
        "integraCentroMedico": true,
        "centroMedicoQueIntegra": 10,
        "especialidades": [8],
        "emails": [
          { "direccion": "ana.torres@medmail.com" }
        ],
        "telefonos": [
          { "numero": "1188009900" }
        ],
        "lugaresAtencion": [{
          "calle": "Sarmiento",
          "altura": 455,
          "codigoPostal": "b1640",
          "localidad": "Martínez",
          "provincia": 1,
          "horarios": [
            { "horaInicio": "09:00", "horaFin": "13:00", "dias": ["Martes", "Jueves"] },
            { "horaInicio": "14:00", "horaFin": "17:00", "dias": ["Miércoles"] }
          ]
        }]
      },
      {
        "nombre": "Dr Esteban Quiroga",
        "cuilCuit": "20881234567",
        "esCentroMedico": false,
        "integraCentroMedico": false,
        "centroMedicoQueIntegra": null,
        "especialidades": [2, 7],
        "emails": [
          { "direccion": "esteban.quiroga@medmail.com" }
        ],
        "telefonos": [
          { "numero": "1155667799" }
        ],
        "lugaresAtencion": [{
          "calle": "9 de Julio",
          "altura": 320,
          "codigoPostal": "t4000",
          "localidad": "San Miguel de Tucumán",
          "provincia": 4,
          "horarios": [
            { "horaInicio": "08:00", "horaFin": "12:00", "dias": ["Lunes", "Miércoles", "Viernes"] },
            { "horaInicio": "16:00", "horaFin": "19:00", "dias": ["Martes"] }
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

      const horariosDisponibles = [];

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

          const horariosLugar = []

          for (const dia of horarioData.dias) {
            const nuevoHorario = await HorarioAtencion.create({
              horaInicio: horarioData.horaInicio,
              horaFin: horarioData.horaFin,
              lugarAtencionId: nuevoLugarAtencion.id,
              dia: dia
            });

            horariosLugar.push(nuevoHorario);

          }

          horariosDisponibles.push({
            lugarAtencionId: nuevoLugarAtencion.id,
            horarios: horariosLugar
          });

        }
      }
      await nuevoPrestador.update({ disponibilidad: horariosDisponibles });
    }
  },

  async down(queryInterface, Sequelize) {
    const { Prestador } = require('../models');
    await Prestador.destroy({ where: {}, truncate: true, cascade: true });
  }
};
