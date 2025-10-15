const Joi = require('joi')

const agendaTurnosSchemaCreate = Joi.object({

    prestadorId: Joi.number().integer().required().messages({
        'number.base': 'El ID del prestador debe ser un número',
        'number.integer': 'El ID del prestador debe ser un número entero',
        'any.required': 'El ID del prestador es obligatorio'
    }),

    especialidadId: Joi.number().integer().required().messages({
        'number.base': 'El ID de la especialidad debe ser un número',
        'number.integer': 'El ID de la especialidad debe ser un número entero',
        'any.required': 'El ID de la especialidad es obligatorio'
    }),

    lugaratencionId: Joi.number().integer().required().messages({
        'number.base': 'El ID del lugar de atención debe ser un número',
        'number.integer': 'El ID del lugar de atención debe ser un número entero',
        'any.required': 'El ID del lugar de atención es obligatorio'
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

            duracion: Joi.number().integer().min(1).max(60).required().messages({
                'number.base': 'La duración del turno debe ser un número',
                'number.integer': 'La duración del turno debe ser un número entero',
                'number.min': 'La duración del turno debe ser al menos 1 minuto',
                'number.max': 'La duración del turno no puede exceder los 60 minutos',
                'any.required': 'La duración del turno es obligatoria'
            }),

            dias: Joi.array().items(
                
                Joi.number().integer().required().messages({
                    'number.base': 'El ID del día debe ser un número',
                    'number.integer': 'El ID del día debe ser un número entero',
                    'any.required': 'El ID del día es obligatorio'
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

const agendaTurnosSchemaUpdate = Joi.object({

    prestadorId: Joi.number().integer().messages({
        'number.base': 'El ID del prestador debe ser un número',
        'number.integer': 'El ID del prestador debe ser un número entero'
    }),

    especialidadId: Joi.number().integer().messages({
        'number.base': 'El ID de la especialidad debe ser un número',
        'number.integer': 'El ID de la especialidad debe ser un número entero'
    }),

    lugaratencionId: Joi.number().integer().messages({
        'number.base': 'El ID del lugar de atención debe ser un número',
        'number.integer': 'El ID del lugar de atención debe ser un número entero'
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

            duracion: Joi.number().integer().min(1).max(60).required().messages({
                'number.base': 'La duración del turno debe ser un número',
                'number.integer': 'La duración del turno debe ser un número entero',
                'number.min': 'La duración del turno debe ser al menos 1 minuto',
                'number.max': 'La duración del turno no puede exceder los 60 minutos',
                'any.required': 'La duración del turno es obligatoria'
            }),

            dias: Joi.array().items(

                Joi.number().integer().required().messages({
                    'number.base': 'El ID del día debe ser un número',
                    'number.integer': 'El ID del día debe ser un número entero',
                    'any.required': 'El ID del día es obligatorio'
                })

            ).min(1).unique().required().messages({
                'array.base': 'Los días deben estar dentro de un array',
                'array.min': 'Debe haber al menos {#limit} día(s)',
                'array.unique': 'Los días no deben repetirse',
                'any.required': 'Los días son obligatorios'
            })

        })

    ).min(1).unique().messages({
        'array.base': 'Los horarios deben estar dentro de un array',
        'array.min': 'Debe haber al menos {#limit} horario(s)',
        'array.unique': 'Los horarios no deben repetirse'
    })

})

module.exports = {
    agendaTurnosSchemaCreate,
    agendaTurnosSchemaUpdate
}