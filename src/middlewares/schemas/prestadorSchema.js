const Joi = require('joi')

const prestadorSchemaCreate = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre debe ser una cadena de texto',
      'string.min': 'El nombre debe tener al menos {#limit} caracteres',
      'string.max': 'El nombre debe tener como máximo {#limit} caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
  cuilCuit: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'El CUIL/CUIT debe ser un número',
      'number.integer': 'El CUIL/CUIT debe contener sólo números',
      'any.required': 'El CUIL/CUIT es obligatorio'
    }),
  esCentroMedico: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'esCentroMedico debe ser un valor booleano',
      'any.required': 'esCentroMedico es obligatorio'
    }),
  integraCentroMedico: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'integraCentroMedico debe ser un valor booleano',
      'any.required': 'integraCentroMedico es obligatorio'
    }),

  // Campos nuevos permitidos:
  especialidades: Joi.array().items(Joi.number()).min(1)
    .required()
    .messages({
      'array.base': 'Las especialidades deben estar dentro de un array',
      'array.min': 'Debe haber al menos {#limit} especialidad(es)',
      'any.required': 'Las especialidades son obligatorias'
    }),


  emails: Joi.array().items(
    Joi.object({
      direccion: Joi.string().email().required().messages({
        'string.base': 'El email debe ser una cadena de texto',
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es obligatorio'
      })
    })
  )
    .required()
    .messages({
      'array.base': 'Los emails deben estar dentro de un array',
      'any.required': 'Los emails son obligatorios'
    }),

  telefonos: Joi.array().items(
    Joi.object({
      numero: Joi.number()
        .integer()
        .required()
        .messages({
          'number.base': 'El teléfono debe ser un número',
          'number.integer': 'El teléfono debe contener sólo números',
          'any.required': 'Es obligatorio ingresar al menos un número de teléfono'
        })
    })
  ).min(1)
    .required()
    .messages({
      'array.base': 'Los teléfonos deben estar dentro de un array',
      'array.min': 'Debe haber al menos {#limit} teléfono(s)',
      'any.required': 'Los teléfonos son obligatorios'
    }),

  lugaresAtencion: Joi.array().items(
    Joi.object({
      calle: Joi.string().required(),
      altura: Joi.number().integer().required(),
      pisoDepto: Joi.string().allow('', null),
      codigoPostal: Joi.string().allow('', null),
      localidad: Joi.string().required(),
      provincia: Joi.object({
        nombre: Joi.string().required()
      }).required(),
      horarios: Joi.array().items(
        Joi.object({
          horaInicio: Joi.number().integer().required(),
          horaFin: Joi.number().integer().required(),
          dias: Joi.array().items(
            Joi.object({
              nombre: Joi.string()
            })
          ).required()
        })
      ).min(1).required()
    })
  ).min(1)
})

const prestadorSchemaUpdate = Joi.object({

})

module.exports = {
  prestadorSchemaCreate,
  prestadorSchemaUpdate
}