import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ReturnSuccessDto } from './common/comment.dto';
import { CreateCommentValidation } from './common/comment.valdiation';
import { convertToMessageResponse } from 'src/modules/common/function';
import { pageSize } from '../utils/constant';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async createComment(data: any): Promise<ReturnSuccessDto> {
    try {
      const result = CreateCommentValidation.validate(data);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const comment = await this.prismaService.comment.create({
          data: {
            blogId: data.blogId,
            userId: data.userId,
            parentId: data.commentId,
            content: data.content,
          },
          include: {
            reactions: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                username: true,
                pic: true,
                adminType: true,
              },
            },
          },
        });
        if (comment) {
          return {
            success: true,
            message: 'commment has been created successfully',
            data: comment,
            statusCode: 201,
          };
        } else {
          throw new HttpException('cannot create the comment', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async getComments(data: any): Promise<ReturnSuccessDto> {
    try {
      const { page, blogId, commentId } = data;
      const skip = (page - 1) * pageSize;

      const query = {
        where: { blogId, parentId: commentId || null },
        skip,
        take: pageSize,
        include: {
          children: {
            include: {
              children: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  username: true,
                  pic: true,
                  adminType: true,
                },
              },
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              username: true,
              pic: true,
              adminType: true,
            },
          },
        },
      };

      const [comments, totalComments] = await Promise.all([
        this.prismaService.comment.findMany({...query,orderBy: { createdAt: 'asc' }}),
        this.prismaService.comment.count({
          where: { blogId, parentId: commentId || null },
        }),
      ]);

      const totalPages = Math.ceil(totalComments / pageSize);

      return {
        success: true,
        message: 'get comments successfully',
        statusCode: 200,
        data: {
          comments,
          totalPages,
        },
      };
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

}
