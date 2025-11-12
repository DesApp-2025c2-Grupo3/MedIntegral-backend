'use strict';

const { AgendaTurnos, HorarioAtencion, Dia } = require("../models")

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
      const nuevaAgendaTurnos = await AgendaTurnos.create({
        prestadorId: agenda.prestadorId,
        especialidadId: agenda.especialidadId,
        lugarAtencionId: agenda.lugaratencionId
      });

      for (const horario of agenda.horarios) {

        for (const dia of horario.dias) {
          const nuevoHorario = await HorarioAtencion.create({
            agendaTurnosId: nuevaAgendaTurnos.id,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            duracionTurno: horario.duracion,
            dia: dia
          });
        }

      }

    }
  },

  async down(queryInterface, Sequelize) {

    const { AgendaTurnos, HorarioAtencion } = require('../models');

    const agendas = await AgendaTurnos.findAll({ include: [HorarioAtencion] });

    for (const agenda of agendas) {

      await HorarioAtencion.destroy({ where: { agendaTurnosId: agenda.id } });

      await AgendaTurnos.destroy({ where: { id: agenda.id } });
    }
  }

};
