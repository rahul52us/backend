import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { RequestBodyDto } from 'src/modules/user/dto/users.dto';
import { CreateBlogDto } from './common/blog.dto';
import { AdminGuard } from 'src/guards/admin.guards';
import { BlogCreateRoute, BlogRoute } from './common/blog.routes';

@Controller(BlogRoute)
@UseGuards(AdminGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post(BlogCreateRoute)
  async createBlog(
    @Req() req: RequestBodyDto,
    @Body() bodyData: CreateBlogDto,
  ) {
    bodyData['userId'] = req.userId;
    const { success, statusCode, message, data } =
      await this.blogService.createBlog(bodyData);
    return {
      success,
      statusCode,
      message,
      data,
    };
  }
}
