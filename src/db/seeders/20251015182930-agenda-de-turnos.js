'use strict';

const { AgendaTurnos, HorarioAtencion, Prestador, LugarAtencion } = require("../models")
const { convertirAMinutos } = require("../../services/horarioService");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const agendas = [
      {
        "prestadorId": 1,
        "especialidadId": 1,
        "lugaratencionId": 1,
        "horarios": [
          { "horaInicio": "08:00", "horaFin": "12:00", "duracion": 20, "dias": ["Lunes", "Viernes"] },
          { "horaInicio": "10:00", "horaFin": "12:00", "duracion": 15, "dias": ["Miércoles"] }
        ]
      },
      {
        "prestadorId": 3,
        "especialidadId": 4,
        "lugaratencionId": 3,
        "horarios": [
          { "horaInicio": "11:00", "horaFin": "14:00", "duracion": 30, "dias": ["Martes", "Jueves"] }
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
