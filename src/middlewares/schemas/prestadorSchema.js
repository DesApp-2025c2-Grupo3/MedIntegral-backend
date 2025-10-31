const Joi = require("joi");

const prestadorSchemaCreate = Joi.object({

  nombre: Joi.string().min(3).max(100).required().messages({
    "string.base": "El nombre debe ser una cadena de texto",
    "string.min": "El nombre debe tener al menos {#limit} caracteres",
    "string.max": "El nombre debe tener como máximo {#limit} caracteres",
    "any.required": "El nombre es obligatorio",
  }),

  cuilCuit: Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
    "string.base": "El CUIL/CUIT debe ser una cadena de texto",
    "string.length": "El CUIL/CUIT debe tener exactamente {#limit} dígitos",
    "string.pattern": "El CUIL/CUIT debe contener sólo números",
    "any.required": "El CUIL/CUIT es obligatorio",
  }),

  esCentroMedico: Joi.boolean().required().messages({
    "boolean.base": "esCentroMedico debe ser un valor booleano",
    "any.required": "esCentroMedico es obligatorio",
  }),

  integraCentroMedico: Joi.when('esCentroMedico', {
    is: false,
    then: Joi.boolean().required().messages({
      'boolean.base': 'integraCentroMedico debe ser un valor booleano',
      'any.required': 'integraCentroMedico es obligatorio cuando esCentroMedico es false'
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'No se debe proporcionar integraCentroMedico cuando esCentroMedico es true'
    })
  }),

  centroMedicoQueIntegra: Joi.when('integraCentroMedico', {
    is: true,
    then: Joi.number().integer().required().messages({
      'number.base': 'El ID del centro médico debe ser un número',
      'number.integer': 'El ID del centro médico debe contener sólo números',
      'any.required': 'El ID del centro médico es obligatorio cuando integraCentroMedico es true'
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'No se debe proporcionar centroMedicoQueIntegra cuando integraCentroMedico es false'
    })
  }),

  especialidades: Joi.array().items(
    Joi.number().integer().required().messages({
      "number.base": "El ID de la especialidad debe ser un número",
      "number.integer": "El ID de la especialidad debe ser un número entero",
      "any.required": "El ID de la especialidad es obligatorio",
    })
  ).min(1).unique().required().messages({
    "array.base": "Las especialidades deben estar dentro de un array",
    "array.min": "Debe haber al menos {#limit} especialidad(es)",
    "array.unique": "Las especialidades no deben repetirse",
    "any.required": "Las especialidades son obligatorias",
  }),

  emails: Joi.array().items(
    Joi.object({
      direccion: Joi.string().email().required().messages({
        "string.base": "El email debe ser una cadena de texto",
        "string.email": "El email debe tener un formato válido",
        "any.required": "El email es obligatorio",
      }),
    })
  ).min(1).unique().required().messages({
    "array.base": "Los emails deben estar dentro de un array",
    "array.min": "Debe haber al menos {#limit} email(s)",
    "array.unique": "Los emails no deben repetirse",
    "any.required": "Los emails son obligatorios",
  }),

  telefonos: Joi.array().items(
    Joi.object({
      numero: Joi.string().pattern(/^[0-9]+$/).required().messages({
        "string.base": "El teléfono debe ser una cadena de texto",
        "string.pattern": "El teléfono debe contener sólo números",
        "any.required": "El teléfono es obligatorio",
      }),
    })
  ).min(1).unique().required().messages({
    "array.base": "Los teléfonos deben estar dentro de un array",
    "array.min": "Debe haber al menos {#limit} teléfono(s)",
    "array.unique": "Los teléfonos no deben repetirse",
    "any.required": "Los teléfonos son obligatorios",
  }),

  lugaresAtencion: Joi.array().items(
    Joi.object({
      calle: Joi.string().min(3).max(100).required().messages({
        'string.base': 'La calle debe ser una cadena de texto',
        'string.min': 'La calle debe tener al menos {#limit} caracteres',
        'string.max': 'La calle debe tener como máximo {#limit} caracteres',
        'any.required': 'La calle es obligatoria'
      }),
      altura: Joi.number().integer().max(1000000).required().messages({
        'number.base': 'La altura debe ser un número',
        'number.integer': 'La altura debe ser un número entero',
        'number.max': 'La altura debe ser como máximo {#limit}',
        'any.required': 'La altura es obligatoria'
      }),
      pisoDepto: Joi.string().messages({
        'string.base': 'El piso/departamento debe ser una cadena de texto'
      }),
      codigoPostal: Joi.string().messages({
        'string.base': 'El código postal debe ser una cadena de texto'
      }),
      localidad: Joi.string().min(3).max(100).required().messages({
        'string.base': 'La localidad debe ser una cadena de texto',
        'string.min': 'La localidad debe tener al menos {#limit} caracteres',
        'string.max': 'La localidad debe tener como máximo {#limit} caracteres',
        'any.required': 'La localidad es obligatoria'
      }),
      provincia: Joi.number().integer().required().messages({
        'number.base': 'El ID de la provincia debe ser un número',
        'number.integer': 'El ID de la provincia debe ser un número entero',
        'any.required': 'El ID de la provincia es obligatorio'
      }),
      horarios: Joi.array().items(
        Joi.object({
          horaInicio: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required().messages({
            'string.base': 'La hora de inicio debe ser una cadena de texto',
            'string.pattern.base': 'La hora de inicio debe tener el formato HH:MM (24 horas)',
            'any.required': 'La hora de inicio es obligatoria'
          }),
          horaFin: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required().messages({
            'string.base': 'La hora de fin debe ser una cadena de texto',
            'string.pattern.base': 'La hora de fin debe tener el formato HH:MM (24 horas)',
            'any.required': 'La hora de fin es obligatoria'
          }),
          dias: Joi.array().items(
            Joi.string().valid('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo').required().messages({
              'string.base': 'El día debe ser una cadena de texto',
              'any.required': 'El día es obligatorio',
              'any.only': 'El día debe ser uno de los siguientes: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo'
            })
          ).min(1).unique().required().messages({
            'array.base': 'Los días deben estar dentro de un array',
            'array.min': 'Debe haber al menos {#limit} día(s)',
            'array.unique': 'Los días no deben repetirse',
            'any.required': 'Los días son obligatorios'
          })
        })
      ).min(1).unique().required().messages({
        'array.base': 'Los horarios deben estar dentro de un array',
        'array.min': 'Debe haber al menos {#limit} horario(s)',
        'array.unique': 'Los horarios no deben repetirse',
        'any.required': 'Los horarios son obligatorios'
      })
    })
  ).min(1).unique().required().messages({
    'array.base': 'Los lugares de atención deben estar dentro de un array',
    'array.min': 'Debe haber al menos {#limit} lugar(es) de atención',
    'array.unique': 'Los lugares de atención no deben repetirse',
    'any.required': 'Los lugares de atención son obligatorios'
  })
});

