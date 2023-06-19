import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import {
  CategorySchema,
  CreateGallerySchema,
  GalleryDataBody,
  GallerySuccessReturnDto,
  GetCategorySchema,
  UpdateCategorySchema,
} from './common/gallery.dto';

@Injectable()
export class GalleryService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(GalleryService.name);

  async createCategory(data: any): Promise<GallerySuccessReturnDto> {
    try {
      const result = CategorySchema.validate(data);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const category = await this.prismaService.galleryCategory.findFirst({
          where: { name: data.name, userId: data.adminUserId },
        });
        if (category) {
          throw new HttpException(
            `category ${data.name} is already exists`,
            403,
          );
        } else {
          const category = await this.prismaService.galleryCategory.create({
            data: { name: data.name, userId: data.adminUserId },
          });
          if (category) {
            return {
              success: true,
              message: 'category has been created successfully',
              data: category,
              statusCode: 201,
            };
          } else {
            throw new HttpException(
              `something went wrong while creating category`,
              403,
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

  async getAllCategory(data: any): Promise<GallerySuccessReturnDto> {
    try {
      const result = GetCategorySchema.validate(data);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const categories = await this.prismaService.galleryCategory.findMany({
          where: { userId: data.userId },
          include: { Gallery: true },
        });
        return {
          success: true,
          message: 'get Successfully categories',
          data: categories,
          statusCode: 200,
        };
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async updateCategory(data: any): Promise<GallerySuccessReturnDto> {
    try {
      const result = UpdateCategorySchema.validate(data);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const category = await this.prismaService.galleryCategory.findFirst({
          where: { name: data.name, userId: data.adminUserId },
        });
        if (category) {
          throw new HttpException(
            `category ${data.name} is already exists`,
            403,
          );
        } else {
          const updatedValue = await this.prismaService.galleryCategory.update({
            where: { id: data.id },
            data: { name: data.name },
            include: { Gallery: true },
          });
          if (updatedValue) {
            return {
              success: true,
              message: 'get Successfully categoies',
              data: updatedValue,
              statusCode: 200,
            };
          } else {
            throw new HttpException(
              `something went wrong while updating category`,
              403,
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

  async createGallery(data: any): Promise<GallerySuccessReturnDto> {
    try {
      const result = CreateGallerySchema.validate(data);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const gallery = await this.prismaService.gallery.create({
          data: { categoryId : data.categoryId, image: data.image , userId : data.adminUserId },
        });
        if (gallery) {
          return {
            success: true,
            message: 'Created Successfully Gallery Image',
            data: gallery,
            statusCode: 200,
          };
        } else {
          throw new HttpException(
            `something went wrong while creating gallery image`,
            403,
          );
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }
}
