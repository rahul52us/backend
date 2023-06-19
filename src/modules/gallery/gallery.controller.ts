import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { AdminGuard } from 'src/guards/admin.guards';
import {
  CreateGalleryCatergoryRoute,
  CreateGalleryRoute,
  GalleryRoute,
  GetGalleryCatergoryRoute,
  UpdateGalleryCatergoryRoute,
} from './common/gallery.routes';
import { GalleryCategoryBody, GalleryDataBody } from './common/gallery.dto';
import { RequestBodyDto } from '../user/dto/users.dto';

@Controller(GalleryRoute)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @UseGuards(AdminGuard)
  @Post(CreateGalleryCatergoryRoute)
  async createCategory(
    @Req() request: RequestBodyDto,
    @Body() categoryBody: GalleryCategoryBody,
  ) {
    const { success, statusCode, data, message } =
      await this.galleryService.createCategory({
        name: categoryBody.name,
        adminUserId: request.bodyData['adminUserId'],
      });
    return {
      success,
      message,
      data,
      statusCode,
    };
  }

  @Get(GetGalleryCatergoryRoute)
  async getAllCategories(@Param('id') id: string) {
    const { success, message, data, statusCode } =
      await this.galleryService.getAllCategory({ userId: id });
    return {
      success,
      message,
      data,
      statusCode,
    };
  }

  @UseGuards(AdminGuard)
  @Put(UpdateGalleryCatergoryRoute)
  async updateCategory(
    @Req() request: RequestBodyDto, @Param('id') id: string,
    @Body() categoryBody: GalleryCategoryBody,
  ) {
    const { success, statusCode, data, message } =
      await this.galleryService.updateCategory({
        name: categoryBody.name,
        id:id,
        adminUserId: request.bodyData['adminUserId'],
      });
    return {
      success,
      message,
      data,
      statusCode,
    };
  }

  @UseGuards(AdminGuard)
  @Post(CreateGalleryRoute)
  async createGallery(@Req() request : RequestBodyDto , @Body() GalleryData : GalleryDataBody){
    const { success, statusCode, data, message } =
      await this.galleryService.createGallery({
        image: GalleryData.image,
        adminUserId:request.bodyData['adminUserId'],
        categoryId : GalleryData.categoryId
      });
    return {
      success,
      message,
      data,
      statusCode,
    };
  }

}
