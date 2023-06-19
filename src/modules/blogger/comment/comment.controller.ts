import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommentCreateRoute, CommentGetRoute, CommentRoute } from './common/comment.routes';
import { RequestBodyDto } from 'src/modules/user/dto/users.dto';
import { CreateCommentDto, GetCommentDto, ReturnSuccessDto } from './common/comment.dto';
import { AdminGuard } from 'src/guards/admin.guards';
import { CommentService } from './comment.service';

@Controller(CommentRoute)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AdminGuard)
  @Post(CommentCreateRoute)
  async createComment(
    @Req() req: RequestBodyDto,
    @Body() bodyData: CreateCommentDto,
  ) : Promise<ReturnSuccessDto> {
    bodyData['userId'] = req.userId;
    const { success, data, statusCode, message } =
      await this.commentService.createComment(bodyData);
    return {
      success,
      data,
      statusCode,
      message,
    };
  }

  @Post(CommentGetRoute)
  async getComments(@Body() bodyData : GetCommentDto) : Promise<ReturnSuccessDto> {
    const {success , message , statusCode , data} = await this.commentService.getComments(bodyData)
    return {
      success,
      data,
      message,
      statusCode
    }
  }
}
