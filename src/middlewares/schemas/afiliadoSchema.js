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

// Schema para datos de contacto
const contactosSchema = Joi.object({
  emails: Joi.array()
    .items(
      Joi.object({
        direccion: Joi.string().email().required().messages({
          "string.base": "El email debe ser una cadena de texto",
          "string.email": "El email debe tener un formato válido",
          "any.required": "El email es obligatorio",
        }),
      })
    )
    .min(1)
    .unique()
    .required()
    .messages({
      "array.base": "Los emails deben estar dentro de un array",
      "array.min": "Debe haber al menos {#limit} email(s)",
      "array.unique": "Los emails no deben repetirse",
      "any.required": "Los emails son obligatorios",
    }),

  telefonos: Joi.array()
    .items(
      Joi.object({
        numero: Joi.string()
          .pattern(/^[0-9]+$/)
          .required()
          .messages({
            "string.base": "El teléfono debe ser una cadena de texto",
            "string.pattern": "El teléfono debe contener sólo números",
            "any.required": "El teléfono es obligatorio",
          }),
      })
    )
    .min(1)
    .unique()
    .required()
    .messages({
      "array.base": "Los teléfonos deben estar dentro de un array",
      "array.min": "Debe haber al menos {#limit} teléfono(s)",
      "array.unique": "Los teléfonos no deben repetirse",
      "any.required": "Los teléfonos son obligatorios",
    }),
});

// Schema para direcciones
const direccionSchema = Joi.object({
  direcciones: Joi.array()
    .items(
      Joi.object({
        calle: Joi.string().min(3).max(100).required().messages({
          "string.base": "La calle debe ser una cadena de texto",
          "string.min": "La calle debe tener al menos {#limit} caracteres",
          "string.max": "La calle debe tener como máximo {#limit} caracteres",
          "any.required": "La calle es obligatoria",
        }),
        altura: Joi.number().integer().max(1000000).required().messages({
          "number.base": "La altura debe ser un número",
          "number.integer": "La altura debe ser un número entero",
          "number.max": "La altura debe ser como máximo {#limit}",
          "any.required": "La altura es obligatoria",
        }),
        pisoDepto: Joi.string().optional().allow("").messages({
          "string.base": "El piso/departamento debe ser una cadena de texto",
        }),
        codigoPostal: Joi.string().optional().allow("").messages({
          "string.base": "El código postal debe ser una cadena de texto",
        }),
        localidad: Joi.string().min(3).max(100).required().messages({
          "string.base": "La localidad debe ser una cadena de texto",
          "string.min": "La localidad debe tener al menos {#limit} caracteres",
          "string.max":
            "La localidad debe tener como máximo {#limit} caracteres",
          "any.required": "La localidad es obligatoria",
        }),
        provincia: Joi.number().integer().required().messages({
          "number.base": "El ID de la provincia debe ser un número",
          "number.integer": "El ID de la provincia debe ser un número entero",
          "any.required": "El ID de la provincia es obligatorio",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Las direcciones deben estar dentro de un array",
      "array.min": "Debe haber al menos {#limit} dirección(es)",
      "any.required": "Las direcciones son obligatorias",
    }),
});
