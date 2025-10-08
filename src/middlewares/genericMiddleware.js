const logRequest = (req, _, next) => {
    console.log({ method: req.method, url: req.url, fechaHora: new Date(), body: req.body, params: req.params });
    next();
};

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


const errorPersonalizado = (message, status, next) => {
    const err = new Error(message);
    err.status = status;
    return next(err);
};

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


const validarCamposExactos = (modelo) => {
  return (req, res, next) => {
    const camposValidos = Object.keys(modelo.rawAttributes);
    const camposRecibidos = Object.keys(req.body);
    const camposInvalidos = camposRecibidos.filter(campo => !camposValidos.includes(campo));

    if (camposInvalidos.length > 0) {
      return errorPersonalizado(`Campos inválidos: ${camposInvalidos.join(', ')}`, 400, next);
    }
    next();
  };
};

const existModelRequest = (modelo) => {
  return async (req, _, next) => {
    const nombreModelo = modelo.name;
    const modeloId = req.body[nombreModelo.toLowerCase() + "Id"];

    if (!modeloId) {
      return errorPersonalizado(`El ID del ${nombreModelo} es requerido`, 400, next);
    }

    if (isNaN(modeloId)) {  // Sequelize: ID numérico (o podrías usar UUID si aplica)
      return errorPersonalizado(`El ID del ${nombreModelo} es inválido`, 400, next);
    }

    const aux = await modelo.findByPk(modeloId);
    if (!aux) {
      return errorPersonalizado(`${nombreModelo} con ID ${modeloId} no encontrado`, 404, next);
    }
    next();
  };
};

  
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