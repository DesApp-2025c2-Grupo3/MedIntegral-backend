const { TipoDocumento } = require("../db/models");

const obtenerTiposDocumentos = async (_, res) => {
  const documentos = await TipoDocumento.findAll();
  res.status(200).json(documentos);
};

module.exports = {
  obtenerTiposDocumentos,
};
