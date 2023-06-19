import { Injectable, HttpException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ReturnSuccessTestimonial } from './common/testimonial.dto';
import {
  TestimonialCreate,
  TestimonialDeleteValidation,
  TestimonialGetSingleValidation,
  TestimonialGetValidation,
  TestimonialUpdateValidation,
} from './common/testimonial.validation';
import * as ExcelJS from 'exceljs';
import { deleteTestimonialsFun } from 'src/common/uploadHelpers';
import { generateExcel } from '../common/generateExcel.users';
import { TestimonialColumns } from './common/testimonial.utils';
import { pageSizeLimit } from '../common/constant.variabl';
import { convertToMessageResponse } from '../common/function';

@Injectable()
export class TestimonialService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(TestimonialService.name);
  async createTestimonial(testimonial: any): Promise<ReturnSuccessTestimonial> {
    try {
      const result = TestimonialCreate.validate(testimonial);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const testimonials = await this.prismaService.testimonial.create({
          data: {
            adminUserId: testimonial.adminUserId,
            description: testimonial.description,
            pic: testimonial.pic,
            name: testimonial.name,
            profession: testimonial.profession,
          },
        });
        if (testimonials) {
          return {
            success: true,
            data: testimonials,
            message: 'Testimonial has been created Succcessfully',
            statusCode: 201,
          };
        } else {
          throw new HttpException(
            'cannot create testimonial , something went wrong ',
            400,
          );
        }
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async UpdateTestimonial(testimonial: any): Promise<ReturnSuccessTestimonial> {
    try {
      const result = TestimonialUpdateValidation.validate(testimonial);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const test = await this.prismaService.testimonial.findUnique({
          where: { id: testimonial.id },
        });
        if (test && test?.adminUserId === testimonial.adminUserId) {
          const updatedTestimonial =
            await this.prismaService.testimonial.update({
              where: { id: testimonial.id },
              data: {
                adminUserId: testimonial.adminUserId,
                name: testimonial.name,
                pic: testimonial.pic
                  ? testimonial.pic
                  : testimonial.is_deleted
                  ? null
                  : test.pic,
                description: testimonial.description,
                profession: testimonial.profession,
              },
            });
          if (updatedTestimonial) {
            if (testimonial.is_deleted) {
              deleteTestimonialsFun(test.pic);
            }
            return {
              success: true,
              message: 'Testimonial updated Successfully',
              statusCode: 200,
              data: updatedTestimonial,
            };
          } else {
            throw new HttpException('testimonial does not exists', 400);
          }
        } else {
          throw new HttpException('testimonial does not exists', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async getSingleTestimonial(
    testimonial: any,
  ): Promise<ReturnSuccessTestimonial> {
    try {
      const result = TestimonialGetSingleValidation.validate(testimonial);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const singleTestimonial =
          await this.prismaService.testimonial.findUnique({
            where: { id: testimonial.id },
          });
        if (singleTestimonial) {
          return {
            success: true,
            message: 'get Testimonial Successfully',
            statusCode: 200,
            data: singleTestimonial,
          };
        } else {
          throw new HttpException('cannot get this testimonial', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async getTestimonials(testimonial: any): Promise<ReturnSuccessTestimonial> {
    try {
      const result = TestimonialGetValidation.validate(testimonial);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const pageSize = testimonial.limit || pageSizeLimit;
        const skip = (testimonial.page - 1) * pageSize;

        const result = await this.prismaService.$transaction([
           this.prismaService.testimonial.findMany({
            where: {
              adminUserId: testimonial.userId,
              OR: testimonial.search ? [{ name : { contains: testimonial.search } }] : undefined,
            },
            take: testimonial.limit ? Math.min(testimonial.limit, pageSize) : pageSize,
            skip,
            orderBy: { createdAt: 'desc' },
          }),
        ]);
        const data = result[0];
        return {
          data,
          success: true,
          message: 'Get Testimonials successfully',
          statusCode: 200,
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async deleteTestimonials(
    testimonial: any,
  ): Promise<ReturnSuccessTestimonial> {
    try {
      const result = TestimonialDeleteValidation.validate(testimonial);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const Testimonials = await this.prismaService.testimonial.delete({
          where: { id: testimonial.id },
        });
        if (Testimonials) {
          if (Testimonials.pic) {
            deleteTestimonialsFun(Testimonials.pic);
          }
          return {
            success: true,
            message: 'Delete Testimonials Successfully',
            statusCode: 200,
            data: Testimonials,
          };
        } else {
          throw new HttpException('cannot delete testimonial', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async downloadTestimonialSheet(recieveData: any, res: any): Promise<any> {
    try {
      const testimonials = await this.prismaService.testimonial.findMany({
        where: {
          adminUserId: recieveData.bodyData['adminUserId'],
        },
      });

      const columns = [
        { key: 'name', name: 'Name', type: 'text' },
        { key: 'profession', name: 'Profession', type: 'text' },
        { key: 'pic', name: 'Profile Picture', type: 'link' },
        { key: 'createdAt', name: 'Created Date' },
        { key: 'description', name: 'Description', type: 'text' },
      ];

      await generateExcel(
        columns,
        testimonials,
        res,
        'Testimonial List',
        'Testimonial Data',
        'testimonial',
      );
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async importExcel(datas: any): Promise<any> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(datas.file.buffer);

      const worksheet = workbook.getWorksheet(1); // Assuming the data is in the first sheet

      // check the length of the data
      if (worksheet.rowCount >= 11) {
        throw new HttpException(
          'Testimonial data cannot be greater than 10 in excel sheet',
          400,
        );
      }

      const data = [];

      const columnNamesRow = worksheet.getRow(1);
      const columnNames = [];
      const testimonialColumnsMap = new Map(TestimonialColumns.map((columnObj) => [columnObj.label, columnObj]));

      columnNamesRow.eachCell((cell, colNumber) => {
      const columnName = String(cell.value); // Convert columnName to string
      const columnObj = testimonialColumnsMap.get(columnName);

      if (!columnObj) {
        throw new HttpException(`Unacceptable column name found: ${columnName}`, 400);
      }

      if (columnObj.accept) {
      const key = columnObj.key;
      columnNames[colNumber] = key;
    }
  });



      // Process data rows
      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const dataRow = {};
        const rowData = worksheet.getRow(rowNumber);
        let hasEmptyRequiredValue = false; // Flag to track empty required values

        rowData.eachCell((cell, colNumber) => {
          const columnName = columnNames[colNumber];
          const labelObj = TestimonialColumns.find((obj) => obj.key === columnName);

          if (labelObj) {
            const key = labelObj.key;
            if (labelObj.accept) {
              let cellValue = cell.text;
              if (labelObj.required && !cellValue.trim()) {
                const rowLabel = rowNumber - 1; // Adjust row number to match worksheet row index
                throw new HttpException(`Row ${rowLabel}: Required value is empty for column ${columnName}`, 400);
              }
              dataRow[key] = cellValue;
            } else {
              throw new HttpException(
                `Column ${columnName} is not acceptable`,
                400,
              );
            }
          } else {
            throw new HttpException(`Column ${columnName} is not valid`, 400);
          }
        });

        dataRow['adminUserId'] = datas.adminUserId;
        data.push(dataRow);
      }

      const createdData = await this.prismaService.testimonial.createMany({
        data: data,
        skipDuplicates: true,
      });

      if (createdData) {
        return {
          success: true,
          message: `${createdData?.count} testimonials new data has been created successfully`,
          data: createdData,
          statusCode: 200,
        };
      } else {
        throw new HttpException(
          'something went wrong, cannot create the testimonials',
          400,
        );
      }
    } catch (err) {
      console.log(err.message)
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }
}
