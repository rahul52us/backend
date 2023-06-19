import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { AdminGuard } from 'src/guards/admin.guards';
import { RequestBodyDto } from '../user/dto/users.dto';
import {
  ReturnSuccessTestimonial,
  TestimonialCreateDto,
  TestimonialDeleteSingleDto,
  TestimonialGetDto,
  TestimonialGetSingleDto,
  TestimonialUpdateDto,
} from './common/testimonial.dto';
import {
  TestimonialCreateRoutes,
  TestimonialDeleteRoutes,
  TestimonialGetRoutes,
  TestimonialGetSingleRoutes,
  TestimonialRoutes,
  TestimonialUpdateRoutes,
} from './common/testimonial.routes';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile, diskStorage } from 'multer';
import { HelperTestimonial } from 'src/common/uploadHelpers';
import { BASE_URL } from 'src/common/constant';

const setLocation = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(`Unsupported file type ${file.mimetype}`, 400),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: HelperTestimonial.destinationPath,
    filename: HelperTestimonial.customFileName,
  }),
};

@Controller(TestimonialRoutes)
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post(TestimonialCreateRoutes)
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('pic', setLocation))
  async createTestimonialController(
    @Req() request: RequestBodyDto,
    @Body() testimonial: TestimonialCreateDto,
    @UploadedFile() pic: MulterFile,
  ) {
    if (request.bodyData['adminType'] === 'admin') {
      testimonial['adminUserId'] = request.bodyData['adminUserId'];
      if (pic) {
        testimonial[
          'pic'
        ] = `${BASE_URL}/testimonials/${pic.filename}`;
      }
      const { success, message, data, statusCode } =
        await this.testimonialService.createTestimonial(testimonial);
      return {
        success,
        message,
        data,
        statusCode,
      };
    } else {
      throw new HttpException('cannot create the testimonial', 403);
    }
  }

  @UseGuards(AdminGuard)
  @Put(TestimonialUpdateRoutes)
  @UseInterceptors(FileInterceptor('pic', setLocation))
  async updateTestimonialController(
    @Req() request: RequestBodyDto,
    @Body() testimonial: TestimonialUpdateDto, @UploadedFile() pic: MulterFile
  ): Promise<ReturnSuccessTestimonial> {
    if (request.bodyData['adminType'] === 'admin') {
      if (pic) {
        testimonial[
          'pic'
        ] = `${BASE_URL}/testimonials/${pic.filename}`;
      }
      testimonial['adminUserId'] = request.bodyData['adminUserId'];
      const { success, message, statusCode, data } =
        await this.testimonialService.UpdateTestimonial(testimonial);
      return {
        success,
        statusCode,
        data,
        message,
      };
    } else {
      throw new HttpException('cannot update testimonial', 403);
    }
  }

  @Get(TestimonialGetSingleRoutes)
  async getSingleTestimonialController(
    @Param('id') id: TestimonialGetSingleDto,
  ): Promise<ReturnSuccessTestimonial> {
    const { success, message, statusCode, data } =
      await this.testimonialService.getSingleTestimonial({ id: id });
    return {
      success,
      statusCode,
      data,
      message,
    };
  }

  @Post(TestimonialGetRoutes)
  async getTestimonialsController(
    @Body() testimonial: TestimonialGetDto,
  ): Promise<ReturnSuccessTestimonial> {
    const { success, message, statusCode, data } =
      await this.testimonialService.getTestimonials(testimonial);
    return {
      success,
      statusCode,
      data,
      message,
    };
  }

  @UseGuards(AdminGuard)
  @Delete(TestimonialDeleteRoutes)
  async deleteTestimonialsController(
    @Req() request: RequestBodyDto,
    @Param('id') id: TestimonialDeleteSingleDto,
  ): Promise<ReturnSuccessTestimonial> {
    if (request.bodyData['adminType'] === 'admin') {
      const { success, message, statusCode, data } =
        await this.testimonialService.deleteTestimonials({ id: id });
      return {
        success,
        statusCode,
        data,
        message,
      };
    } else {
      throw new HttpException('cannot delete this testimonail', 403);
    }
  }

  @UseGuards(AdminGuard)
  @Post('/download/list')
  async downStudentSheet(@Res() res : Response , @Req() request:RequestBodyDto , @Body() recieveData : any){
    recieveData['bodyData'] = request['bodyData']
    await this.testimonialService.downloadTestimonialSheet(recieveData, res )
  }

  @UseGuards(AdminGuard)
  @Post('/upload/excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MulterFile, @Req() req : RequestBodyDto): Promise<any> {
    if(req.bodyData['adminUserId'] === req.userId)
    {
    const datas = {}
    datas['adminUserId'] = req.bodyData['adminUserId']
    datas['file'] = file
    const { success, message, statusCode, data } = await this.testimonialService.importExcel(datas);
    return {
      success,
      statusCode,
      data,
      message,
    };
    }
    else
    {
      throw new HttpException('cannot create the testimonial', 403)
    }
  }
}
