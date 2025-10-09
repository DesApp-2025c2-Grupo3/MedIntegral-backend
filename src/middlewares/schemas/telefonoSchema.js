const Joi = require('joi')

const telefonoSchemaCreate = Joi.object({
  numero: Joi.number()
    .integer()
    .min(8)
    .max(12)
    .required()
    .messages({
      'number.base': 'El teléfono debe ser un número',
      'number.integer': 'El teléfono debe contener sólo números',
      'number.min': 'El teléfono debe contener al menos {#limit} dígitos',
      'number.max': 'El teléfono debe contener como máximo {#limit} dígitos',
      'any.required': 'Es obligatorio ingresar al menos un número de teléfono'
    })
})

const telefonoSchemaUpdate = Joi.object({
  numero: Joi.number()
    .integer()
    .min(8)
    .max(12)
    .messages({
      'number.base': 'El teléfono debe ser un número',
      'number.integer': 'El teléfono debe contener sólo números',
      'number.min': 'El teléfono debe contener al menos {#limit} dígitos',
      'number.max': 'El teléfono debe contener como máximo {#limit} dígitos'
    })
})

module.exports = {
  telefonoSchemaCreate,
  telefonoSchemaUpdate
}