import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  UseGuards,
  HttpException,
  Put,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import * as sharp from 'sharp';
import { AdminGuard } from '../../guards/admin.guards';
import {
  controllerReturnDto,
  passwordChangecontrollerReturnDto,
  successReturnDto,
  successReturnGetUserCount,
  successUpdatePermissionReturn,
} from 'src/modules/user/dto/common.dto';
import {
  LoginBodyDto,
  RegisterBodyDto,
  ChangePasswordBodyDto,
  RequestBodyDto,
  ChangeStatusBodyDto,
  UpdatePermissionDto,
} from 'src/modules/user/dto/users.dto';
import * as fs from 'fs';
import * as path from 'path';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from '../../common/uploadHelpers';
import { BASE_URL } from 'src/common/constant';

@Controller('api/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @Post('me')
  @HttpCode(200)
  async meController(@Req() request: RequestBodyDto): Promise<any> {
    const { success, message, data, statusCode } =
      await this.userService.meUser(request.bodyData);
    if (success) {
      return {
        success: success,
        data: data,
        message: message,
        statusCode: statusCode,
      };
    } else {
      return {
        error: 'UnAuthenticated User',
        message: 'UnAuthenticated User',
        statusCode: 401,
      };
    }
  }

  @Post('register')
  @HttpCode(201)
  async registerController(
    @Body() userinfo: RegisterBodyDto,
  ): Promise<controllerReturnDto> {
    const { success, data, statusCode, message } =
      await this.userService.registerUser(userinfo);
    if (success) {
      return {
        success: success,
        data: data,
        message: message,
        statusCode: statusCode,
      };
    }
  }

  @Post('login')
  @HttpCode(200)
  async LoginWithEmailCOntroller(
    @Body() userInfo: LoginBodyDto,
  ): Promise<controllerReturnDto> {
    const { message, data, statusCode, error, success } =
      await this.userService.login(userInfo);
    if (success) {
      return {
        success: success,
        data: data,
        message: message,
        statusCode: statusCode,
      };
    }
  }

  @UseGuards(AdminGuard)
  @Post('change-password')
  @HttpCode(200)
  async ChangePasswordController(
    @Req() request: RequestBodyDto,
    @Body() userInfo: ChangePasswordBodyDto,
  ): Promise<passwordChangecontrollerReturnDto> {
    const { success, message, statusCode } =
      await this.userService.changePassword(request.userId, userInfo);
    if (success) {
      return {
        message: message,
        success: success,
        statusCode: statusCode,
      };
    } else {
      return {
        statusCode: 400,
        message: 'Something went wrong',
      };
    }
  }

  @UseGuards(AdminGuard)
  @Post('change-status')
  @HttpCode(200)
  async changeStatusController(
    @Req() request: RequestBodyDto,
    @Body() userStatus: ChangeStatusBodyDto,
  ): Promise<any> {
    try {
      if (
        request.bodyData['adminUserId'] == request.userId ||
        request.bodyData['permission'].changeStatus[0]
      ) {
        const { success, message } = await this.userService.changeStatus(
          userStatus,
        );
        if (success) {
          return {
            success: success,
            statusCode: 200,
            message: message,
          };
        }
      } else {
        throw new HttpException('cannot change the status', 403);
      }
    } catch (err) {
      throw new HttpException(err.message, err.status ? err.status : 500);
    }
  }

  @UseGuards(AdminGuard)
  @Put('update-permission')
  @HttpCode(200)
  async UpdatePermissionController(
    @Req() request: RequestBodyDto,
    @Body() updatePermissionData: UpdatePermissionDto,
  ): Promise<successUpdatePermissionReturn> {
    if (
      request.bodyData['adminUserId'] == request.userId ||
      request.bodyData['permission'].permission[2]
    ) {
      const { success, message, statusCode } =
        await this.userService.updatePermission(updatePermissionData);
      if (success) {
        return {
          success: success,
          message: message,
          statusCode: statusCode,
        };
      }
    } else {
      throw new HttpException('cannot update the permissions', 403);
    }
  }

  @Post('admin')
  @HttpCode(201)
  async AdminUserRegisterController(
    @Body() userInfo: RegisterBodyDto,
  ): Promise<controllerReturnDto> {
    const { success, message, statusCode, data } =
      await this.userService.AdminUserRegister(userInfo);
    if (success) {
      return {
        data: data,
        success: success,
        message: message,
        statusCode: statusCode,
      };
    }
  }

  @UseGuards(AdminGuard)
  @HttpCode(200)
  @Put('update-profile')
  async updateUserProfile(
    @Req() request: RequestBodyDto,
    @Body() userProfileData: any,
  ): Promise<any> {
    userProfileData['id'] = request.userId;
    const { statusCode, success, data, message } =
      await this.userService.updateProfile(userProfileData);
    return {
      statusCode: statusCode,
      success: success,
      data: data,
      message: message,
    };
  }

  @UseGuards(AdminGuard)
  @HttpCode(200)
  @Get('get-users-count')
  async getUserCountController(
    @Req() request: RequestBodyDto
  ): Promise<successReturnGetUserCount> {
    const { success, statusCode, message, data } =
      await this.userService.getAllUserCount({adminUserId:request.bodyData['adminUserId']});
    return {
      success: success,
      statusCode: statusCode,
      message: message,
      data: data,
    };
  }

  @UseGuards(AdminGuard)
  @HttpCode(200)
  @Get('get-web-count')
  async getUserWebCountController(
    @Req() request: RequestBodyDto
  ): Promise<successReturnDto> {
    const { success, statusCode, message, data } =
      await this.userService.getUserWebCount({adminUserId:request.bodyData['adminUserId']});
    return {
      success: success,
      statusCode: statusCode,
      message: message,
      data: data,
    };
  }


  @UseGuards(AdminGuard)
  @Post('upload-pic')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new HttpException(`Unsupported file type ${file.mimetype}`, 400),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
    }),
  )
  async uploadFile(@Req() req: Request, @UploadedFile() file: any): Promise<any> {
    try {
      const compressedImagePath = `./public/upload_pic/profile_${file.filename}`;
      const format = file.mimetype.includes('jpeg') ? 'jpeg' : 'png';
      // Compress image using sharp
      await sharp(file.path)
      .resize(600, 600) // Set the desired dimensions for the resized image
      .toFormat(format) // Convert to the appropriate format (JPEG or PNG)
      .png({ quality: 70 }) // Adjust compression quality for PNG format
      .jpeg({ quality: 70, chromaSubsampling: '4:4:4' }) // Adjust compression quality and chroma subsampling for JPEG format
      .toFile(compressedImagePath);


    // Remove the original uploaded file
      fs.unlinkSync(file.path);

      // Return the response
      return {
        success: true,
        message: 'Profile updated successfully',
        fileName: file.filename,
        file: `${BASE_URL}/images/profile_${file.filename}`,
      };
    } catch (error) {
      throw new HttpException('Failed to process the uploaded image', 500);
    }
  }
}
