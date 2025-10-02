const { Telefono } = require('../db/models')

const crearTelefono = async (req, res) => {
  try{
    const { telefono } = req.body
    const nuevoTelefono = await Telefono.create({telefono})
    res.status(201).json(nuevoTelefono)
  } catch (error){
    console.error(error)
    return res.status(400).json({ error: 'Error al crear teléfono' })
  }
}

const obtenerTelefonos = async (_, res) => {
  try {
    const telefonos = await Telefono.findAll()
    res.status(200).json(telefonos)
  } catch (error) {
    console.error(error)
    return res.status(404).json({ error: 'Error al obtener teléfonos' })
  }
}

module.exports = {
  crearTelefono,
  obtenerTelefonos
}