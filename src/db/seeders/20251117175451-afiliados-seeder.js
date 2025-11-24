'use strict';

const {
  Contrato,
  Afiliado,
  Email,
  Telefono,
  Direccion,
  Domicilio,
  AfiliadoSituaciones,
  SituacionTerapeutica,
} = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    // --- HELPERS ---
    // Copié los helpers porque no están accesibles desde aquí directamente (no son servicios)
    
    const crearEmails = async (emails, afiliadoId) => {
      if (!emails || emails.length === 0) return;
      const datosEmails = emails.map((e) => ({
        direccion: e.direccion,
        propietarioId: afiliadoId,
        propietarioTipo: 'Afiliado',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await Email.bulkCreate(datosEmails);
    };

    const crearTelefonos = async (telefonos, afiliadoId) => {
      if (!telefonos || telefonos.length === 0) return;
      const datosTelefonos = telefonos.map((t) => ({
        numero: t.numero,
        propietarioId: afiliadoId,
        propietarioTipo: 'Afiliado',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await Telefono.bulkCreate(datosTelefonos);
    };

    const crearDirecciones = async (direcciones, afiliadoId) => {
      if (!direcciones || direcciones.length === 0) return;
      for (const direccionData of direcciones) {
        const [direccion] = await Direccion.findOrCreate({
          where: {
            calle: direccionData.calle,
            altura: direccionData.altura,
            localidad: direccionData.localidad,
            codigoPostal: direccionData.codigoPostal,
          },
          defaults: {
            ...direccionData,
            provinciaId: direccionData.provinciaId || 1,
          },
        });

        await Domicilio.create({
          afiliadoId: afiliadoId,
          direccionId: direccion.id,
        });
      }
    };

    const crearSituacionesTerapeuticas = async (situaciones, afiliadoId) => {
      if (!situaciones || situaciones.length === 0) return;
      for (const sit of situaciones) {
        const situacion = await SituacionTerapeutica.findByPk(sit.situacionId);
        if (situacion) {
          await AfiliadoSituaciones.create({
            afiliadoId: afiliadoId,
            situacionTerapeuticaId: sit.situacionId,
            fechaInicio: sit.fechaInicio,
            fechaFin: sit.fechaFin,
          });
        }
      }
    };
    // --- Hasta acá los HELPERS ---


    // --- Afiliados para la base de datos ---
    const afiliadosARegistrar = [
      // 1-Titular sin grupo familiar, activo
      {
        nAfiliado: 1001,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '38123456',
        fechaNacimiento: '1995-05-10',
        nombre: 'Gaby',
        apellido: 'Ledes',
        vigenciaInicio: '2023-01-01',
        vigenciaFin: null,
        emails: [{ direccion: 'gaby.ledes@gmail.com' }],
        telefonos: [{ numero: '1155443322' }],
        direcciones: [{
          calle: 'Av. Rivadavia',
          altura: 5000,
          pisoDepto: '3B',
          codigoPostal: 'C1424',
          localidad: 'Caballito',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: true,
        situacionesTerapeuticas: [
          { situacionId: 1, fechaInicio: '2023-01-15', fechaFin: null }
        ],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },
      
      // 2-Titular activa, con grupo familiar complejo
      {
        nAfiliado: 1002,
        planId: 2,
        tipoDocumentoId: 1,
        numeroDocumento: '32987654',
        fechaNacimiento: '1987-01-06',
        nombre: 'Cristian',
        apellido: 'Gonz',
        vigenciaInicio: '2022-06-01',
        vigenciaFin: null,
        emails: [{ direccion: 'cris.gonz@gmail.com' }],
        telefonos: [{ numero: '1166778899' }],
        direcciones: [{
          calle: 'Av. Corrientes',
          altura: 1234,
          pisoDepto: '10A',
          codigoPostal: 'C1043',
          localidad: 'San Nicolás',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          // Miembro 1: Cónyuge
          {
            tipoDocumentoId: 1,
            numeroDocumento: '45111222',
            fechaNacimiento: '2000-11-05',
            nombre: 'Aly',
            apellido: 'Mark',
            vigenciaInicio: '2022-06-01',
            vigenciaFin: null,
            parentescoId: 3, 
            emails: [{ direccion: 'alinita.markesita@gmail.com' }],
            telefonos: [{ numero: '1122334455' }],
            direcciones: [],
            tieneSituacionTerapeutica: true,
            situacionesTerapeuticas: [
              { situacionId: 2, fechaInicio: '2024-01-01', fechaFin: null }
            ],
          },
          // Miembro 2: Hijo
          {
            tipoDocumentoId: 1,
            numeroDocumento: '58123456',
            fechaNacimiento: '2018-08-30',
            nombre: 'Daenerys',
            apellido: 'Gonz',
            vigenciaInicio: '2022-06-01',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },

      // 3-Titular inactivo (dado de baja)
      {
        nAfiliado: 1003,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '25111222',
        fechaNacimiento: '1975-02-01',
        nombre: 'Laura',
        apellido: 'Martinez',
        vigenciaInicio: '2020-01-01',
        vigenciaFin: '2024-10-31',
        emails: [{ direccion: 'laura.martinez@ejemplo.com' }],
        telefonos: [{ numero: '1199887766' }],
        direcciones: [{
          calle: 'Av. Santa Fe',
          altura: 3000,
          pisoDepto: null,
          codigoPostal: 'C1425',
          localidad: 'Palermo',
          provinciaId: 1,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },

      // 4-Titular futuro (alta programada)
      {
        nAfiliado: 1004,
        planId: 3,
        tipoDocumentoId: 1,
        numeroDocumento: '40555666',
        fechaNacimiento: '1998-12-01',
        nombre: 'Martín',
        apellido: 'Gutierrez',
        vigenciaInicio: '2026-01-01',
        vigenciaFin: null,
        emails: [{ direccion: 'martin.guti@ejemplo.com' }],
        telefonos: [{ numero: '1133221100' }],
        direcciones: [{
          calle: 'Calle Falsa',
          altura: 123,
          pisoDepto: 'PB',
          codigoPostal: 'B1714',
          localidad: 'Ituzaingó',
          provinciaId: 1,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },

      // 5-Titular futuro, sin familia
      {
        nAfiliado: 1005,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '31222333',
        fechaNacimiento: '1985-04-12',
        nombre: 'Javier',
        apellido: 'Paz',
        vigenciaInicio: '2026-06-01',
        vigenciaFin: null,
        emails: [{ direccion: 'javier.paz@ejemplo.com' }],
        telefonos: [{ numero: '3515551234' }],
        direcciones: [{
          calle: 'Av. Colón',
          altura: 1500,
          pisoDepto: null,
          codigoPostal: 'X5000',
          localidad: 'Córdoba',
          provinciaId: 5,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },
      
      // 6-Titular Futura, con 1 hijo
      {
        nAfiliado: 1006,
        planId: 2,
        tipoDocumentoId: 1,
        numeroDocumento: '33444555',
        fechaNacimiento: '1988-09-25',
        nombre: 'Mariana',
        apellido: 'Lopez',
        vigenciaInicio: '01-01-2026',
        vigenciaFin: null,
        emails: [{ direccion: 'mariana.lopez@ejemplo.com' }],
        telefonos: [{ numero: '3416667788' }],
        direcciones: [{
          calle: 'Bv. Oroño',
          altura: 800,
          pisoDepto: '1',
          codigoPostal: 'S2000',
          localidad: 'Rosario',
          provinciaId: 20,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '51222333',
            fechaNacimiento: '2012-07-19',
            nombre: 'Lucas',
            apellido: 'Gomez',
            vigenciaInicio: '2021-11-05',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },

      // 7-Titular activo, sin familia (multiples datos de contacto)
      {
        nAfiliado: 1007,
        planId: 3,
        tipoDocumentoId: 1,
        numeroDocumento: '29888777',
        fechaNacimiento: '1981-01-30',
        nombre: 'Esteban',
        apellido: 'Quito',
        vigenciaInicio: '2024-01-01',
        vigenciaFin: null,
        emails: [
          { direccion: 'esteban.quito@ejemplo.com' },
          { direccion: 'e.quito.lab@ejemplo.com' }
        ],
        telefonos: [
          { numero: '2614445566' },
          { numero: '2615556677' }
        ],
        direcciones: [{
          calle: 'Las Heras',
          altura: 450,
          pisoDepto: '2C',
          codigoPostal: 'M5500',
          localidad: 'Mendoza',
          provinciaId: 12,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },
      
      // 8-Titular activo, con cónyuge y familiar a cargo
      {
        nAfiliado: 1008,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '32777888',
        fechaNacimiento: '1987-06-14',
        nombre: 'Valentina',
        apellido: 'Diaz',
        vigenciaInicio: '2020-05-20',
        vigenciaFin: null,
        emails: [{ direccion: 'vale.diaz@ejemplo.com' }],
        telefonos: [{ numero: '3814449988' }],
        direcciones: [{
          calle: '25 de Mayo',
          altura: 300,
          pisoDepto: null,
          codigoPostal: 'T4000',
          localidad: 'San Miguel de Tucumán',
          provinciaId: 23,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '32111000',
            fechaNacimiento: '1986-10-05',
            nombre: 'Miguel',
            apellido: 'Sosa',
            vigenciaInicio: '2020-05-20',
            vigenciaFin: null,
            parentescoId: 3,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          },
          {
            tipoDocumentoId: 1,
            numeroDocumento: '10222333',
            fechaNacimiento: '1950-02-11',
            nombre: 'Elsa',
            apellido: 'Diaz',
            vigenciaInicio: '2021-01-01',
            vigenciaFin: null,
            parentescoId: 4,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },

      // 9-Titular activo
      {
        nAfiliado: 1009,
        planId: 2,
        tipoDocumentoId: 1,
        numeroDocumento: '41222333',
        fechaNacimiento: '1999-03-03',
        nombre: 'Agustín',
        apellido: 'Ruiz',
        vigenciaInicio: '2024-10-01',
        vigenciaFin: null,
        emails: [{ direccion: 'agustin.ruiz@ejemplo.com' }],
        telefonos: [{ numero: '3875551122' }],
        direcciones: [{
          calle: 'Balcarce',
          altura: 50,
          pisoDepto: '1A',
          codigoPostal: 'A4400',
          localidad: 'Salta',
          provinciaId: 16,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },

      // 10-Titular activa, con cónyuge
      {
        nAfiliado: 1010,
        planId: 3,
        tipoDocumentoId: 1,
        numeroDocumento: '35000111',
        fechaNacimiento: '1990-07-07',
        nombre: 'Julieta',
        apellido: 'Perez',
        vigenciaInicio: '2023-08-15',
        vigenciaFin: null,
        emails: [{ direccion: 'juli.perez@ejemplo.com' }],
        telefonos: [{ numero: '3434445566' }],
        direcciones: [{
          calle: 'Urquiza',
          altura: 100,
          pisoDepto: null,
          codigoPostal: 'E3100',
          localidad: 'Paraná',
          provinciaId: 7,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '34999888',
            fechaNacimiento: '1989-11-11',
            nombre: 'Leandro',
            apellido: 'Alvarez',
            vigenciaInicio: '2023-08-15',
            vigenciaFin: null,
            parentescoId: 3,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },

      // 11-Titular activo, con situación terapéutica
      {
        nAfiliado: 1011,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '36222333',
        fechaNacimiento: '1992-04-21',
        nombre: 'Micaela',
        apellido: 'Torres',
        vigenciaInicio: '2022-02-01',
        vigenciaFin: null,
        emails: [{ direccion: 'mica.torres@ejemplo.com' }],
        telefonos: [{ numero: '2995550011' }],
        direcciones: [{
          calle: 'Av. Argentina',
          altura: 200,
          pisoDepto: '5D',
          codigoPostal: 'Q8300',
          localidad: 'Neuquén',
          provinciaId: 14,
        }],
        tieneSituacionTerapeutica: true,
        situacionesTerapeuticas: [
          { situacionId: 3, fechaInicio: '2022-03-01', fechaFin: null }
        ],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },
      
      // 12-Titular activo, con dos hijos
      {
        nAfiliado: 1012,
        planId: 2,
        tipoDocumentoId: 1,
        numeroDocumento: '30555444',
        fechaNacimiento: '1984-02-28',
        nombre: 'Diego',
        apellido: 'Moreno',
        vigenciaInicio: '2019-10-10',
        vigenciaFin: null,
        emails: [{ direccion: 'diego.moreno@ejemplo.com' }],
        telefonos: [{ numero: '2804443322' }],
        direcciones: [{
          calle: 'Roca',
          altura: 700,
          pisoDepto: null,
          codigoPostal: 'U9100',
          localidad: 'Trelew',
          provinciaId: 4,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '52111222',
            fechaNacimiento: '2013-05-10',
            nombre: 'Sofía',
            apellido: 'Moreno',
            vigenciaInicio: '2019-10-10',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          },
          {
            tipoDocumentoId: 1,
            numeroDocumento: '54333222',
            fechaNacimiento: '2016-09-15',
            nombre: 'Tomás',
            apellido: 'Moreno',
            vigenciaInicio: '2019-10-10',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },

      // 13-Titular activo, sin familia
      {
        nAfiliado: 1013,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '37888999',
        fechaNacimiento: '1994-08-17',
        nombre: 'Camila',
        apellido: 'Vega',
        vigenciaInicio: '2023-12-01',
        vigenciaFin: null,
        emails: [{ direccion: 'cami.vega@ejemplo.com' }],
        telefonos: [{ numero: '1154545454' }],
        direcciones: [{
          calle: 'Av. Cabildo',
          altura: 2500,
          pisoDepto: '8A',
          codigoPostal: 'C1428',
          localidad: 'Belgrano',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },

      // 14-Titular activo, con 1 hijo con sit. terapéutica
      {
        nAfiliado: 1014,
        planId: 2,
        tipoDocumentoId: 1,
        numeroDocumento: '34123123',
        fechaNacimiento: '1989-10-02',
        nombre: 'Lucía',
        apellido: 'Quiroga',
        vigenciaInicio: '2022-07-20',
        vigenciaFin: null,
        emails: [{ direccion: 'lucia.quiroga@ejemplo.com' }],
        telefonos: [{ numero: '2984441122' }],
        direcciones: [{
          calle: 'Tucumán',
          altura: 1000,
          pisoDepto: null,
          codigoPostal: 'R8332',
          localidad: 'General Roca',
          provinciaId: 15,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '53111000',
            fechaNacimiento: '2014-04-04',
            nombre: 'Benjamín',
            apellido: 'Gomez',
            vigenciaInicio: '2022-07-20',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: true,
            situacionesTerapeuticas: [
              { situacionId: 1, fechaInicio: '2023-01-01', fechaFin: null }
            ],
          }
        ],
      },

      // 15-Titular INACTIVO, simple (Ituzaingó)
      {
        nAfiliado: 1015,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '22111222',
        fechaNacimiento: '1970-01-05',
        nombre: 'Jorge',
        apellido: 'Rios',
        vigenciaInicio: '2020-01-01',
        vigenciaFin: '2024-01-01',
        emails: [{ direccion: 'jorge.rios@ejemplo.com' }],
        telefonos: [{ numero: '1144556677' }],
        direcciones: [{
          calle: 'Pringles',
          altura: 1050,
          pisoDepto: null,
          codigoPostal: 'B1714',
          localidad: 'Ituzaingó',
          provinciaId: 1,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },
      
      // 16-Titular INACTIVA, con 1 hijo (Hurlingham)
      {
        nAfiliado: 1016,
        planId: 2,
        tipoDocumentoId: 1,
        numeroDocumento: '24555666',
        fechaNacimiento: '1975-03-15',
        nombre: 'Veronica',
        apellido: 'Lagos',
        vigenciaInicio: '2021-02-01',
        vigenciaFin: '2024-06-30',
        emails: [{ direccion: 'vero.lagos@ejemplo.com' }],
        telefonos: [{ numero: '1158585858' }],
        direcciones: [{
          calle: 'Av. Vergara',
          altura: 2100,
          pisoDepto: null,
          codigoPostal: 'B1686',
          localidad: 'Hurlingham',
          provinciaId: 1,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '48999888',
            fechaNacimiento: '2008-10-02',
            nombre: 'Franco',
            apellido: 'Perez',
            vigenciaInicio: '2021-02-01',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },
      
      // 17-Titular INACTIVO, con sit. terap. (Morón)
      {
        nAfiliado: 1017,
        planId: 3,
        tipoDocumentoId: 1,
        numeroDocumento: '26777888',
        fechaNacimiento: '1978-11-30',
        nombre: 'Estela',
        apellido: 'Ramirez',
        vigenciaInicio: '2019-01-01',
        vigenciaFin: null,
        emails: [{ direccion: 'estela.ramirez@ejemplo.com' }],
        telefonos: [{ numero: '1161616161' }],
        direcciones: [{
          calle: 'Belgrano',
          altura: 300,
          pisoDepto: '2A',
          codigoPostal: 'B1708',
          localidad: 'Morón',
          provinciaId: 1,
        }],
        tieneSituacionTerapeutica: true,
        situacionesTerapeuticas: [
          { situacionId: 2, fechaInicio: '2020-01-01', fechaFin: '2023-12-31' }
        ],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },
      
      // 18-Titular INACTIVO, cónyuge con sit. terap. (Ituzaingó)
      {
        nAfiliado: 1018,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '29888999',
        fechaNacimiento: '1982-07-20',
        nombre: 'Marta',
        apellido: 'Gimenez',
        vigenciaInicio: '2019-05-01',
        vigenciaFin: '2024-05-30',
        emails: [{ direccion: 'marta.gimenez@ejemplo.com' }],
        telefonos: [{ numero: '1134343434' }],
        direcciones: [{
          calle: 'Brandsen',
          altura: 2040,
          pisoDepto: null,
          codigoPostal: 'B1714',
          localidad: 'Ituzaingó',
          provinciaId: 1,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '29555444',
            fechaNacimiento: '1981-01-15',
            nombre: 'Esteban',
            apellido: 'Alonso',
            vigenciaInicio: '2019-05-01',
            vigenciaFin: '2024-05-30',
            parentescoId: 3,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: true,
            situacionesTerapeuticas: [
              { situacionId: 1, fechaInicio: '2020-02-01', fechaFin: null }
            ],
          }
        ],
      },
      
      // 19-Titular ACTIVO, simple, varios contactos (Hurlingham)
      {
        nAfiliado: 1019,
        planId: 2,
        tipoDocumentoId: 1,
        numeroDocumento: '38111222',
        fechaNacimiento: '1995-02-18',
        nombre: 'Pablo',
        apellido: 'Coria',
        vigenciaInicio: '2024-01-15',
        vigenciaFin: null,
        emails: [
          { direccion: 'pablo.coria@ejemplo.com' },
          { direccion: 'pcoria_work@ejemplo.com' }
        ],
        telefonos: [
          { numero: '1155554433' },
          { numero: '1155554434' }
        ],
        direcciones: [{
          calle: 'Jauretche',
          altura: 100,
          pisoDepto: null,
          codigoPostal: 'B1686',
          localidad: 'Hurlingham',
          provinciaId: 1,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },

      // 20-Titular ACTIVO, con 2 hijos (Morón)
      {
        nAfiliado: 1020,
        planId: 3,
        tipoDocumentoId: 1,
        numeroDocumento: '36999888',
        fechaNacimiento: '1993-09-09',
        nombre: 'Lorena',
        apellido: 'Paez',
        vigenciaInicio: '2023-01-01',
        vigenciaFin: null,
        emails: [{ direccion: 'lore.paez@ejemplo.com' }],
        telefonos: [{ numero: '1163636363' }],
        direcciones: [{
          calle: 'Av. Rivadavia',
          altura: 18100,
          pisoDepto: '8C',
          codigoPostal: 'B1708',
          localidad: 'Morón',
          provinciaId: 1,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '55111222',
            fechaNacimiento: '2018-01-20',
            nombre: 'Mora',
            apellido: 'Sosa',
            vigenciaInicio: '2023-01-01',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          },
          {
            tipoDocumentoId: 1,
            numeroDocumento: '57333222',
            fechaNacimiento: '2021-03-30',
            nombre: 'Dante',
            apellido: 'Sosa',
            vigenciaInicio: '2023-01-01',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },

      // 21-Titular ACTIVO, con cónyuge y sit. terap. (Ituzaingó)
      {
        nAfiliado: 1021,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '31656777',
        fechaNacimiento: '1986-04-14',
        nombre: 'Sergio',
        apellido: 'Vazquez',
        vigenciaInicio: '2022-08-01',
        vigenciaFin: null,
        emails: [{ direccion: 'sergio.vazquez@ejemplo.com' }],
        telefonos: [{ numero: '1121212121' }],
        direcciones: [{
          calle: 'Defilippi',
          altura: 1300,
          pisoDepto: null,
          codigoPostal: 'B1714',
          localidad: 'Ituzaingó',
          provinciaId: 1,
        }],
        tieneSituacionTerapeutica: true,
        situacionesTerapeuticas: [
          { situacionId: 3, fechaInicio: '2023-01-01', fechaFin: null }
        ],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '32000111',
            fechaNacimiento: '1987-05-01',
            nombre: 'Carla',
            apellido: 'Mendez',
            vigenciaInicio: '2022-08-01',
            vigenciaFin: null,
            parentescoId: 3,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },

      // 22-Titular ACTIVO, simple, múltiples direcciones (Hurlingham/Morón)
      {
        nAfiliado: 1022,
        planId: 2,
        tipoDocumentoId: 1,
        numeroDocumento: '40111222',
        fechaNacimiento: '1998-01-25',
        nombre: 'Sofia',
        apellido: 'Alberti',
        vigenciaInicio: '2024-02-01',
        vigenciaFin: null,
        emails: [{ direccion: 'sofi.alberti@ejemplo.com' }],
        telefonos: [{ numero: '1178787878' }],
        direcciones: [
          {
            calle: 'Av. Vergara',
            altura: 3000,
            pisoDepto: null,
            codigoPostal: 'B1688',
            localidad: 'Hurlingham',
            provinciaId: 1,
          },
          {
            calle: 'Av. Rivadavia',
            altura: 17500,
            pisoDepto: null,
            codigoPostal: 'B1708',
            localidad: 'Morón',
            provinciaId: 1,
          }
        ],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },

      // 23-Titular ACTIVO, con familiar a cargo con sit. terap. (Morón)
      {
        nAfiliado: 1023,
        planId: 3,
        tipoDocumentoId: 1,
        numeroDocumento: '27654321',
        fechaNacimiento: '1979-06-06',
        nombre: 'Fernando',
        apellido: 'Leyes',
        vigenciaInicio: '2018-01-01',
        vigenciaFin: null,
        emails: [{ direccion: 'fer.leyes@ejemplo.com' }],
        telefonos: [{ numero: '1132323232' }],
        direcciones: [{
          calle: 'Santa Rosa',
          altura: 500,
          pisoDepto: null,
          codigoPostal: 'B1708',
          localidad: 'Morón',
          provinciaId: 1,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '08111222',
            fechaNacimiento: '1945-12-10',
            nombre: 'Amanda',
            apellido: 'Leyes',
            vigenciaInicio: '2018-01-01',
            vigenciaFin: null,
            parentescoId: 4,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: true,
            situacionesTerapeuticas: [
              { situacionId: 2, fechaInicio: '2019-01-01', fechaFin: null }
            ],
          }
        ],
      },
      
      // 24-Titular ACTIVO, con 1 hijo, ambos con sit. terap. (Ituzaingó)
      {
        nAfiliado: 1024,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '33222111',
        fechaNacimiento: '1988-10-10',
        nombre: 'Natalia',
        apellido: 'Campos',
        vigenciaInicio: '2022-09-01',
        vigenciaFin: null,
        emails: [{ direccion: 'nati.campos@ejemplo.com' }],
        telefonos: [{ numero: '1165656565' }],
        direcciones: [{
          calle: 'Almagro',
          altura: 1100,
          pisoDepto: null,
          codigoPostal: 'B1714',
          localidad: 'Ituzaingó',
          provinciaId: 1,
        }],
        tieneSituacionTerapeutica: true,
        situacionesTerapeuticas: [
          { situacionId: 1, fechaInicio: '2022-10-01', fechaFin: null }
        ],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '52555444',
            fechaNacimiento: '2013-11-05',
            nombre: 'Joaquín',
            apellido: 'Campos',
            vigenciaInicio: '2022-09-01',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: true,
            situacionesTerapeuticas: [
              { situacionId: 1, fechaInicio: '2022-10-01', fechaFin: null }
            ],
          }
        ],
      },

      // 25-Titular INACTIVO, simple (Palermo)
      {
        nAfiliado: 1025,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '23111222',
        fechaNacimiento: '1972-02-10',
        nombre: 'Ricardo',
        apellido: 'Molina',
        vigenciaInicio: '2019-01-01',
        vigenciaFin: null,
        emails: [{ direccion: 'ricardo.molina@ejemplo.com' }],
        telefonos: [{ numero: '1154545454' }],
        direcciones: [{
          calle: 'Av. Santa Fe',
          altura: 4500,
          pisoDepto: null,
          codigoPostal: 'C1425',
          localidad: 'Palermo',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },

      // 26-Titular INACTIVA, con 1 hijo (Belgrano)
      {
        nAfiliado: 1026,
        planId: 2,
        tipoDocumentoId: 1,
        numeroDocumento: '25222333',
        fechaNacimiento: '1976-05-20',
        nombre: 'Silvia',
        apellido: 'Castillo',
        vigenciaInicio: '2018-03-01',
        vigenciaFin: null,
        emails: [{ direccion: 'silvia.castillo@ejemplo.com' }],
        telefonos: [{ numero: '1161616161' }],
        direcciones: [{
          calle: 'Av. Cabildo',
          altura: 1500,
          pisoDepto: '3F',
          codigoPostal: 'C1428',
          localidad: 'Belgrano',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '49111222',
            fechaNacimiento: '2009-01-10',
            nombre: 'Agustín',
            apellido: 'Perez',
            vigenciaInicio: '2018-03-01',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },

      // 27-Titular INACTIVO, con sit. terap. (Caballito)
      {
        nAfiliado: 1027,
        planId: 3,
        tipoDocumentoId: 1,
        numeroDocumento: '21999888',
        fechaNacimiento: '1969-10-30',
        nombre: 'Pedro',
        apellido: 'Mirra',
        vigenciaInicio: '2020-05-01',
        vigenciaFin: null,
        emails: [{ direccion: 'pedro.mirra@ejemplo.com' }],
        telefonos: [{ numero: '1172727272' }],
        direcciones: [{
          calle: 'Av. Rivadavia',
          altura: 5500,
          pisoDepto: null,
          codigoPostal: 'C1424',
          localidad: 'Caballito',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: true,
        situacionesTerapeuticas: [
          { situacionId: 2, fechaInicio: '2021-01-01', fechaFin: '2024-09-01' }
        ],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },

      // 28-Titular ACTIVA, con cónyuge (Palermo)
      {
        nAfiliado: 1028,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '34111222',
        fechaNacimiento: '1989-01-15',
        nombre: 'Luciana',
        apellido: 'Vidal',
        vigenciaInicio: '2022-01-01',
        vigenciaFin: null,
        emails: [{ direccion: 'luciana.vidal@ejemplo.com' }],
        telefonos: [{ numero: '1138383838' }],
        direcciones: [{
          calle: 'Av. Cerviño',
          altura: 3100,
          pisoDepto: null,
          codigoPostal: 'C1425',
          localidad: 'Palermo',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '33999888',
            fechaNacimiento: '1988-05-05',
            nombre: 'Marcos',
            apellido: 'Pintos',
            vigenciaInicio: '2022-01-01',
            vigenciaFin: null,
            parentescoId: 3,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },

      // 29-Titular ACTIVO, simple, varios contactos (Belgrano)
      {
        nAfiliado: 1029,
        planId: 2,
        tipoDocumentoId: 1,
        numeroDocumento: '40222333',
        fechaNacimiento: '1998-03-20',
        nombre: 'Martín',
        apellido: 'Peralta',
        vigenciaInicio: '2024-03-01',
        vigenciaFin: null,
        emails: [
          { direccion: 'martin.peralta@ejemplo.com' },
          { direccion: 'mperalta_88@ejemplo.com' }
        ],
        telefonos: [
          { numero: '1141414141' },
          { numero: '1142424242' }
        ],
        direcciones: [{
          calle: 'Av. Monroe',
          altura: 2300,
          pisoDepto: '10B',
          codigoPostal: 'C1428',
          localidad: 'Belgrano',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },

      // 30-Titular ACTIVA, con 2 hijos (Caballito)
      {
        nAfiliado: 1030,
        planId: 3,
        tipoDocumentoId: 1,
        numeroDocumento: '35123123',
        fechaNacimiento: '1990-11-11',
        nombre: 'Victoria',
        apellido: 'Acosta',
        vigenciaInicio: '2023-05-01',
        vigenciaFin: null,
        emails: [{ direccion: 'vicky.acosta@ejemplo.com' }],
        telefonos: [{ numero: '1153535353' }],
        direcciones: [{
          calle: 'Rosario',
          altura: 800,
          pisoDepto: null,
          codigoPostal: 'C1424',
          localidad: 'Caballito',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '53111222',
            fechaNacimiento: '2015-01-20',
            nombre: 'Bautista',
            apellido: 'Lopez',
            vigenciaInicio: '2023-05-01',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          },
          {
            tipoDocumentoId: 1,
            numeroDocumento: '55333222',
            fechaNacimiento: '2018-03-30',
            nombre: 'Catalina',
            apellido: 'Lopez',
            vigenciaInicio: '2023-05-01',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },

      // 31-Titular ACTIVO, con sit. terap. (Palermo)
      {
        nAfiliado: 1031,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '31888777',
        fechaNacimiento: '1986-04-14',
        nombre: 'Daniel',
        apellido: 'Blanco',
        vigenciaInicio: '2022-08-01',
        vigenciaFin: null,
        emails: [{ direccion: 'daniel.blanco@ejemplo.com' }],
        telefonos: [{ numero: '1129292929' }],
        direcciones: [{
          calle: 'Av. Scalabrini Ortiz',
          altura: 2000,
          pisoDepto: null,
          codigoPostal: 'C1425',
          localidad: 'Palermo',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: true,
        situacionesTerapeuticas: [
          { situacionId: 1, fechaInicio: '2023-01-01', fechaFin: null }
        ],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },

      // 32-Titular ACTIVA, con hijo con sit. terap. (Belgrano)
      {
        nAfiliado: 1032,
        planId: 2,
        tipoDocumentoId: 1,
        numeroDocumento: '37111222',
        fechaNacimiento: '1994-01-25',
        nombre: 'Carolina',
        apellido: 'Soto',
        vigenciaInicio: '2024-02-01',
        vigenciaFin: null,
        emails: [{ direccion: 'caro.soto@ejemplo.com' }],
        telefonos: [{ numero: '1173737373' }],
        direcciones: [
          {
            calle: 'Av. Congreso',
            altura: 2100,
            pisoDepto: '4A',
            codigoPostal: 'C1428',
            localidad: 'Belgrano',
            provinciaId: 24,
          }
        ],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '54888777',
            fechaNacimiento: '2017-06-10',
            nombre: 'Valentina',
            apellido: 'Guzman',
            vigenciaInicio: '2024-02-01',
            vigenciaFin: null,
            parentescoId: 2,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: true,
            situacionesTerapeuticas: [
              { situacionId: 2, fechaInicio: '2024-03-01', fechaFin: null }
            ],
          }
        ],
      },

      // 33-Titular ACTIVO, simple (Caballito)
      {
        nAfiliado: 1033,
        planId: 3,
        tipoDocumentoId: 1,
        numeroDocumento: '28654321',
        fechaNacimiento: '1981-06-06',
        nombre: 'Federico',
        apellido: 'Nuñez',
        vigenciaInicio: '2018-01-01',
        vigenciaFin: null,
        emails: [{ direccion: 'fede.nuñez@ejemplo.com' }],
        telefonos: [{ numero: '1131313131' }],
        direcciones: [{
          calle: 'Av. Directorio',
          altura: 300,
          pisoDepto: null,
          codigoPostal: 'C1424',
          localidad: 'Caballito',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: false,
        grupoFamiliar: [],
      },
      
      // 34-Titular ACTIVO, con cónyuge y familiar a cargo (Caballito)
      {
        nAfiliado: 1034,
        planId: 1,
        tipoDocumentoId: 1,
        numeroDocumento: '30222111',
        fechaNacimiento: '1983-10-10',
        nombre: 'Gabriel',
        apellido: 'Romero',
        vigenciaInicio: '2022-09-01',
        vigenciaFin: null,
        emails: [{ direccion: 'gabi.romero@ejemplo.com' }],
        telefonos: [{ numero: '1167676767' }],
        direcciones: [{
          calle: 'Av. La Plata',
          altura: 500,
          pisoDepto: '1C',
          codigoPostal: 'C1424',
          localidad: 'Caballito',
          provinciaId: 24,
        }],
        tieneSituacionTerapeutica: false,
        situacionesTerapeuticas: [],
        tieneGrupoFamiliar: true,
        grupoFamiliar: [
          {
            tipoDocumentoId: 1,
            numeroDocumento: '30345444',
            fechaNacimiento: '1984-01-15',
            nombre: 'Valeria',
            apellido: 'Luna',
            vigenciaInicio: '2022-09-01',
            vigenciaFin: null,
            parentescoId: 3,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          },
          {
            tipoDocumentoId: 1,
            numeroDocumento: '09111222',
            fechaNacimiento: '1948-12-10',
            nombre: 'Angel',
            apellido: 'Romero',
            vigenciaInicio: '2023-01-01',
            vigenciaFin: null,
            parentescoId: 4,
            emails: [],
            telefonos: [],
            direcciones: [],
            tieneSituacionTerapeutica: false,
            situacionesTerapeuticas: [],
          }
        ],
      },


    ];


    // --- CREACION---

    for (const data of afiliadosARegistrar) {
      const nuevoContrato = await Contrato.create({
        planId: data.planId,
        nAfiliado: data.nAfiliado,
      });

      const titular = await Afiliado.create({
        tipoDocumentoId: data.tipoDocumentoId,
        numeroDocumento: data.numeroDocumento,
        fechaNacimiento: data.fechaNacimiento,
        nombre: data.nombre,
        apellido: data.apellido,
        vigenciaInicio: data.vigenciaInicio,
        vigenciaFin: data.vigenciaFin,
        nIntegrante: 1,
        contratoId: nuevoContrato.id,
        titularId: null,
        parentescoId: 1,
      });

      await crearEmails(data.emails, titular.id);
      await crearTelefonos(data.telefonos, titular.id);
      await crearDirecciones(data.direcciones, titular.id);
      if (data.tieneSituacionTerapeutica) {
        await crearSituacionesTerapeuticas(data.situacionesTerapeuticas, titular.id);
      }

      if (data.tieneGrupoFamiliar && data.grupoFamiliar.length > 0) {
        let nIntegrante = 2;
        for (const miembro of data.grupoFamiliar) {
          
          const nuevoIntegrante = await Afiliado.create({
            tipoDocumentoId: miembro.tipoDocumentoId,
            numeroDocumento: miembro.numeroDocumento,
            fechaNacimiento: miembro.fechaNacimiento,
            nombre: miembro.nombre,
            apellido: miembro.apellido,
            vigenciaInicio: miembro.vigenciaInicio,
            vigenciaFin: miembro.vigenciaFin,
            nIntegrante: nIntegrante,
            contratoId: nuevoContrato.id,
            titularId: titular.id,
            parentescoId: miembro.parentescoId,
          });

          nIntegrante++;

          await crearEmails(miembro.emails, nuevoIntegrante.id);
          await crearTelefonos(miembro.telefonos, nuevoIntegrante.id);
          await crearDirecciones(miembro.direcciones, nuevoIntegrante.id);
          if (miembro.tieneSituacionTerapeutica) {
            await crearSituacionesTerapeuticas(miembro.situacionesTerapeuticas, nuevoIntegrante.id);
          }
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('AfiliadoSituaciones', null, { truncate: true, cascade: true, restartIdentity: true });
    await queryInterface.bulkDelete('Domicilios', null, { truncate: true, cascade: true, restartIdentity: true });
    
    await queryInterface.bulkDelete('Telefonos', { propietarioTipo: 'Afiliado' }, { truncate: true, cascade: true, restartIdentity: true });
    await queryInterface.bulkDelete('Emails', { propietarioTipo: 'Afiliado' }, { truncate: true, cascade: true, restartIdentity: true });
    

    await queryInterface.bulkDelete('Afiliados', null, { truncate: true, cascade: true, restartIdentity: true });
    await queryInterface.bulkDelete('Contratos', null, { truncate: true, cascade: true, restartIdentity: true });

  }
};