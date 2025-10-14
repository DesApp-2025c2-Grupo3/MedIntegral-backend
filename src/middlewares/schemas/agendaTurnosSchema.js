const Joi = require('joi')

const agendaTurnosSchemaCreate = Joi.object({
    duracion: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'La duración debe ser un número',
            'number.integer': 'La duración debe ser un número entero',
            'any.required': 'La duración es obligatoria'
        }),
    prestadorId: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'El ID del prestador debe ser un número',
            'number.integer': 'El ID del prestador debe ser un número entero',
            'any.required': 'El ID del prestador es obligatorio'
        }),
    especialidadId: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'El ID de la especialidad debe ser un número',
            'number.integer': 'El ID de la especialidad debe ser un número entero',
            'any.required': 'El ID de la especialidad es obligatorio'
        }),
    lugaratencionId: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'El ID del lugar de atención debe ser un número',
            'number.integer': 'El ID del lugar de atención debe ser un número entero',
            'any.required': 'El ID del lugar de atención es obligatorio'
        }),
    horarios: Joi.array().items(
        Joi.object({
            horaInicio: Joi.string()
                .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/) // Formato HH:MM 24 horas
                .required()
                .messages({
                    'string.base': 'La hora de inicio debe ser una cadena de texto',
                    'string.pattern.base': 'La hora de inicio debe tener el formato HH:MM (24 horas)',
                    'any.required': 'La hora de inicio es obligatoria'
                }),
            horaFin: Joi.string()
                .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/) // Formato HH:MM 24 horas
                .required()
                .messages({
                    'string.base': 'La hora de fin debe ser una cadena de texto',
                    'string.pattern.base': 'La hora de fin debe tener el formato HH:MM (24 horas)',
                    'any.required': 'La hora de fin es obligatoria'
                }),
            dias: Joi.array().items(
                Joi.number()
                    .integer()
                    .required().messages({
                        'number.base': 'El ID del día debe ser un número',
                        'number.integer': 'El ID del día debe ser un número entero',
                        'any.required': 'El ID del día es obligatorio'
                    })
            ).required()
        })
    ).required().messages({
        'array.base': 'Los horarios deben estar dentro de un array',
        'any.required': 'Los horarios son obligatorios'
    })
})

const agendaTurnosSchemaUpdate = Joi.object({

})

module.exports = {
    agendaTurnosSchemaCreate,
    agendaTurnosSchemaUpdate
}