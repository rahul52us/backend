import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { PrismaService } from 'src/services/prisma.service';


@Injectable()
export class ExcelService {
  constructor(private readonly prisma: PrismaService) {}

  async importExcel(filePath: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    const rows = worksheet.getSheetValues();

    // Assuming the first row contains the column headers
    const headers = rows[0];

    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i];
      const record = {};

    //   for (let j = 0; j < headers.length; j++) {
    //     const header = headers[j];
    //     const value = rowData[j];
    //     record[header] = value;
    //   }

    //   await this.prisma.tableName.create({ data: record });
    }
  }
}
