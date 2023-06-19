import { TeacherService } from './teacher.service';
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Put,
  HttpException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { AdminGuard } from '../../../guards/admin.guards';
import {
  TeacherReturnSuccessdto,
  TeacherInfo,
  UpdateTeacherInfo,
  getTeacherBodyDto,
  getUserTeacherBodyDto,
} from './dto/teacher.dto';
import { RequestBodyDto } from 'src/modules/user/dto/users.dto';

@Controller('api/teacher')
export class TeacherController {
  constructor(private readonly TeacherService: TeacherService) {}

  @UseGuards(AdminGuard)
  @Post('/create')
  async createTeacherController(
    @Req() request: RequestBodyDto,
    @Body() teacherDetails: TeacherInfo,
  ): Promise<TeacherReturnSuccessdto> {
    if (
      request.bodyData['permission'].teacher[1] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      teacherDetails['createdBy'] = request.userId;
      teacherDetails['adminUserId'] = request.bodyData['adminUserId'];
      const { success, data, message, statusCode } =
        await this.TeacherService.RegisterNewTeacher(teacherDetails);
      if (success) {
        return {
          success: success,
          data: data,
          message: message,
          statusCode: statusCode,
        };
      }
    } else {
      throw new HttpException('cannot create the teacher', 403);
    }
  }

  @UseGuards(AdminGuard)
  @Put('/update')
  async updateTeacherController(
    @Req() request: RequestBodyDto,
    @Body() teacherDetails: UpdateTeacherInfo,
  ): Promise<TeacherReturnSuccessdto> {
    if (
      request.bodyData['permission'].teacher[2] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      teacherDetails['createdBy'] = request.userId;
      teacherDetails['adminUserId'] = request.bodyData['adminUserId'];
      const { success, data, message, statusCode } =
        await this.TeacherService.UpdateTeacher(teacherDetails);
      if (success) {
        return {
          success: success,
          data: data,
          message: message,
          statusCode: statusCode,
        };
      }
    } else {
      throw new HttpException('cannot create the teacher', 403);
    }
  }

  @UseGuards(AdminGuard)
  @Get('single/:id')
  async getSingleTeacherController(
    @Req() request: RequestBodyDto,
    @Param('id') id: string,
  ): Promise<TeacherReturnSuccessdto> {
    if (
      request.bodyData['permission'].teacher[0] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      const { statusCode, success, data, message } =
        await this.TeacherService.getSingleTeacher({ id });
      return {
        statusCode,
        success,
        message,
        data,
      };
    } else {
      throw new HttpException('cannot get the student details', 403);
    }
  }

  @UseGuards(AdminGuard)
  @Post('/get')
  async getTeachers(
    @Req() request: RequestBodyDto,
    @Body() teacher: getTeacherBodyDto,
  ): Promise<TeacherReturnSuccessdto> {
    if (
      request.bodyData['permission'].teacher[0] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      teacher['adminUserId'] = request.bodyData['adminUserId'];
      const { success, message, data, statusCode } =
        await this.TeacherService.getTeachers(teacher);
      return {
        success,
        message,
        data,
        statusCode,
      };
    }
  }

  @Get('/user/:id')
  async getSingleUserTeacherController(
    @Param('id') id: string,
  ): Promise<TeacherReturnSuccessdto> {
    const { statusCode, success, data, message } =
      await this.TeacherService.getSingleUserTeacher({ id });
    return {
      statusCode,
      success,
      message,
      data,
    };
  }

  @Post('/user/get')
  async getUserTeachers(
    @Req() request: RequestBodyDto,
    @Body() teacher: getUserTeacherBodyDto,
  ): Promise<TeacherReturnSuccessdto> {
      const { success, message, data, statusCode } =
        await this.TeacherService.getUserTeachers({ userId: teacher.userId });
      return {
        success,
        message,
        data,
        statusCode,
      };
    }


  @UseGuards(AdminGuard)
  @Post('/download/list')
  async downloadTemplate(
    @Res() res: Response,
    @Req() request: RequestBodyDto,
    @Body() recieveData: any,
  ) {
    recieveData['bodyData'] = request['bodyData'];
    await this.TeacherService.downloadTeacherList(recieveData, res);
  }
}
