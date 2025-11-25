const PDFDocument = require('pdfkit-table');

const generarReporteAfiliadoPDF = (data, dataCallBack, endCallBack) => {
    const pdf = new PDFDocument({ margin: 30, size: 'A4' })

    pdf.on('data', dataCallBack);
    pdf.on('end', endCallBack);

    const x = pdf.x;
    const y = pdf.y;

    pdf.image('public/logo.png', x + 120, y, {width: 60})
    .fontSize(30).text('MedIntegral', x, y + 20, { align: 'center' });
    pdf.moveDown();

    pdf.fontSize(15).text(data.tittle);
    pdf.moveDown();

    const tableArray = {
        headers: data.headers, 
        datas: data.datas
    };

    pdf.table( tableArray, {
            rowsHeight: 25,
            prepareHeader: () => pdf.fontSize(12),
            prepareRow: (row, indexColumn, indexRow, rectRow) => {
                pdf.fontSize(10);
                pdf.text(row[indexColumn], rectRow.x, rectRow.y, {
                    width: rectRow.width,
                    align: "center" 
                });
            },
        }
    );

    pdf.end()
}

module.exports = { generarReporteAfiliadoPDF };