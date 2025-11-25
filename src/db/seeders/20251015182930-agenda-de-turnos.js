'use strict';

const { AgendaTurnos, HorarioAtencion, Prestador, LugarAtencion } = require("../models")
const { convertirAMinutos } = require("../../services/horarioService");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const agendas = [
      {
        "//": "Prestador 4: Juan Carlos Pérez (Integra P1). Lugar ID 4 es su consultorio en la clínica.",
        "prestadorId": 4,
        "especialidadId": 4,
        "lugaratencionId": 4,
        "horarios": [
          {
            "horaInicio": "09:00",
            "horaFin": "11:00",
            "duracion": 30,
            "dias": ["Lunes"]
          },
          {
            "horaInicio": "08:30",
            "horaFin": "12:30",
            "duracion": 30,
            "dias": ["Miércoles"]
          }
        ]
      },
      {
        "//": "Prestador 13: Carla Núñez (Independiente). Lugar ID 13.",
        "prestadorId": 13,
        "especialidadId": 38,
        "lugaratencionId": 13,
        "horarios": [
          {
            "horaInicio": "14:30",
            "horaFin": "18:00",
            "duracion": 20,
            "dias": ["Lunes", "Viernes"]
          }
        ]
      },
      {
        "//": "Prestador 20: Carlos Urtiz (Compartido Lavalle). Lugar ID 20.",
        "prestadorId": 20,
        "especialidadId": 27,
        "lugaratencionId": 20,
        "horarios": [
          {
            "horaInicio": "08:00",
            "horaFin": "11:00",
            "duracion": 40,
            "dias": ["Lunes"]
          }
        ]
      },
      {
        "//": "Prestador 23: Víctor Corvalán (Tiene 2 lugares). Lugar ID 23 (Ituzaingó).",
        "prestadorId": 23,
        "especialidadId": 1,
        "lugaratencionId": 23,
        "horarios": [
          {
            "horaInicio": "08:00",
            "horaFin": "11:30",
            "duracion": 30,
            "dias": ["Lunes"]
          }
        ]
      },
      {
        "//": "Prestador 23: Víctor Corvalán. Lugar ID 24 (Morón).",
        "prestadorId": 23,
        "especialidadId": 1,
        "lugaratencionId": 24,
        "horarios": [
          {
            "horaInicio": "09:00",
            "horaFin": "12:00",
            "duracion": 30,
            "dias": ["Miércoles"]
          }
        ]
      },
      {
        "//": "Prestador 30: Esteban Leiva (Ultimo de la lista). Lugar ID 31 (IDs acumulados: 22 previos + 2 de Victor + 6 otros).",
        "prestadorId": 30,
        "especialidadId": 23,
        "lugaratencionId": 31,
        "horarios": [
          {
            "horaInicio": "10:00",
            "horaFin": "14:00",
            "duracion": 60,
            "dias": ["Lunes"]
          },
          {
            "horaInicio": "15:00",
            "horaFin": "18:00",
            "duracion": 45,
            "dias": ["Viernes"]
          }
        ]
      },
      {
        "//": "Prestador 28: Tomás Huergo (Compartido Cinco Esquinas). Lugar ID 29.",
        "prestadorId": 28,
        "especialidadId": 11,
        "lugaratencionId": 29,
        "horarios": [
          {
            "horaInicio": "08:00",
            "horaFin": "12:00",
            "duracion": 20,
            "dias": ["Miércoles"]
          }
        ]
      },
      {
        "//": "Prestador 7: Esteban Quintana (Integra P2). Lugar ID 7.",
        "prestadorId": 7,
        "especialidadId": 11,
        "lugaratencionId": 7,
        "horarios": [
          {
            "horaInicio": "10:00",
            "horaFin": "13:00",
            "duracion": 15,
            "dias": ["Lunes"]
          }
        ]
      }
    ]

    for (const agenda of agendas) {

      const { prestadorId, especialidadId, lugaratencionId, horarios } = agenda;

      const prestador = await Prestador.findByPk(prestadorId, {
        include: [{ model: LugarAtencion, as: 'CentroDeAtencion', include: [{ model: HorarioAtencion, as: 'Horarios' }] }]
      });

      const horariosDelPrestadorEnEseLugar = prestador.CentroDeAtencion.find(lugar => lugar.id === lugaratencionId).Horarios;

      const nuevaAgendaTurnos = await AgendaTurnos.create({

        prestadorId: prestadorId,
        especialidadId: especialidadId,
        lugarAtencionId: lugaratencionId

      });

      const nuevaAgendaTurnosId = nuevaAgendaTurnos.id;

      let nuevoHorarioInicioDisponible;
      let nuevoHorarioFinDisponible;
      let nuevoHorarioNoDisponible;

      for (const horario of horarios) {

        for (const dia of horario.dias) {

          for (const horarioPrestador of horariosDelPrestadorEnEseLugar) {

            if (horarioPrestador.dia === dia) {

              if (convertirAMinutos(horarioPrestador.horaInicio) <= convertirAMinutos(horario.horaInicio) &&
                convertirAMinutos(horarioPrestador.horaFin) >= convertirAMinutos(horario.horaFin) &&
                horarioPrestador.disponible === true) {

                const nuevoHorarioAgenda = await HorarioAtencion.create({
                  agendaTurnosId: nuevaAgendaTurnosId,
                  lugarAtencionId: null,
                  horaInicio: horario.horaInicio,
                  horaFin: horario.horaFin,
                  duracionTurno: horario.duracion,
                  dia: dia,
                  esParcial: convertirAMinutos(horarioPrestador.horaInicio) < convertirAMinutos(horario.horaInicio) || convertirAMinutos(horarioPrestador.horaFin) > convertirAMinutos(horario.horaFin)
                });

                const horarioAActualizar = await HorarioAtencion.findByPk(horarioPrestador.id);
                await horarioAActualizar.update({ disponible: false });

                if (convertirAMinutos(horarioPrestador.horaInicio) != convertirAMinutos(horario.horaInicio) ||
                  convertirAMinutos(horarioPrestador.horaFin) != convertirAMinutos(horario.horaFin)) {
                  nuevoHorarioNoDisponible = await HorarioAtencion.create({
                    agendaTurnosId: null,
                    lugarAtencionId: lugaratencionId,
                    horaInicio: horario.horaInicio,
                    horaFin: horario.horaFin,
                    dia: dia,
                    disponible: false,
                    esParcial: true

                  });
                }

                if (convertirAMinutos(horarioPrestador.horaInicio) != convertirAMinutos(horario.horaInicio)) {

                  nuevoHorarioInicioDisponible = await HorarioAtencion.create({
                    agendaTurnosId: null,
                    lugarAtencionId: lugaratencionId,
                    horaInicio: horarioPrestador.horaInicio,
                    horaFin: horario.horaInicio,
                    dia: dia,
                    disponible: true,
                    esParcial: true

                  });

                }

                if (convertirAMinutos(horarioPrestador.horaFin) != convertirAMinutos(horario.horaFin)) {

                  nuevoHorarioFinDisponible = await HorarioAtencion.create({
                    agendaTurnosId: null,
                    lugarAtencionId: lugaratencionId,
                    horaInicio: horario.horaFin,
                    horaFin: horarioPrestador.horaFin,
                    dia: dia,
                    disponible: true,
                    esParcial: true
                  });

                }

              }

            }

          }

        }

      }

    }
  },

  async down(queryInterface, Sequelize) {

    const agendas = await AgendaTurnos.findAll({ include: [HorarioAtencion] });

    for (const agenda of agendas) {

      const prestador = await Prestador.findByPk(agenda.prestadorId, {
        include: [{ model: LugarAtencion, as: 'CentroDeAtencion', include: [{ model: HorarioAtencion, as: 'Horarios' }] }]
      });

      //hacer disponibles los horarios y borrar los superpuestos
      prestador.CentroDeAtencion.find(lugar => lugar.id === agenda.lugarAtencionId).Horarios.map(async h => {
        if (h.disponible === false) {
          await HorarioAtencion.update({ disponible: true }, { where: { id: h.id } });
        }
        if (h.esParcial === true) {
          await HorarioAtencion.destroy({ where: { id: h.id } });
        }
      });

      await HorarioAtencion.destroy({ where: { agendaTurnosId: agenda.id } });

      await AgendaTurnos.destroy({ where: { id: agenda.id } });
    }
  }

};
