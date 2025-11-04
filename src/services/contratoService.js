const { Contrato } = require("../db/models");

const generarProximoNAfiliado = async () => {
  const ultimoContrato = await Contrato.findOne({
    order: [['nAfiliado', 'DESC']],
    attributes: ['nAfiliado']
  });
  
  return ultimoContrato ? ultimoContrato.nAfiliado + 1 : 1;
};

module.exports = { generarProximoNAfiliado }; 