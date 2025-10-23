const Joi = require("joi");

// Schema base para datos personales
const datosPersonalesSchema = Joi.object({
  tipoDocumentoId: Joi.number().integer().required().messages({
    "number.base": "El ID de tipo de documento debe ser un número",
    "number.integer": "El ID de tipo de documento debe ser un número entero",
    "any.required": "El ID de tipo de documento es obligatorio",
  }),

  numeroDocumento: Joi.string()
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.base": "El numero de documento debe ser una cadena de texto",
      "string.pattern": "El numero de documento debe contener sólo números",
      "any.required": "El numero de documento es obligatorio",
    }),

  fechaNacimiento: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.base": "La fecha de nacimiento debe ser una cadena de texto",
      "string.pattern":
        "La fecha de nacimiento debe tener el formato YYYY-MM-DD",
      "any.required": "La fecha de nacimiento es obligatoria",
    }),

  nombre: Joi.string().min(3).max(100).required().messages({
    "string.base": "El nombre debe ser una cadena de texto",
    "string.min": "El nombre debe tener al menos {#limit} caracteres",
    "string.max": "El nombre debe tener como máximo {#limit} caracteres",
    "any.required": "El nombre es obligatorio",
  }),

  apellido: Joi.string().min(3).max(100).required().messages({
    "string.base": "El apellido debe ser una cadena de texto",
    "string.min": "El apellido debe tener al menos {#limit} caracteres",
    "string.max": "El apellido debe tener como máximo {#limit} caracteres",
    "any.required": "El apellido es obligatorio",
  }),

  vigenciaInicio: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.base":
        "La fecha de inicio de vigencia debe ser una cadena de texto",
      "string.pattern":
        "La fecha de inicio de vigencia debe tener el formato YYYY-MM-DD",
      "any.required": "La fecha de inicio de vigencia es obligatoria",
    }),

  vigenciaFin: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.base": "La fecha de fin de vigencia debe ser una cadena de texto",
      "string.pattern":
        "La fecha de fin de vigencia debe tener el formato YYYY-MM-DD",
    }),
});