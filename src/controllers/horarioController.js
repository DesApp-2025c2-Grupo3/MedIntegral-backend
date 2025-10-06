const { HorarioAtencion, Dia } = require('../db/models');

const crearHorarioAtencion = async (req, res) => {
  try {
    const { horaInicio, horaFin, agendaTurnosId, lugarAtencionId, dias } = req.body;
    
    const nuevoHorario = await HorarioAtencion.create({
      horaInicio,
      horaFin,
      agendaTurnosId,
      lugarAtencionId 
    });

    //NOTA: Sequelize genera automáticamente un método en el objeto nuevoHorario llamado add<PluralDelModeloAsociado> (en este caso, addDias).
    await nuevoHorario.addDias(dias); // <--- Días debe ser un array de id de Dias.

    const horarioCompleto = await HorarioAtencion.findByPk(nuevoHorario.id, {
        include: [{ 
            model: Dia, 
            attributes: ['id', 'nombre'], 
            through: { attributes: [] } //tengo que excluir los campos de la tabla intermedia
        }]
    });

    res.status(201).json(horarioCompleto);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear el horario de atención." });
  }
};

const obtenerHorariosAtencion = async (_, res) => {
  try {
    const horarios = await HorarioAtencion.findAll({
        include: [
            { model: Dia, attributes: ['nombre'], through: { attributes: [] } },
        ],
        order: [['horaInicio', 'ASC']]
    });

    res.status(200).json(horarios);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener los horarios de atención." });
  }
};

const actualizarHorarioAtencion = async (req, res) => {
  try {
    const id = req.params.id;
    const { dias, ...otrosCampos} = req.body; // Solo extraigo los dias para el manejo especial

    const horario = await HorarioAtencion.findByPk(id);

    //Actualizo todos los campos que no son dias.
    await horario.update(otrosCampos);

    //Si llegan días, actualizo la tabla intermedia con el mixin
    if (dias) {
        await horario.setDias(dias); 
    }

    const horarioActualizado = await HorarioAtencion.findByPk(id, {
        include: [{ 
            model: Dia, 
            attributes: ['id', 'nombre'], 
            through: { attributes: [] } 
        }]
    });
    
    res.status(200).json(horarioActualizado);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar el horario de atención." });
  }
};

const eliminarHorarioAtencion = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Sequelize maneja automático la eliminación de la tabla intermedia (DiaHorarioAtencion)
    // pero falta agregar el onDelete: 'CASCADE' en la relación con Dia en el modelo de horarioAtencion
    
    await HorarioAtencion.destroy({
        where: { id: id }
    });
    
    res.status(200).json({ message: "Horario de atención eliminado correctamente." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar el horario de atención." });
  }
};

module.exports = {
  crearHorarioAtencion,
  obtenerHorariosAtencion,
  actualizarHorarioAtencion,
  eliminarHorarioAtencion,
};