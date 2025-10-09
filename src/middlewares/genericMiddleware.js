// se utiliza para ver que peticion se hizo y que se envio, es para debuggear
const logRequest = (req, _, next) => {
    console.log({ method: req.method, url: req.url, fechaHora: new Date(), body: req.body, params: req.params });
    next();
};

// Se utiliza para verificar que exista la instancia de ese modelo con ese id en la base de datos
const existsModelById = (modelo) => {
  return async (req, _, next) => {
    try {
      const id = req.params.id;
      const data = await modelo.findByPk(id);
      if (!data) {
        return errorPersonalizado(`${modelo.name} con id ${id} no se encuentra registrado en la base de datos`, 404, next);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Se utiliza para verificar que al menos exista una instancia de ese modelo en la base de datos
const existsAnyByModel = (modelo) => {
  return async (req, res, next) => {
    try {
      const data = await modelo.findOne();
      if (!data) {
        return errorPersonalizado(`No hay ningún ${modelo.name} registrado`, 204, next);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Se utilizar para crear mensajes de error personalizados
const errorPersonalizado = (message, status, next) => {
    const err = new Error(message);
    err.status = status;
    return next(err);
};

// Maneja todos los errores que ocurren en las rutas
const manejoDeErroresGlobales = (err, req, res, next) => {        
  //console.error(err);  // Descomentar para debug
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return errorPersonalizado(messages, 400, next);
  }

  if (err.status) {
    return errorPersonalizado(err.message, err.status, next);
  }

  return errorPersonalizado('Error interno del servidor', 500, next);
};

// Valida que los campos enviados en el body sean exactamente los mismos que los del modelo
const validarCamposExactos = (modelo) => {
  return (req, _, next) => {
    const camposValidos = Object.keys(modelo.rawAttributes);
    const camposRecibidos = Object.keys(req.body);
    const camposInvalidos = camposRecibidos.filter(campo => !camposValidos.includes(campo));

    if (camposInvalidos.length > 0) {
      return errorPersonalizado(`Campos inválidos: ${camposInvalidos.join(', ')}`, 400, next);
    }
    next();
  };
};

// Cuando necesitamos validar el id de una entidad relacionada a la que estamos accediendo
const existModelRequest = (modelo) => {
  return async (req, _, next) => {
    const nombreModelo = modelo.name;
    const modeloId = req.body[nombreModelo.toLowerCase() + "Id"];

    if (!modeloId) {
      return errorPersonalizado(`El ID del ${nombreModelo} es requerido`, 400, next);
    }

    if (isNaN(modeloId)) {
      return errorPersonalizado(`El ID del ${nombreModelo} es inválido`, 400, next);
    }

    const aux = await modelo.findByPk(modeloId);
    if (!aux) {
      return errorPersonalizado(`${nombreModelo} con ID ${modeloId} no encontrado`, 404, next);
    }
    next();
  };
};

// Valida el esquema de los datos en el body usando Joi
const schemaValidator = (schema) => {
    return (req, res, next) => {
        try {
            const { error, _ } = schema.validate(req.body, { abortEarly: false });
            if (error) {
                const errores = error.details.map((e) => {
                    return { atributo: e.path[0], mensaje: e.message, tipoError: e.type };
                });
                return errorPersonalizado(JSON.stringify(errores), 400, next);
            }
        } catch (error) {
          return errorPersonalizado('Error en la validación del esquema', 500, next);
        }
        next();
    };
};
  
module.exports = { logRequest, existsModelById, existsAnyByModel, manejoDeErroresGlobales, errorPersonalizado, validarCamposExactos, existModelRequest, schemaValidator };