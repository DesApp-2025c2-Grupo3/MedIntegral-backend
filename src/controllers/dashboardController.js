const {
  AgendaTurnos,
  Afiliado,
  Contrato,
  PlanMedico,
  Prestador,
  Especialidad,
  Provincia,
  Direccion,
  LugarAtencion,
} = require("../db/models");

const { Op } = require('sequelize');

const obtenerAfiliadosTotales = async (_, res) => {
  const totalAfiliados = await Afiliado.count()
  return res.status(200).json(totalAfiliados);
};

const obtenerPrestadoresTotales = async (_, res) => {
  const totalPrestadores = await Prestador.count();
  return res.status(200).json(totalPrestadores);
};

const obtenerAgendasTotales = async (_, res) => {
  const totalAgendas = await AgendaTurnos.count();
  return res.status(200).json(totalAgendas);
};

const obtenerCantidadEspecialidades = async (_, res) => {
  const totalEspecialidades = await Especialidad.count();
  return res.status(200).json(totalEspecialidades);
};

const obtenerPrestadoresPorLocalidad = async (_, res) => {
  const prestadores = await Prestador.findAll({
    include: [
      {
        model: LugarAtencion,
        as: "CentroDeAtencion",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Direccion,
            as: "Direccion",
            attributes: ["localidad", "provinciaId"],
            include: [
              {
                model: Provincia,
                as: "Provincia",
                attributes: ["nombre"],
              },
            ],
          },
        ],
      },
    ],
  });

  const direcciones = prestadores.flatMap((p) =>
    p.CentroDeAtencion.map((c) => c.Direccion)
  );

  const localidades = direcciones.map((d) => ({
    localidad: d.localidad,
    provincia: d.Provincia.nombre,
  }));
  
  const cantidadPorLocalidad = new Map();

  for (const { localidad, provincia } of localidades) {
    const clave = `${localidad}|${provincia}`;

    const valor = cantidadPorLocalidad.get(clave) || { localidad, provincia, cantidad: 0 };
    valor.cantidad += 1;
    cantidadPorLocalidad.set(clave, valor);
  }

  const listaLocalidades = Array.from(cantidadPorLocalidad.values());

  listaLocalidades.sort((a, b) => b.cantidad - a.cantidad);

  return res.status(200).json(listaLocalidades);
};

const obtenerPrestadoresPorEspecialidad = async (_, res) => {
    const prestadores = await Prestador.findAll({
    include: [
      {
        model: Especialidad,
        as: "Especialidad",
        attributes: ["id", "nombre"],
        through: { attributes: [] },
      }
    ],
  });

  const especialidades = prestadores.flatMap((p) =>p.Especialidad.map((e)=>e.nombre))
  
  const cantidadPorEspecialidad = new Map();

  for (const especialidad of especialidades) {
    cantidadPorEspecialidad.set(especialidad, (cantidadPorEspecialidad.get(especialidad) || 0) + 1);
  }

  const listaEspecialidades = Array.from(cantidadPorEspecialidad, ([nombre, cantidad]) => ({ nombre, cantidad }));

  listaEspecialidades.sort((a, b) => b.cantidad - a.cantidad);

  return res.status(200).json(listaEspecialidades);
};

const obtenerAfiliadosConBaja = async (_, res) => {
  const fechaActual = new Date(2025, 11, 13);
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();
  const fechaFinMes = new Date(año, mes, 30);

  const afiliados = await Afiliado.findAll({where: {vigenciaFin:{[Op.between]:[fechaActual, fechaFinMes]}}})

  const afiliadosDeBaja = afiliados.map((a) => ({
      id: a.id,
      nombre: a.nombre + " " + a.apellido,
      vigenciaHasta: a.vigenciaFin
  }))

  res.status(200).json(afiliadosDeBaja)
};

const obtenerPrestadoresSinAgenda = async (_, res) => {};

const obtenerPlanesMedicosPorMes = async (_, res) => {};

module.exports = {
  obtenerAfiliadosTotales,
  obtenerPrestadoresTotales,
  obtenerAgendasTotales,
  obtenerCantidadEspecialidades,
  obtenerPrestadoresPorLocalidad,
  obtenerPrestadoresPorEspecialidad,
  obtenerAfiliadosConBaja,
  obtenerPrestadoresSinAgenda,
  obtenerPlanesMedicosPorMes,
};
