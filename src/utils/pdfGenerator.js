const PDFDocument = require('pdfkit-table');

const generarReporteAfiliadoPDF = (dataCallBack, endCallBack) => {
    const pdf = new PDFDocument({ margin: 30, size: 'A4' })

    pdf.on('data', dataCallBack);
    pdf.on('end', endCallBack);

    pdf.fontSize(20).text('Reporte Situaciones Terapéuticas');

    const tableArray = {
        headers: ["Afiliado/s", "DNI", "Situaciones Terapéuticas", "Vigencia Inicio", "Vigencia Fin"],
        rows: [
        ["Alvarez Melina", "46569284", "Diabetes", "20/10/2025", "20/10/2026"],
        ["Alvarez Luciano", "48878921", "Embarazo", "20/10/2025", "20/10/2026"],
        ["Alvarez Nicolas", "51493711", "Embarazo", "20/10/2025", "-"],
        ],
    };
    pdf.table( tableArray, {
    prepareHeader: () => pdf.fontSize(12),
    prepareRow: (row, i) => pdf.fontSize(10),
  });

    pdf.end()
}

module.exports = { generarReporteAfiliadoPDF };