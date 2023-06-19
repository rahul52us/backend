import { Injectable, HttpException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { SuccessReturnDto } from './common/constant';
import {
  VideosCreateCategoryValidation,
  VideosUpdatedCategoryValidation,
} from './common/validation';
import { convertToMessageResponse } from '../common/function';

@Injectable()
export class VideosServices {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(VideosServices.name);

  async createVideoCategory(bodyData: any): Promise<SuccessReturnDto> {
    try {
      const result = VideosCreateCategoryValidation.validate(bodyData);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const category = await this.prismaService.videosCategory.findFirst({
          where: {
            name: bodyData.name,
            adminUserId: bodyData.adminUserId,
          },
        });
        if (!category) {
          const categoryData = await this.prismaService.videosCategory.create({
            data: {
              name: bodyData.name,
              adminUserId: bodyData.adminUserId,
              createdBy: bodyData.createdBy,
              description: bodyData.description,
            },
          });
          if (categoryData) {
            return {
              success: true,
              message: `${categoryData.name} category has been created successfully`,
              data: categoryData,
              statusCode: 201,
            };
          } else {
            throw new HttpException('Something went wrong', 400);
          }
        } else {
          throw new HttpException(
            `${category.name} category already exists`,
            400,
          );
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async getCategory(bodyData: any): Promise<SuccessReturnDto> {
    try {
      const Categories = await this.prismaService.videosCategory.findMany({
        where: {
          adminUserId: bodyData.userId,
        },
      });
      return {
        success: true,
        data: Categories,
        message: 'get Categories successfully',
        statusCode: 200,
      };
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async getCategorySingle(bodyData: any): Promise<SuccessReturnDto> {
    try {
      const category = await this.prismaService.videosCategory.findFirst({
        where: {
          id: bodyData.id,
        },
      });
      if (category) {
        return {
          success: true,
          data: category,
          message: 'get Category Successfully',
          statusCode: 200,
        };
      } else {
        throw new HttpException('Category does not exists', 400);
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async updateCategory(bodyData: any): Promise<SuccessReturnDto> {
    try {
      const result = VideosUpdatedCategoryValidation.validate(bodyData);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const category = await this.prismaService.videosCategory.findFirst({
          where: {
            id: bodyData.id,
          },
        });
        if (category) {
          const updatedCategory =
            await this.prismaService.videosCategory.update({
              where: {
                id: bodyData.id,
              },
              data: {
                name: bodyData.name,
                description: bodyData.description,
              },
            });
          return {
            success: true,
            message: `${updatedCategory.name} category has been updated successfully`,
            statusCode: 200,
            data: updatedCategory,
          };
        } else {
          throw new HttpException('category does not exists', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }
}
