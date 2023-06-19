import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ReturnSuccessDto } from './common/blog.dto';
import { CreateBlogValidation } from './common/blog.valdiation';
import { convertToMessageResponse } from 'src/modules/common/function';

@Injectable()
export class BlogService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBlog(data: any): Promise<ReturnSuccessDto> {
    try {
      const result = CreateBlogValidation.validate(data);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const createBlog = await this.prismaService.blog.create({
          data: {
            content: data.content,
            title: data.title,
            userId: data.userId,
          },
          include : {comments : true , reactions : true}
        });
        if (createBlog) {
          return {
            success: true,
            statusCode: 201,
            data: createBlog,
            message: 'new Blog has been created successfully',
          };
        } else {
          throw new HttpException('cannot create the blog', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }
}