const prestadorSchemaUpdateDatosPersonales = Joi.object({

  nombre: Joi.string().min(3).max(100).required().messages({
    "string.base": "El nombre debe ser una cadena de texto",
    "string.min": "El nombre debe tener al menos {#limit} caracteres",
    "string.max": "El nombre debe tener como máximo {#limit} caracteres",
    "any.required": "El nombre es obligatorio",
  }),

  cuilCuit: Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
    "string.base": "El CUIL/CUIT debe ser una cadena de texto",
    "string.length": "El CUIL/CUIT debe tener exactamente {#limit} dígitos",
    "string.pattern": "El CUIL/CUIT debe contener sólo números",
    "any.required": "El CUIL/CUIT es obligatorio",
  }),

  emails: Joi.array().items(
    Joi.object({
      direccion: Joi.string().email().required().messages({
        "string.base": "El email debe ser una cadena de texto",
        "string.email": "El email debe tener un formato válido",
        "any.required": "El email es obligatorio",
      }),
    })
  ).min(1).unique().required().messages({
    "array.base": "Los emails deben estar dentro de un array",
    "array.min": "Debe haber al menos {#limit} email(s)",
    "array.unique": "Los emails no deben repetirse",
    "any.required": "Los emails son obligatorios",
  }),

  telefonos: Joi.array().items(
    Joi.object({
      numero: Joi.string().pattern(/^[0-9]+$/).required().messages({
        "string.base": "El teléfono debe ser una cadena de texto",
        "string.pattern": "El teléfono debe contener sólo números",
        "any.required": "El teléfono es obligatorio",
      }),
    })
  ).min(1).unique().required().messages({
    "array.base": "Los teléfonos deben estar dentro de un array",
    "array.min": "Debe haber al menos {#limit} teléfono(s)",
    "array.unique": "Los teléfonos no deben repetirse",
    "any.required": "Los teléfonos son obligatorios",
  })

});

