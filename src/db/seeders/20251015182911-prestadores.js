'use strict';
const { capitalizarCadena } = require("../../services/capitalizarCadena");

const { 
  Prestador, 
  Email, 
  Telefono, 
  Especialidad, 
  Direccion, 
  LugarAtencion, 
  HorarioAtencion
} = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // --- HELPERS ---
    const crearEmails = async (emails, prestadorId) => {
      if (!emails || emails.length === 0) return;
      const datosEmails = emails.map((e) => ({
        direccion: e.direccion,
        propietarioId: prestadorId,
        propietarioTipo: 'Prestador',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      await Email.bulkCreate(datosEmails);
    };

    const crearTelefonos = async (telefonos, prestadorId) => {
      if (!telefonos || telefonos.length === 0) return;
      const datosTelefonos = telefonos.map((t) => ({
        numero: t.numero,
        propietarioId: prestadorId,
        propietarioTipo: 'Prestador',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      await Telefono.bulkCreate(datosTelefonos);
    };

    const asignarEspecialidades = async (especialidadesIds, prestadorInstance) => {
      if (!especialidadesIds || especialidadesIds.length === 0) return;
      for (const espId of especialidadesIds) {
        const esp = await Especialidad.findByPk(espId);
        if (esp) {
          await prestadorInstance.addEspecialidad(esp);
        }
      }
    };

    const crearLugaresAtencion = async (lugares, prestadorId) => {
      if (!lugares || lugares.length === 0) return;

      for (const lugar of lugares) {
        const [nuevaDireccion] = await Direccion.findOrCreate({
          where: {
            calle: await capitalizarCadena(lugar.calle),
            altura: lugar.altura,
            pisoDepto: lugar.pisoDepto || null,
            codigoPostal: lugar.codigoPostal || null,
            localidad: await capitalizarCadena(lugar.localidad),
            provinciaId: lugar.provincia
          },
          defaults: {
            calle: await capitalizarCadena(lugar.calle),
            altura: lugar.altura,
            pisoDepto: lugar.pisoDepto || null,
            codigoPostal: lugar.codigoPostal || null,
            localidad: await capitalizarCadena(lugar.localidad),
            provinciaId: lugar.provincia
          }
        });

        const nuevoLugarAtencion = await LugarAtencion.create({
          prestadorId: prestadorId,
          direccionId: nuevaDireccion.id
        });

        if (lugar.horarios && lugar.horarios.length > 0) {
          for (const horarioData of lugar.horarios) {
            for (const dia of horarioData.dias) {
              await HorarioAtencion.create({
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
    };

    // --- DATOS ---
    const prestadoresARegistrar = [
      // --- CENTROS MÉDICOS ---
      {
        refId: 1,
        nombre: "Clínica Modelo Ituzaingó",
        cuilCuit: "30111111111",
        esCentroMedico: true,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [1, 4, 27, 41],
        emails: [{ direccion: "turnos@clinicaituzaingo.com.ar" }],
        telefonos: [{ numero: "1146240001" }, { numero: "1146240002" }],
        lugaresAtencion: [{
          calle: "Gral. Las Heras",
          altura: 250,
          localidad: "Ituzaingó",
          codigoPostal: "B1714",
          provincia: 1,
          horarios: [{ horaInicio: "08:00", horaFin: "20:00", dias: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] }]
        }]
      },
      {
        refId: 2,
        nombre: "Sanatorio del Oeste Hurlingham",
        cuilCuit: "30222222222",
        esCentroMedico: true,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [11, 2, 48],
        emails: [{ direccion: "info@sanatoriohurlingham.com" }],
        telefonos: [{ numero: "1144520001" }],
        lugaresAtencion: [{
          calle: "Pedro Díaz",
          altura: 1700,
          localidad: "Hurlingham",
          codigoPostal: "B1686",
          provincia: 1,
          horarios: [{ horaInicio: "00:00", horaFin: "23:59", dias: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] }]
        }]
      },
      {
        refId: 3,
        nombre: "Centro de Diagnóstico Morón",
        cuilCuit: "30333333333",
        esCentroMedico: true,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [41, 42],
        emails: [{ direccion: "recepcion@cdmoron.com" }],
        telefonos: [{ numero: "1146290000" }],
        lugaresAtencion: [{
          calle: "Ingeniero Boatti",
          altura: 300,
          localidad: "Morón",
          codigoPostal: "B1708",
          provincia: 1,
          horarios: [{ horaInicio: "08:00", horaFin: "18:00", dias: ["Lunes", "Viernes"] }]
        }]
      },

      // --- PROFESIONALES QUE INTEGRAN ---
      {
        nombre: "Juan Carlos Pérez",
        cuilCuit: "20111111112",
        esCentroMedico: false,
        integraCentroMedico: true,
        centroMedicoQueIntegra: 1,
        especialidades: [4],
        emails: [{ direccion: "juan.perez@clinicaituzaingo.com" }],
        telefonos: [{ numero: "1155550001" }],
        lugaresAtencion: [{
          calle: "Gral. Las Heras",
          altura: 250,
          localidad: "Ituzaingó",
          codigoPostal: "B1714",
          provincia: 1,
          horarios: [{ horaInicio: "08:00", horaFin: "14:00", dias: ["Lunes", "Miércoles"] }]
        }]
      },
      {
        nombre: "María González",
        cuilCuit: "27111111113",
        esCentroMedico: false,
        integraCentroMedico: true,
        centroMedicoQueIntegra: 1,
        especialidades: [28],
        emails: [{ direccion: "dra.gonzalez@gmail.com" }],
        telefonos: [{ numero: "1155550002" }],
        lugaresAtencion: [{
          calle: "Gral. Las Heras",
          altura: 250,
          localidad: "Ituzaingó",
          codigoPostal: "B1714",
          provincia: 1,
          horarios: [{ horaInicio: "14:00", horaFin: "20:00", dias: ["Martes", "Jueves"] }]
        }]
      },
      {
        nombre: "Roberto Carlos",
        cuilCuit: "20111111114",
        esCentroMedico: false,
        integraCentroMedico: true,
        centroMedicoQueIntegra: 1,
        especialidades: [1],
        emails: [{ direccion: "rcarlos@gmail.com" }],
        telefonos: [{ numero: "1155556666" }],
        lugaresAtencion: [{
          calle: "Gral. Las Heras",
          altura: 250,
          localidad: "Ituzaingó",
          codigoPostal: "B1714",
          provincia: 1,
          horarios: [{ horaInicio: "09:00", horaFin: "13:00", dias: ["Viernes"] }]
        }]
      },
      {
        nombre: "Esteban Quintana",
        cuilCuit: "20222222223",
        esCentroMedico: false,
        integraCentroMedico: true,
        centroMedicoQueIntegra: 2,
        especialidades: [11],
        emails: [{ direccion: "esteban.quintana@trauma.com" }],
        telefonos: [{ numero: "1144440001" }],
        lugaresAtencion: [{
          calle: "Pedro Díaz",
          altura: 1700,
          localidad: "Hurlingham",
          codigoPostal: "B1686",
          provincia: 1,
          horarios: [{ horaInicio: "10:00", horaFin: "16:00", dias: ["Lunes", "Miércoles"] }]
        }]
      },
      {
        nombre: "Ana Demichelis",
        cuilCuit: "27222222224",
        esCentroMedico: false,
        integraCentroMedico: true,
        centroMedicoQueIntegra: 2,
        especialidades: [2],
        emails: [{ direccion: "anademichelis@piel.com" }],
        telefonos: [{ numero: "1144440002" }],
        lugaresAtencion: [{
          calle: "Pedro Díaz",
          altura: 1700,
          localidad: "Hurlingham",
          codigoPostal: "B1686",
          provincia: 1,
          horarios: [{ horaInicio: "14:00", horaFin: "18:00", dias: ["Martes", "Jueves"] }]
        }]
      },
      {
        nombre: "Mario Olivieri",
        cuilCuit: "20222222225",
        esCentroMedico: false,
        integraCentroMedico: true,
        centroMedicoQueIntegra: 2,
        especialidades: [36],
        emails: [{ direccion: "mario.olivieri@consultorio.com" }],
        telefonos: [{ numero: "1144440003" }],
        lugaresAtencion: [{
          calle: "Pedro Díaz",
          altura: 1700,
          localidad: "Hurlingham",
          codigoPostal: "B1686",
          provincia: 1,
          horarios: [{ horaInicio: "09:00", horaFin: "12:00", dias: ["Viernes"] }]
        }]
      },
      {
        nombre: "Laura Ramos",
        cuilCuit: "27333333334",
        esCentroMedico: false,
        integraCentroMedico: true,
        centroMedicoQueIntegra: 3,
        especialidades: [41],
        emails: [{ direccion: "laura.ramos@cdmoron.com" }],
        telefonos: [{ numero: "1166660001" }],
        lugaresAtencion: [{
          calle: "Ingeniero Boatti",
          altura: 300,
          localidad: "Morón",
          codigoPostal: "B1708",
          provincia: 1,
          horarios: [{ horaInicio: "08:00", horaFin: "14:00", dias: ["Lunes", "Martes", "Miércoles"] }]
        }]
      },
      {
        nombre: "Pedro Ibañez",
        cuilCuit: "20333333335",
        esCentroMedico: false,
        integraCentroMedico: true,
        centroMedicoQueIntegra: 3,
        especialidades: [42],
        emails: [{ direccion: "p.ibanez@medico.com" }],
        telefonos: [{ numero: "1166660002" }],
        lugaresAtencion: [{
          calle: "Ingeniero Boatti",
          altura: 300,
          localidad: "Morón",
          codigoPostal: "B1708",
          provincia: 1,
          horarios: [{ horaInicio: "14:00", horaFin: "18:00", dias: ["Jueves", "Viernes"] }]
        }]
      },
      {
        nombre: "Sofía Reinoso",
        cuilCuit: "27333333336",
        esCentroMedico: false,
        integraCentroMedico: true,
        centroMedicoQueIntegra: 3,
        especialidades: [42], 
        emails: [{ direccion: "sofia.reinoso@gmail.com" }],
        telefonos: [{ numero: "1166660003" }],
        lugaresAtencion: [{
          calle: "Ingeniero Boatti",
          altura: 300,
          localidad: "Morón",
          codigoPostal: "B1708",
          provincia: 1,
          horarios: [{ horaInicio: "09:00", horaFin: "13:00", dias: ["Lunes", "Miércoles"] }]
        }]
      },

      // --- INDEPENDIENTES ---
      {
        nombre: "Carla Núñez",
        cuilCuit: "27444444441",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [4, 38],
        emails: [{ direccion: "dracarla@gmail.com" }],
        telefonos: [{ numero: "1166667777" }],
        lugaresAtencion: [{
          calle: "Soler",
          altura: 150,
          localidad: "Ituzaingó",
          codigoPostal: "B1714",
          provincia: 1,
          horarios: [{ horaInicio: "14:00", horaFin: "19:00", dias: ["Lunes", "Miércoles", "Viernes"] }]
        }]
      },
      {
        nombre: "Marcos Huerta",
        cuilCuit: "20444444442",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [34, 47],
        emails: [{ direccion: "kinesiomarcos@hotmail.com" }],
        telefonos: [{ numero: "1144448888" }],
        lugaresAtencion: [{
          calle: "Jauretche",
          altura: 1200,
          localidad: "Hurlingham",
          codigoPostal: "B1686",
          provincia: 1,
          horarios: [{ horaInicio: "08:00", horaFin: "12:00", dias: ["Martes", "Jueves"] }]
        }]
      },
      {
        nombre: "Fernando Pérez",
        cuilCuit: "20444444443",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [5],
        emails: [{ direccion: "lic.fernando@psico.com" }],
        telefonos: [{ numero: "1155559999" }],
        lugaresAtencion: [{
          calle: "Arias",
          altura: 2400,
          localidad: "Castelar",
          codigoPostal: "B1712",
          provincia: 1,
          horarios: [{ horaInicio: "15:00", horaFin: "21:00", dias: ["Lunes", "Martes"] }]
        }]
      },
      {
        nombre: "Marina Verdi",
        cuilCuit: "27444444445",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [32],
        emails: [{ direccion: "nutrimarina@gmail.com" }],
        telefonos: [{ numero: "1146231111" }],
        lugaresAtencion: [{
          calle: "Santa Rosa",
          altura: 1200,
          localidad: "Ituzaingó",
          codigoPostal: "B1714",
          provincia: 1,
          horarios: [{ horaInicio: "09:00", horaFin: "13:00", dias: ["Sábado"] }]
        }]
      },
      {
        nombre: "Pablo Suárez",
        cuilCuit: "20444444446",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [2],
        emails: [{ direccion: "pablo.suarez@derma.com" }],
        telefonos: [{ numero: "1199998888" }],
        lugaresAtencion: [{
          calle: "Vergara",
          altura: 3500,
          localidad: "Villa Tesei",
          codigoPostal: "B1688",
          provincia: 1,
          horarios: [{ horaInicio: "16:00", horaFin: "20:00", dias: ["Miércoles"] }]
        }]
      },
      {
        nombre: "Oscar Ávila",
        cuilCuit: "20555555551",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [7],
        emails: [{ direccion: "oscar.avila@ojos.com" }],
        telefonos: [{ numero: "1188887777" }],
        lugaresAtencion: [{
          calle: "Sarmiento",
          altura: 800,
          localidad: "Morón",
          codigoPostal: "B1708",
          provincia: 1,
          horarios: [{ horaInicio: "10:00", horaFin: "16:00", dias: ["Lunes", "Miércoles"] }]
        }]
      },
      {
        nombre: "Viviana Navarro",
        cuilCuit: "27555555552",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [6, 37],
        emails: [{ direccion: "dra.viviana@ginecologia.com" }],
        telefonos: [{ numero: "1146249999" }],
        lugaresAtencion: [{
          calle: "Juncal",
          altura: 200,
          localidad: "Ituzaingó",
          codigoPostal: "B1714",
          provincia: 1,
          horarios: [{ horaInicio: "14:00", horaFin: "18:00", dias: ["Martes", "Jueves"] }]
        }]
      },

      // --- LUGAR COMPARTIDO 1: Consultorios "Lavalle" en Ituzaingó (IDs 20, 21, 22) ---
      {
        nombre: "Carlos Urtiz",
        cuilCuit: "20666666661",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [27],
        emails: [{ direccion: "dr.carlos@compartido.com" }],
        telefonos: [{ numero: "1146235555" }],
        lugaresAtencion: [{
          calle: "Lavalle",
          altura: 650,
          pisoDepto: "PB",
          localidad: "Ituzaingó",
          codigoPostal: "B1714",
          provincia: 1,
          horarios: [{ horaInicio: "08:00", horaFin: "12:00", dias: ["Lunes", "Miércoles"] }]
        }]
      },
      {
        nombre: "Daniela Osorio",
        cuilCuit: "27666666662",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [32],
        emails: [{ direccion: "dra.daniela@compartido.com" }],
        telefonos: [{ numero: "1146235555" }],
        lugaresAtencion: [{
          calle: "Lavalle",
          altura: 650,
          pisoDepto: "PB",
          localidad: "Ituzaingó",
          codigoPostal: "B1714",
          provincia: 1,
          horarios: [{ horaInicio: "13:00", horaFin: "17:00", dias: ["Martes", "Jueves"] }]
        }]
      },
      {
        nombre: "Tomás Resano",
        cuilCuit: "20666666663",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [5],
        emails: [{ direccion: "lic.tomas@compartido.com" }],
        telefonos: [{ numero: "1146235555" }],
        lugaresAtencion: [{
          calle: "Lavalle",
          altura: 650,
          pisoDepto: "1A",
          localidad: "Ituzaingó",
          codigoPostal: "B1714",
          provincia: 1,
          horarios: [{ horaInicio: "17:00", horaFin: "21:00", dias: ["Viernes"] }]
        }]
      },

      // 23. Cardiólogo con 2 consultorios (Ituzaingó y Morón)
      {
        nombre: "Víctor Corvalán",
        cuilCuit: "20777777771",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [1],
        emails: [{ direccion: "drvictor@gmail.com" }],
        telefonos: [{ numero: "1150501234" }],
        lugaresAtencion: [
          {
            calle: "Brandzen",
            altura: 1000,
            localidad: "Ituzaingó",
            codigoPostal: "B1714",
            provincia: 1,
            horarios: [{ horaInicio: "08:00", horaFin: "12:00", dias: ["Lunes"] }]
          },
          {
            calle: "Brown",
            altura: 500,
            localidad: "Morón",
            codigoPostal: "B1708",
            provincia: 1,
            horarios: [{ horaInicio: "08:00", horaFin: "12:00", dias: ["Miércoles"] }]
          }
        ]
      },

      // 24. Gastroenterólogo en Hurlingham
      {
        nombre: "Gastón Paz",
        cuilCuit: "20777777772",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [10],
        emails: [{ direccion: "gastro@paz.com" }],
        telefonos: [{ numero: "1144528888" }],
        lugaresAtencion: [{
          calle: "Ricchieri",
          altura: 1400,
          localidad: "Hurlingham",
          codigoPostal: "B1686",
          provincia: 1,
          horarios: [{ horaInicio: "09:00", horaFin: "15:00", dias: ["Jueves"] }]
        }]
      },

      // 25. Neumonólogo (Castelar)
      {
        nombre: "Ariel Puentes",
        cuilCuit: "20777777773",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [18],
        emails: [{ direccion: "dr.ariel@pulmones.com" }],
        telefonos: [{ numero: "1146271111" }],
        lugaresAtencion: [{
          calle: "Santa Rosa",
          altura: 1800,
          localidad: "Castelar",
          codigoPostal: "B1712",
          provincia: 1,
          horarios: [{ horaInicio: "10:00", horaFin: "14:00", dias: ["Martes"] }]
        }]
      },

      // 26. Urólogo (Ituzaingó)
      {
        nombre: "Vito Uriarte",
        cuilCuit: "20777777774",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [12],
        emails: [{ direccion: "dr.vito@urologia.com" }],
        telefonos: [{ numero: "1146242222" }],
        lugaresAtencion: [{
          calle: "Olivera",
          altura: 900,
          localidad: "Ituzaingó",
          codigoPostal: "B1714",
          provincia: 1,
          horarios: [{ horaInicio: "16:00", horaFin: "20:00", dias: ["Viernes"] }]
        }]
      },

      // 27. Neurólogo (Morón)
      {
        nombre: "Clara Méndez",
        cuilCuit: "27777777775",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [3],
        emails: [{ direccion: "claramendez@gmail.com" }],
        telefonos: [{ numero: "1146293333" }],
        lugaresAtencion: [{
          calle: "9 de Julio",
          altura: 200,
          localidad: "Morón",
          codigoPostal: "B1708",
          provincia: 1,
          horarios: [{ horaInicio: "09:00", horaFin: "13:00", dias: ["Lunes", "Viernes"] }]
        }]
      },

      // --- LUGAR COMPARTIDO 2: Consultorios "Cinco Esquinas" Hurlingham (IDs 28, 29) ---
      {
        nombre: "Tomás Huergo",
        cuilCuit: "20888888881",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [11],
        emails: [{ direccion: "tomas@hurlingham.com" }],
        telefonos: [{ numero: "1146650000" }],
        lugaresAtencion: [{
          calle: "Avenida Roca",
          altura: 1100,
          pisoDepto: "1",
          localidad: "Hurlingham",
          codigoPostal: "B1686",
          provincia: 1,
          horarios: [{ horaInicio: "08:00", horaFin: "12:00", dias: ["Lunes", "Miércoles"] }]
        }]
      },
      {
        nombre: "Karina Huergo",
        cuilCuit: "27888888882",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [34],
        emails: [{ direccion: "karina@hurlingham.com" }],
        telefonos: [{ numero: "1146650000" }], // Mismo teléfono de recepción
        lugaresAtencion: [{
          calle: "Avenida Roca",
          altura: 1100,
          pisoDepto: "2",
          localidad: "Hurlingham",
          codigoPostal: "B1686",
          provincia: 1,
          horarios: [{ horaInicio: "14:00", horaFin: "19:00", dias: ["Martes", "Jueves"] }]
        }]
      },

      // 30. Cirujano Plástico (Ituzaingó)
      {
        nombre: "Esteban Leiva",
        cuilCuit: "20999999991",
        esCentroMedico: false,
        integraCentroMedico: false,
        centroMedicoQueIntegra: null,
        especialidades: [23],
        emails: [{ direccion: "esteban@leloir.com" }],
        telefonos: [{ numero: "1150505050" }],
        lugaresAtencion: [{
          calle: "Martin Fierro",
          altura: 3200,
          localidad: "Ituzaingó",
          codigoPostal: "B1713",
          provincia: 1,
          horarios: [{ horaInicio: "10:00", horaFin: "18:00", dias: ["Lunes", "Viernes"] }]
        }]
      }
    ];

    // --- PROCESAMIENTO ---
    const idMap = {};

    for (const data of prestadoresARegistrar) {
      
      const nuevoPrestador = await Prestador.create({
        nombre: await capitalizarCadena(data.nombre),
        cuilCuit: data.cuilCuit,
        esCentroMedico: data.esCentroMedico,
        integraCentroMedico: data.integraCentroMedico,
        centroMedicoId: data.integraCentroMedico && data.centroMedicoQueIntegra 
          ? idMap[data.centroMedicoQueIntegra] 
          : null
      });

      if (data.refId) {
        idMap[data.refId] = nuevoPrestador.id;
      }

      await crearEmails(data.emails, nuevoPrestador.id);
      await crearTelefonos(data.telefonos, nuevoPrestador.id);
      await asignarEspecialidades(data.especialidades, nuevoPrestador);

      if (data.lugaresAtencion && data.lugaresAtencion.length > 0) {
        await crearLugaresAtencion(data.lugaresAtencion, nuevoPrestador.id);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('HorariosAtencion', null, { truncate: true, cascade: true, restartIdentity: true });
    await queryInterface.bulkDelete('LugaresAtencion', null, { truncate: true, cascade: true, restartIdentity: true });
    await queryInterface.bulkDelete('PrestadorEspecialidad', null, { truncate: true, cascade: true, restartIdentity: true });
    
    await queryInterface.bulkDelete('Telefonos', { propietarioTipo: 'Prestador' }, { truncate: true, cascade: true, restartIdentity: true });
    await queryInterface.bulkDelete('Emails', { propietarioTipo: 'Prestador' }, { truncate: true, cascade: true, restartIdentity: true });

    await queryInterface.bulkDelete('Prestadores', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};