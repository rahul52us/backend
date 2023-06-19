import * as ExcelJS from 'exceljs';

export const generateExcel = async (
  columns: any,
  data: any,
  res: any,
  Sheettitle: string,
  title: string,
  fileName: string,
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(Sheettitle);

  // Set up the title row
  const titleRow = worksheet.addRow([title]);
  const titleCell = titleRow.getCell(1);
  titleCell.font = {
    bold: true,
    color: { argb: 'FFFFFF' },
    size: 16,
    name: 'Arial',
    family: 2,
  };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '2F75B5' },
  };
  titleCell.alignment = {
    horizontal: 'left',
    vertical: 'middle',
    indent: 1, // Set the indent value as per your requirement
  };
  titleRow.height = 60;
  worksheet.mergeCells(`A1:${String.fromCharCode(64 + columns.length)}1`);
  worksheet.getCell('B1').alignment = {
    vertical: 'middle',
  };

  // Set up the header row
  const headerRow = worksheet.addRow(columns.map((col) => col.name));
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.numFmt = '0.00';
  });

  // Add student data rows
  data.forEach((rowData : any) => {
    const rowValues = columns.map((column : any) => {
      const columnKey = column.key;
      if (columnKey === 'createdAt') {
        const createdAtDate = new Date(rowData[columnKey]);
        return createdAtDate.toLocaleDateString('en-GB');
      } else if (columnKey.includes('.')) {
        const nestedKeys = columnKey.split('.');
        let nestedValue = rowData;
        for (const key of nestedKeys) {
          nestedValue = nestedValue ? nestedValue[key] : undefined;
        }
        return nestedValue || '';
      } else {
        return rowData[columnKey] || '';
      }
    });

    const row = worksheet.addRow(rowValues);

    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
      cell.numFmt = '0.00';
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // Auto fit column widths based on content length
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 0;
      maxLength = Math.max(maxLength, columnLength);
    });

    column.width = maxLength < 12 ? 25 : maxLength + 10;
  });

  // Set up the response headers for file download
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);

  // Stream the file to the response
  await workbook.xlsx.write(res);

  res.end();
};
