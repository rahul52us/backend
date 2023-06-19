import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VideosServices } from './videos.services';
import {
  CreateCategoryRoute,
  GetCategoryRoute,
  VideoRoute,
  GetSingleCategoryRoute,
  UpdateCategoryRoute,
} from './common/routes';
import {
  CategoryDto,
  RequestBodyDto,
  updateCategoryDto,
} from './common/constant';
import { AdminGuard } from 'src/guards/admin.guards';

@Controller(VideoRoute)
export class VideosController {
  constructor(private readonly VideoService: VideosServices) {}

  @UseGuards(AdminGuard)
  @Post(CreateCategoryRoute)
  async createCategoryController(
    @Req() request: RequestBodyDto,
    @Body() bodyData: CategoryDto,
  ) {
    if (request.bodyData['adminType'] === 'admin') {
      bodyData['adminUserId'] = request.bodyData['adminUserId'];
      bodyData['createdBy'] = request.userId;
      const { success, statusCode, data, message } =
        await this.VideoService.createVideoCategory(bodyData);
      return {
        success,
        message,
        data,
        statusCode,
      };
    } else {
      throw new HttpException('cannot create the video category', 403);
    }
  }

  @Get(GetCategoryRoute)
  async getCategoryController(@Param('id') id: string) {
    const { success, data, statusCode, message } =
      await this.VideoService.getCategory({ userId: id });
    return {
      success,
      data,
      statusCode,
      message,
    };
  }

  @Get(GetSingleCategoryRoute)
  async getCategorySingleRoute(@Param('id') id: string) {
    const { success, data, message, statusCode } =
      await this.VideoService.getCategorySingle({ id: id });
    return {
      success,
      data,
      message,
      statusCode,
    };
  }

  @UseGuards(AdminGuard)
  @Put(UpdateCategoryRoute)
  async updatedCategoryRoute(
    @Param('id') id: string,
    @Req() request: RequestBodyDto,
    @Body() bodyData: updateCategoryDto,
  ) {
    if (request.bodyData['adminType'] === 'admin') {
      bodyData['adminUserId'] = request.bodyData['adminUserId'];
      bodyData['createdBy'] = request.userId;
      bodyData['id'] = id;

      const { success, message, statusCode, data } =
        await this.VideoService.updateCategory(bodyData);
      return {
        success,
        message,
        statusCode,
        data,
      };
    }
  }
}
