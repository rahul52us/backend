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
  getStaffBodyDto,
  StaffInfo,
  UpdateStaffInfo,
  StaffSuccessReturnDto,
} from './dto/staff.dto';
import { StaffService } from './staff.service';

@Controller('api/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  async RegisterStaff(
    @Req() request: RequestBodyDto,
    @Body() staffInfo: StaffInfo,
  ): Promise<StaffSuccessReturnDto> {
    if (
      request.bodyData['permission'].staff[1] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      staffInfo['createdBy'] = request.userId
      staffInfo['adminUserId'] = request.bodyData['adminUserId'];
      const { success, data, message, statusCode } =
        await this.staffService.RegsiterNewStaff(staffInfo);
      if (success) {
        return {
          success: success,
          data: data,
          message: message,
          statusCode: statusCode,
        };
      }
    } else {
      throw new HttpException('cannot create the staff', 403);
    }
  }

  @UseGuards(AdminGuard)
  @Put('update')
  async UpdateStaff(
    @Req() request: RequestBodyDto,
    @Body() staffInfo: UpdateStaffInfo,
  ): Promise<StaffSuccessReturnDto> {
    if (
      request.bodyData['permission'].staff[2] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      staffInfo['adminUserId'] = request.bodyData['adminUserId'];
      const { success, data, message, statusCode } =
        await this.staffService.UpdateStaff(staffInfo);
      if (success) {
        return {
          success: success,
          data: data,
          message: message,
          statusCode: statusCode,
        };
      }
    } else {
      throw new HttpException('cannot update the staff detail', 403);
    }
  }

  @UseGuards(AdminGuard)
  @HttpCode(200)
  @Post('get')
  async getStaff(
    @Req() request: RequestBodyDto,
    @Body() getStaffBody: getStaffBodyDto,
  ): Promise<StaffSuccessReturnDto> {
    if (
      request.bodyData['permission'].staff[0] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      getStaffBody['adminUserId'] = request.bodyData['adminUserId'];
      const { success, data, message, statusCode } =
        await this.staffService.getStaff(getStaffBody);
      if (success) {
        return {
          success: success,
          message: message,
          data: data,
          statusCode: statusCode,
        };
      }
    } else {
      throw new HttpException('cannot get the staff details', 403);
    }
  }

  @UseGuards(AdminGuard)
  @Get('single/:id')
  async getSingleStaffController(
    @Req() request,
    @Param('id') id: string,
    @Req() Request: RequestBodyDto,
  ): Promise<StaffSuccessReturnDto> {
    if (
      request.bodyData['permission'].staff[0] ||
      request.userId == request.bodyData['adminUserId']
    ) {
      const { statusCode, success, data, message } =
        await this.staffService.getSingleStaff({ id });
      return {
        statusCode,
        success,
        message,
        data,
      };
    } else {
      throw new HttpException('cannot get the staff details', 403);
    }
  }
}
