import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import {
  getsCategoryValidation,
  notesCreateCategoryValidation,
} from './common/notes.validation';
import { SuccessNotesReturnDto } from './common/notes.dto';
import * as moment from 'moment';
import { convertToMessageResponse } from '../common/function';
import { pageSizeLimit } from '../common/constant.variabl';
import { FileStorageService } from '../FileStorage/fileStorage.service';
import { acceptNotes, notesDirectory } from 'src/common/constant';

@Injectable()
export class NotesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async createNotesCategory(notes: any): Promise<SuccessNotesReturnDto> {
    try {
      const result = notesCreateCategoryValidation.validate(notes);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const fetchNotes = await this.prismaService.notesCategory.findFirst({
          where: {
            name: notes.name,
            OR: [
              {
                startYear: {
                  lte: new Date(notes.endYear),
                },
                endYear: {
                  gte: new Date(notes.startYear),
                },
              },
              {
                startYear: {
                  gte: new Date(notes.startYear),
                  lte: new Date(notes.endYear),
                },
              },
            ],
            adminUserId: notes.adminUserId,
          },
        });
        if (fetchNotes) {
          throw new HttpException(
            `${fetchNotes.name} category name is ready exists from ${moment(
              fetchNotes.startYear,
            ).format('DD-MM-YYYY')} to ${moment(fetchNotes.endYear).format(
              'DD-MM-YYYY',
            )}`,
            400,
          );
        } else {
          const createdData = await this.prismaService.notesCategory.create({
            data: {
              name: notes.name,
              startYear: new Date(notes.startYear),
              endYear: new Date(notes.endYear),
              adminUserId: notes.adminUserId,
              createdBy: notes.createdBy,
              description: notes.description,
            },
            include: { Notes: true },
          });
          if (createdData) {
            return {
              data: createdData,
              message: `${notes.name} category has been created from ${notes.startYear} to ${notes.endYear} Successfully`,
              statusCode: 201,
              success: true,
            };
          } else {
            throw new HttpException(
              `cannot create category for now,  please try again later`,
              400,
            );
          }
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async getCategoryNotes(data: any): Promise<SuccessNotesReturnDto> {
    try {
      const {
        adminUserId,
        startYear,
        endYear,
        createdBy,
        page,
        search,
        limit,
      } = data;
      const validate = getsCategoryValidation.validate(data);
      if (validate.error) {
        throw new HttpException(await convertToMessageResponse(validate), 422);
      } else {
        const pageSize = limit || pageSizeLimit;
        const skip = (page - 1) * pageSize;

        const result = await this.prismaService.$transaction([
          this.prismaService.notesCategory.findMany({
            where: {
              adminUserId,
              startYear: startYear ? { gte: new Date(startYear) } : undefined,
              endYear: endYear ? { lte: new Date(endYear) } : undefined,
              createdBy: createdBy ? { contains: createdBy } : undefined,
              OR: search ? [{ name: { contains: search } }] : undefined,
            },
            take: limit ? Math.min(limit, pageSize) : pageSize,
            skip,
          }),
          this.prismaService.notesCategory.count({
            where: {
              adminUserId,
              startYear: startYear ? { gte: new Date(startYear) } : undefined,
              endYear: endYear ? { lte: new Date(endYear) } : undefined,
              createdBy: createdBy ? { contains: createdBy } : undefined,
              OR: search ? [{ name: { contains: search } }] : undefined,
            },
          }),
        ]);

        const categories = result[0];
        const totalCount = result[1];
        const totalPages = Math.ceil(totalCount / pageSize);
        const remainingPages = Math.max(totalPages - page, 0);
        const hasNextPage = remainingPages > 0;

        return {
          data: {
            categories,
            totalPages,
            totalCount,
            remainingPages,
            currentPage: page,
            hasNextPage,
            hasPreviousPage: page > 1,
          },
          success: true,
          message: 'Fetch Categories successfully',
          statusCode: 200,
        };
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async createNotes(data: any): Promise<SuccessNotesReturnDto> {
    let fileData = null;
    try {
      fileData = await this.fileStorageService.uploadFileToLocalStorage(
        data.file,
        notesDirectory,
        data.adminUserId,
        acceptNotes,
      );

      const categoryResult = await this.prismaService.notesCategory.findFirst({
        where: { id: data.categoryId },
      });
      if (!categoryResult) {
        throw new HttpException('Category does not exist', 400);
      }

      const createdData = await this.prismaService.notes.create({
        data: {
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          adminUserId: data.adminUserId,
          noteLink: fileData.filePath,
          createdBy: data.createdBy,
        },
      });

      if (!createdData) {
        throw new HttpException('Cannot create the notes', 400);
      }

      return {
        data: createdData,
        success: true,
        message: 'Notes has been created successfully',
        statusCode: 201,
      };
    } catch (err) {
      console.log(fileData.fileName)
      if (fileData) {
        const fileExists = await this.fileStorageService.checkFileExistsInLocalStorage(
          notesDirectory,
          fileData.fileName,
        );

        if (fileExists) {
          console.log(fileData.fileName)
          await this.fileStorageService.deleteFileFromLocalStorage(notesDirectory,fileData.fileName)
        }
      }

      throw new HttpException(err.message, err.status || 500);
    }
  }

}
