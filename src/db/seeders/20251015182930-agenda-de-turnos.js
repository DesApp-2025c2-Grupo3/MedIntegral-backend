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
      { "horaInicio": "15:00", "horaFin": "18:00", "duracion": 20, "dias": ["Miércoles"] }
    ]
  },
  {
    "prestadorId": 1,
    "especialidadId": 2,
    "lugaratencionId": 1,
    "horarios": [
      { "horaInicio": "13:00", "horaFin": "16:00", "duracion": 30, "dias": ["Martes", "Jueves"] }
    ]
  },
  {
    "prestadorId": 2,
    "especialidadId": 3,
    "lugaratencionId": 2,
    "horarios": [
      { "horaInicio": "08:00", "horaFin": "20:00", "duracion": 20, "dias": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] },
      { "horaInicio": "10:00", "horaFin": "12:00", "duracion": 20, "dias": ["Domingo"] }
    ]
  },
  {
    "prestadorId": 3,
    "especialidadId": 4,
    "lugaratencionId": 3,
    "horarios": [
      { "horaInicio": "10:00", "horaFin": "12:00", "duracion": 15, "dias": ["Martes", "Jueves"] },
      { "horaInicio": "16:00", "horaFin": "20:00", "duracion": 25, "dias": ["Lunes", "Miércoles", "Viernes"] }
    ]
  },
  {
    "prestadorId": 3,
    "especialidadId": 5,
    "lugaratencionId": 3,
    "horarios": [
      { "horaInicio": "09:00", "horaFin": "13:00", "duracion": 30, "dias": ["Sábado"] }
    ]
  },
  {
    "prestadorId": 4,
    "especialidadId": 1,
    "lugaratencionId": 4,
    "horarios": [
      { "horaInicio": "07:00", "horaFin": "11:00", "duracion": 20, "dias": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] }
    ]
  },
  {
    "prestadorId": 4,
    "especialidadId": 6,
    "lugaratencionId": 4,
    "horarios": [
      { "horaInicio": "08:00", "horaFin": "13:00", "duracion": 20, "dias": ["Sábado"] }
    ]
  },
  {
    "prestadorId": 5,
    "especialidadId": 2,
    "lugaratencionId": 5,
    "horarios": [
      { "horaInicio": "09:00", "horaFin": "13:00", "duracion": 25, "dias": ["Lunes", "Miércoles", "Viernes"] }
    ]
  },
  {
    "prestadorId": 5,
    "especialidadId": 6,
    "lugaratencionId": 5,
    "horarios": [
      { "horaInicio": "14:00", "horaFin": "18:00", "duracion": 25, "dias": ["Martes", "Jueves"] }
    ]
  },
  {
    "prestadorId": 6,
    "especialidadId": 3,
    "lugaratencionId": 6,
    "horarios": [
      { "horaInicio": "08:00", "horaFin": "20:00", "duracion": 30, "dias": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] }
    ]
  },
  {
    "prestadorId": 6,
    "especialidadId": 4,
    "lugaratencionId": 6,
    "horarios": [
      { "horaInicio": "09:00", "horaFin": "12:00", "duracion": 30, "dias": ["Sábado"] }
    ]
  },
  {
    "prestadorId": 7,
    "especialidadId": 3,
    "lugaratencionId": 7,
    "horarios": [
      { "horaInicio": "10:00", "horaFin": "14:00", "duracion": 25, "dias": ["Lunes", "Miércoles", "Viernes"] },
      { "horaInicio": "16:00", "horaFin": "19:00", "duracion": 25, "dias": ["Martes", "Jueves"] }
    ]
  },
  {
    "prestadorId": 8,
    "especialidadId": 5,
    "lugaratencionId": 8,
    "horarios": [
      { "horaInicio": "08:30", "horaFin": "12:30", "duracion": 30, "dias": ["Martes", "Jueves"] },
      { "horaInicio": "15:00", "horaFin": "18:00", "duracion": 30, "dias": ["Sábado"] }
    ]
  },
  {
    "prestadorId": 9,
    "especialidadId": 1,
    "lugaratencionId": 9,
    "horarios": [
      { "horaInicio": "09:00", "horaFin": "13:00", "duracion": 15, "dias": ["Lunes", "Miércoles"] }
    ]
  },
  {
    "prestadorId": 9,
    "especialidadId": 4,
    "lugaratencionId": 9,
    "horarios": [
      { "horaInicio": "14:00", "horaFin": "19:00", "duracion": 15, "dias": ["Viernes"] }
    ]
  },
  {
    "prestadorId": 10,
    "especialidadId": 4,
    "lugaratencionId": 10,
    "horarios": [
      { "horaInicio": "09:00", "horaFin": "13:00", "duracion": 20, "dias": ["Martes", "Jueves"] }
    ]
  },
  {
    "prestadorId": 10,
    "especialidadId": 8,
    "lugaratencionId": 10,
    "horarios": [
      { "horaInicio": "14:00", "horaFin": "17:00", "duracion": 20, "dias": ["Miércoles"] }
    ]
  },
  {
    "prestadorId": 11,
    "especialidadId": 8,
    "lugaratencionId": 11,
    "horarios": [
      { "horaInicio": "09:00", "horaFin": "13:00", "duracion": 25, "dias": ["Martes", "Jueves"] }
    ]
  },
  {
    "prestadorId": 12,
    "especialidadId": 2,
    "lugaratencionId": 12,
    "horarios": [
      { "horaInicio": "08:00", "horaFin": "12:00", "duracion": 20, "dias": ["Lunes", "Miércoles", "Viernes"] }
    ]
  },
  {
    "prestadorId": 12,
    "especialidadId": 7,
    "lugaratencionId": 12,
    "horarios": [
      { "horaInicio": "16:00", "horaFin": "19:00", "duracion": 20, "dias": ["Martes"] }
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
