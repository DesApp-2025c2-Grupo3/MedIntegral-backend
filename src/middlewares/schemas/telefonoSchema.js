const Joi = require('joi')

const telefonoSchema = Joi.object({
  numero: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
      'string.base': 'El teléfono debe ser un número',
      'string.empty': 'Es obligatorio ingresar al menos un número de teléfono',
      'string.length': 'El teléfono debe contener exactamente {#limit} dígitos',
      'string.pattern.base': 'El teléfono debe contener sólo números'
    })
})

module.exports = {
  telefonoSchema
}