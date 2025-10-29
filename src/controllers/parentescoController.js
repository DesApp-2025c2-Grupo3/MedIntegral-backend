const { Parentesco } = require("../db/models");
const { Op } = require("sequelize");

const obtenerParentescos = async (_, res) => {
  const parentescos = await Parentesco.findAll({
    where: {
      relacion: { [Op.ne]: "Titular" },
    }
  });
  res.status(200).json(parentescos);
};

module.exports = {
  obtenerParentescos,
};