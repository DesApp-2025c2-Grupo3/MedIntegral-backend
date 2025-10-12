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
    prestador: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'El ID del prestador debe ser un número',
            'number.integer': 'El ID del prestador debe ser un número entero',
            'any.required': 'El ID del prestador es obligatorio'
        }),
    especialidad: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'El ID de la especialidad debe ser un número',
            'number.integer': 'El ID de la especialidad debe ser un número entero',
            'any.required': 'El ID de la especialidad es obligatorio'
        }),
    lugarAtencion: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'El ID del lugar de atención debe ser un número',
            'number.integer': 'El ID del lugar de atención debe ser un número entero',
            'any.required': 'El ID del lugar de atención es obligatorio'
        }),
    horarios: Joi.array().items(
        Joi.object({
            horaInicio: Joi.number()
                .required()
                .messages({
                    'number.base': 'La hora de inicio debe ser un número',
                    'any.required': 'La hora de inicio es obligatoria'
                }),
            horaFin: Joi.number()
                .required()
                .messages({
                    'number.base': 'La hora de fin debe ser un número',
                    'any.required': 'La hora de fin es obligatoria'
                }),
            dias: Joi.array().items(
                Joi.number()
                    .integer()
                    .required()
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