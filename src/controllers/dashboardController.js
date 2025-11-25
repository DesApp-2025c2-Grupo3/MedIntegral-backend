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
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();
  const fechaFinMes = new Date(año, mes, 30);

  const afiliados = await Afiliado.findAll({
    where: {
      vigenciaFin:{[Op.between]:[fechaActual, fechaFinMes]},
      titularId: {[Op.is]: null}
    }
  })

  const afiliadosDeBaja = afiliados.map((a) => ({
      id: a.id,
      nombre: a.nombre + " " + a.apellido,
      vigenciaHasta: a.vigenciaFin
  }))

  res.status(200).json(afiliadosDeBaja);
};

const obtenerPrestadoresSinAgenda = async (_, res) => {
  const prestadoresConAgenda = await AgendaTurnos.findAll({
        attributes: ["prestadorId"],
        group: ["prestadorId"]
    });
  
  const idsPrestadoresConAgenda = prestadoresConAgenda.map((p) => p.prestadorId)

  const prestadoresSinAgenda = await Prestador.findAll({
    include: [
      {model: Especialidad, as: "Especialidad", attributes: ["nombre"], through: { attributes: [] }},
      {model: LugarAtencion, as: "CentroDeAtencion", include: [{model:Direccion, as: "Direccion"}]},
    ],
    where: {id: {[Op.notIn]:idsPrestadoresConAgenda}}
  })

  const prestadoresFormateados = prestadoresSinAgenda.map((prestador) => {
    return formatearPrestadorSinAgenda(prestador)
  })
  
  res.status(200).json(prestadoresFormateados)
};

const formatearPrestadorSinAgenda = (prestador) => {

    const direcciones = prestador.CentroDeAtencion.map((lugar) => ({
        calle: lugar.Direccion.calle,
        altura: lugar.Direccion.altura
    }));

    const prestadorFormateado = {
        id: prestador.id,
        nombre: prestador.nombre,
        especialidades: prestador.Especialidad,
        direcciones: direcciones,
    };

    return { ...prestadorFormateado };
}

const obtenerPlanesMedicosPorMes = async (_, res) => {
  const afiliados = await Afiliado.findAll({
        include: [{model: Contrato, include: [{model:PlanMedico, as: "plan"}]}]
    })
   
    const fecha = new Date();
    const año = fecha.getFullYear()
    const mes = fecha.getMonth()
   
    const planesMedicos = []
    
    for (var i = 0; i<4 ; i++){
        const fechaActual = new Date(año, mes - i, 30)
        const nombreMesCompleto = fechaActual.toLocaleDateString('es-ES', { month: 'short' });
        const nombreMes = nombreMesCompleto.charAt(0).toUpperCase() + nombreMesCompleto.slice(1);

        const afiliadosDelMes = afiliados.filter(
          (a) => a.vigenciaInicio <= fechaActual && (a.vigenciaFin >= fechaActual || !null) 
        )                                                
       
        const plan210 = afiliadosDelMes.filter((a) => a.Contrato.plan.plan === "210").length;
        const plan310 = afiliadosDelMes.filter((a) => a.Contrato.plan.plan === "310").length;
        const plan410 = afiliadosDelMes.filter((a) => a.Contrato.plan.plan === "410").length;
        const plan510 = afiliadosDelMes.filter((a) => a.Contrato.plan.plan === "510").length;

        planesMedicos.push({
            mes: nombreMes,
            planes: {
                210: plan210,
                310: plan310,
                410: plan410,
                510: plan510
            }
        })
    }

    res.status(200).json(planesMedicos);
};

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
