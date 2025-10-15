'use strict';

const { AgendaTurnos, HorarioAtencion, Dia } = require("../models")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const agendas = [
      {
        "prestadorId": 1,
        "especialidadId": 2,
        "lugaratencionId": 1,
        "horarios": [
          { "horaInicio": "08:00", "horaFin": "12:00", "duracion": 20, "dias": [1, 5] }
        ]
      },
      {
        "prestadorId": 3,
        "especialidadId": 4,
        "lugaratencionId": 3,
        "horarios": [
          { "horaInicio": "10:00", "horaFin": "12:00", "duracion": 15, "dias": [2, 4] },
          { "horaInicio": "16:00", "horaFin": "20:00", "duracion": 25, "dias": [1, 3, 5] }
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
        const nuevoHorario = await HorarioAtencion.create({
          agendaTurnosId: nuevaAgendaTurnos.id,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
          duracionTurno: horario.duracion
        });

        for (const diaId of horario.dias) {
          const diaExistente = await Dia.findByPk(diaId);
          if (diaExistente) {
            await nuevoHorario.addDia(diaExistente);
          }
        }
      }

    }
  },

  async down(queryInterface, Sequelize) {

    const { AgendaTurnos, HorarioAtencion } = require('../models');

    const agendas = await AgendaTurnos.findAll({ include: [HorarioAtencion] });
    
    for (const agenda of agendas) {
      for (const horario of agenda.HorarioAtencions) {
        await horario.setDia([]);
      }

      await HorarioAtencion.destroy({ where: { agendaTurnosId: agenda.id } });

      await AgendaTurnos.destroy({ where: { id: agenda.id } });
    }
  }
  
};