const prestadorSchemaUpdateLugaresAtencion = Joi.object({

  lugaresAtencion: Joi.array().items(
    Joi.object({
      calle: Joi.string().min(3).max(100).required().messages({
        'string.base': 'La calle debe ser una cadena de texto',
        'string.min': 'La calle debe tener al menos {#limit} caracteres',
        'string.max': 'La calle debe tener como máximo {#limit} caracteres',
        'any.required': 'La calle es obligatoria'
      }),
      altura: Joi.number().integer().max(1000000).required().messages({
        'number.base': 'La altura debe ser un número',
        'number.integer': 'La altura debe ser un número entero',
        'number.max': 'La altura debe ser como máximo {#limit}',
        'any.required': 'La altura es obligatoria'
      }),
      pisoDepto: Joi.string().messages({
        'string.base': 'El piso/departamento debe ser una cadena de texto'
      }),
      codigoPostal: Joi.string().messages({
        'string.base': 'El código postal debe ser una cadena de texto'
      }),
      localidad: Joi.string().min(3).max(100).required().messages({
        'string.base': 'La localidad debe ser una cadena de texto',
        'string.min': 'La localidad debe tener al menos {#limit} caracteres',
        'string.max': 'La localidad debe tener como máximo {#limit} caracteres',
        'any.required': 'La localidad es obligatoria'
      }),
      provincia: Joi.number().integer().required().messages({
        'number.base': 'El ID de la provincia debe ser un número',
        'number.integer': 'El ID de la provincia debe ser un número entero',
        'any.required': 'El ID de la provincia es obligatorio'
      }),
      horarios: Joi.array().items(
        Joi.object({
          horaInicio: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required().messages({
            'string.base': 'La hora de inicio debe ser una cadena de texto',
            'string.pattern.base': 'La hora de inicio debe tener el formato HH:MM (24 horas)',
            'any.required': 'La hora de inicio es obligatoria'
          }),
          horaFin: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required().messages({
            'string.base': 'La hora de fin debe ser una cadena de texto',
            'string.pattern.base': 'La hora de fin debe tener el formato HH:MM (24 horas)',
            'any.required': 'La hora de fin es obligatoria'
          }),
          dias: Joi.array().items(
            Joi.string().valid('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo').required().messages({
              'string.base': 'El día debe ser una cadena de texto',
              'any.required': 'El día es obligatorio',
              'any.only': 'El día debe ser uno de los siguientes: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo'
            })
          ).min(1).unique().required().messages({
            'array.base': 'Los días deben estar dentro de un array',
            'array.min': 'Debe haber al menos {#limit} día(s)',
            'array.unique': 'Los días no deben repetirse',
            'any.required': 'Los días son obligatorios'
          })
        })
      ).min(1).unique().required().messages({
        'array.base': 'Los horarios deben estar dentro de un array',
        'array.min': 'Debe haber al menos {#limit} horario(s)',
        'array.unique': 'Los horarios no deben repetirse',
        'any.required': 'Los horarios son obligatorios'
      })
    })
  ).min(1).unique().required().messages({
    'array.base': 'Los lugares de atención deben estar dentro de un array',
    'array.min': 'Debe haber al menos {#limit} lugar(es) de atención',
    'array.unique': 'Los lugares de atención no deben repetirse',
    'any.required': 'Los lugares de atención son obligatorios'
  })

});

const prestadorSchemaUpdateEspecialidades = Joi.object({

  especialidades: Joi.array().items(
    Joi.number().integer().required().messages({
      "number.base": "El ID de la especialidad debe ser un número",
      "number.integer": "El ID de la especialidad debe ser un número entero",
      "any.required": "El ID de la especialidad es obligatorio",
    })
  ).min(1).unique().required().messages({
    "array.base": "Las especialidades deben estar dentro de un array",
    "array.min": "Debe haber al menos {#limit} especialidad(es)",
    "array.unique": "Las especialidades no deben repetirse",
    "any.required": "Las especialidades son obligatorias",
  })

});

const prestadorSchemaUpdateCentroMedico = Joi.object({

  esCentroMedico: Joi.boolean().required().messages({
    "boolean.base": "esCentroMedico debe ser un valor booleano",
    "any.required": "esCentroMedico es obligatorio",
  }),

  integraCentroMedico: Joi.when('esCentroMedico', {
    is: false,
    then: Joi.boolean().required().messages({
      'boolean.base': 'integraCentroMedico debe ser un valor booleano',
      'any.required': 'integraCentroMedico es obligatorio cuando esCentroMedico es false'
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'No se debe proporcionar integraCentroMedico cuando esCentroMedico es true'
    })
  }),

  centroMedicoQueIntegra: Joi.when('integraCentroMedico', {
    is: true,
    then: Joi.number().integer().required().messages({
      'number.base': 'El ID del centro médico debe ser un número',
      'number.integer': 'El ID del centro médico debe contener sólo números',
      'any.required': 'El ID del centro médico es obligatorio cuando integraCentroMedico es true'
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'No se debe proporcionar centroMedicoQueIntegra cuando integraCentroMedico es false'
    })
  })

});

module.exports = {
  prestadorSchemaCreate,
  prestadorSchemaUpdateDatosPersonales,
  prestadorSchemaUpdateLugaresAtencion,
  prestadorSchemaUpdateEspecialidades,
  prestadorSchemaUpdateCentroMedico
};
