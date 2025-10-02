const { telefonoSchema } = require("./index");

const validarTelefono = (req, res, next) => {
  const { error } = telefonoSchema.validate(req.body);
  if (error) {
    const errores = error.details.map((e) => {
      return { atributo: e.path[0], mensaje: e.message, tipoError: e.type };
    });
    return res.status(400).json({ errores });
  }
};

module.exports = {
  validarTelefono
}