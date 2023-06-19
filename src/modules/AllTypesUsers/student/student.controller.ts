import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RequestBodyDto } from 'src/modules/user/dto/users.dto';
import { AdminGuard } from '../../../guards/admin.guards';
import {
  getStudentBodyDto,
  getStudentReturnDto,
  RegisterStudentReturnDto,
  SingleStudentReturnDto,
  StudentInfo,
  UpdateStudentInfo,
  UpdateStudentReturnDto,
} from './dto/student.dto';
import { StudentService } from './student.service';
import { Response } from 'express';
import { CustomMessage } from '../utils/messages';

@Controller('api/student')
export class StudentController {
  constructor(private readonly StudentService: StudentService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  async RegisterStudent(
    @Req() request: RequestBodyDto,
    @Body() studentInfo: StudentInfo,
  ): Promise<RegisterStudentReturnDto> {
    if (
      request.bodyData['permission'].student[1] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      studentInfo['createdBy'] = request.userId;
      studentInfo['adminUserId'] = request.bodyData['adminUserId'];
      const { success, data, message, statusCode } =
        await this.StudentService.RegisterNewStudent(studentInfo);
      if (success) {
        return {
          success: success,
          data: data,
          message: message,
          statusCode: statusCode,
        };
      }
    } else {
      throw new HttpException(
        CustomMessage('student', 'student').CANNOT_CREATE,
        403,
      );
    }
  }

  @UseGuards(AdminGuard)
  @Put('update')
  async UpdateStudent(
    @Req() request: RequestBodyDto,
    @Body() studentInfo: UpdateStudentInfo,
  ): Promise<UpdateStudentReturnDto> {
    if (
      request.bodyData['permission'].student[2] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      studentInfo['adminUserId'] = request.bodyData['adminUserId'];
      const { success, data, message, statusCode } =
        await this.StudentService.UpdateStudent(studentInfo);
      if (success) {
        return {
          success: success,
          data: data,
          message: message,
          statusCode: statusCode,
        };
      }
    } else {
      throw new HttpException(CustomMessage('student', '').CANNOT_UPDATE, 403);
    }
  }

  @UseGuards(AdminGuard)
  @HttpCode(200)
  @Post('get')
  async getStudent(
    @Req() request: RequestBodyDto,
    @Body() getStudentBody: getStudentBodyDto,
  ): Promise<getStudentReturnDto> {
    if (
      request.bodyData['permission'].student[0] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      getStudentBody['adminUserId'] = request.bodyData['adminUserId'];
      const { success, data, message, statusCode } =
        await this.StudentService.getStudents(getStudentBody);
      if (success) {
        return {
          success: success,
          message: message,
          data: data,
          statusCode: statusCode,
        };
      }
    } else {
      throw new HttpException(
        CustomMessage('student', 'student').CANNOT_GET,
        403,
      );
    }
  }

  @UseGuards(AdminGuard)
  @Get('single/:id')
  async getSingleStudentController(
    @Req() request,
    @Param('id') id: string,
    @Req() Request: RequestBodyDto,
  ): Promise<SingleStudentReturnDto> {
    if (
      request.bodyData['permission'].student[0] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      const { statusCode, success, data, message } =
        await this.StudentService.getSingleStudent({ id });
      return {
        statusCode,
        success,
        message,
        data,
      };
    } else {
      throw new HttpException(
        CustomMessage('student', 'student').SINGLE_GET,
        403,
      );
    }
  }

  @UseGuards(AdminGuard)
  @Post('/download/list')
  async downStudentSheet(
    @Res() res: Response,
    @Req() request: RequestBodyDto,
    @Body() recieveData: any,
  ) {
    recieveData['bodyData'] = request['bodyData'];
    await this.StudentService.downloadStudentSheet(recieveData, res);
  }

  @UseGuards(AdminGuard)
  @Post('/download/template')
  async downloadTemplate(
    @Res() res: Response,
    @Req() request: RequestBodyDto,
    @Body() recieveData: any,
  ) {
    recieveData['bodyData'] = request['bodyData'];
    await this.StudentService.downloadTemplate(recieveData, res);
  }
}
