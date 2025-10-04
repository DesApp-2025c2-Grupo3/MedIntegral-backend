const diasDeLaSemana = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sábado" },
];

const obtenerDias = async (_, res) => {
  try {
    res.status(200).json(diasDeLaSemana);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno al obtener la lista de días" });
  }
};

module.exports = {
  obtenerDias,
};