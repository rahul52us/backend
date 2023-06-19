import { HttpException, Injectable, Logger, Req } from '@nestjs/common';
import {
  controllerReturnDto,
  successReturnDto,
  successReturnGetUserCount,
  successUpdatePermissionReturn,
} from 'src/modules/user/dto/common.dto';
import {
  ChangePasswordBodyDto,
  ChangeStatusBodyDto,
  LoginBodyDto,
  PasswordChangeServiceReturnDto,
  returnServiceRegisterDto,
  UserInfo,
  UpdatePermissionDto,
  GetUsersCountDto,
  GetUsersWebCountDto,
} from 'src/modules/user/dto/users.dto';
import { PrismaService } from '../../services/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  ChangePasswordBOdySchema,
  ChangeStatusBodySchema,
  GetUserCountSchema,
  GetUserWebCountSchema,
  LoginBodySchema,
  RegisterBodySchema,
  UpdatePermissionSchema,
} from './validation';
import { generateToken } from '../../common/global.function';
import { convertToMessageResponse } from '../common/function';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(UserService.name);

  async meUser(user: any): Promise<any> {
    try {
      const findUser = await this.prismaService.user.findUnique({
        where: { id: user.id },
        include: {
          profile: true,
          address: true,
          permission: true,
          ProfileDetails: true,
        },
      });
      if (!findUser) {
        throw new HttpException(`UnAuthenticated User`, 401);
      } else {
        const { password, ...rest } = findUser;
        return {
          statusCode: 200,
          data: rest,
          message: 'user details get successfully',
          success: true,
        };
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async registerUser(user: UserInfo): Promise<returnServiceRegisterDto> {
    try {
      var result = RegisterBodySchema.validate(user);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const findUser = await this.prismaService.user.findFirst({
          where: { username: user.username },
        });
        if (findUser) {
          throw new HttpException(`${user.username} is already exist`, 400);
        } else {
          var hashPassword = await bcrypt.hash(`${user.password}`, 10);
          const data = await this.prismaService.user.create({
            data: {
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              password: hashPassword,
            },
          });
          const profile = await this.prismaService.profile.create({
            data: { userId: data.id },
          });
          const address = await this.prismaService.address.create({
            data: { userId: data.id },
          });
          const permissionData = await this.prismaService.permission.create({
            data: { userId: data.id },
          });
          data['profile'] = profile;
          data['address'] = address;
          data['permissions'] = permissionData;
          data['authorizationToken'] = await generateToken({ userId: data.id });
          const { password, ...rest } = data;
          return {
            statusCode: 201,
            data: rest,
            message: 'new user has been registered successfully',
            success: true,
          };
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async login(userInfo: LoginBodyDto): Promise<controllerReturnDto> {
    try {
      const result = LoginBodySchema.validate(userInfo);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const findUser = await this.prismaService.user.findFirst({
          where: { username: userInfo.username },
          include: {
            profile: true,
            address: true,
            permission: true,
            ProfileDetails: true,
          },
        });
        if (findUser) {
          const verifyPassword = await bcrypt.compare(
            `${userInfo.password}`,
            findUser.password,
          );
          if (verifyPassword) {
            findUser['authorizationToken'] = await generateToken({
              userId: findUser.id,
            });
            const { password, ...rest } = findUser;
            return {
              message: 'user has been login successfully',
              data: rest,
              statusCode: 200,
              success: true,
            };
          } else {
            throw new HttpException('Invalid User', 401);
          }
        } else {
          throw new HttpException(
            `${userInfo.username} username does not exists`,
            401,
          );
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async changePassword(
    @Req() userId: string,
    userInfo: ChangePasswordBodyDto,
  ): Promise<PasswordChangeServiceReturnDto> {
    try {
      var result = ChangePasswordBOdySchema.validate(userInfo);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const user = await this.prismaService.user.findUnique({
          where: { id: userId },
        });
        if (user) {
          const verifyPassword = await bcrypt.compare(
            userInfo.oldPassword,
            `${user.password}`,
          );
          if (verifyPassword) {
            var hashPassword = await bcrypt.hash(`${userInfo.newPassword}`, 10);
            const data = await this.prismaService.user.update({
              where: { id: userId },
              data: { password: hashPassword },
            });
            if (data) {
              return {
                success: true,
                message: 'Password updated SuccessFully',
                statusCode: 200,
              };
            } else {
              throw new HttpException('Password Update Failed', 400);
            }
          } else {
            throw new HttpException('password does not match', 400);
          }
        } else {
          throw new HttpException('Invalid User', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async changeStatus(userStatus: ChangeStatusBodyDto): Promise<any> {
    try {
      const result = ChangeStatusBodySchema.validate(userStatus);
      if (result.error) {
        throw new HttpException('status and userId is required fields', 400);
      } else {
        const user = await this.prismaService.user.findUnique({
          where: { id: userStatus.userId },
        });
        if (user) {
          const updatedUser = await this.prismaService.user.update({
            where: { id: userStatus.userId },
            data: { status: userStatus.status ? 'ACCEPTED' : 'REJECTED' },
          });
          if (updatedUser) {
            return {
              message: 'Status Change SucessFully',
              success: true,
            };
          } else {
            throw new HttpException(
              'something went wrong , Status Does not Changes ',
              400,
            );
          }
        } else {
          throw new HttpException(
            'something went wrong , User does not exists',
            400,
          );
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async updatePermission(
    updatePermissionBody: UpdatePermissionDto,
  ): Promise<successUpdatePermissionReturn> {
    try {
      const result = UpdatePermissionSchema.validate(updatePermissionBody);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const user = await this.prismaService.user.findFirst({
          where: { id: updatePermissionBody.id },
          include: { permission: true },
        });
        if (user) {
          const updatedData = await this.prismaService.user.update({
            where: { id: updatePermissionBody.id },
            data: {
              permission: {
                update: {
                  student: updatePermissionBody.student,
                  teacher: updatePermissionBody.teacher,
                  permission: updatePermissionBody.permission,
                },
              },
            },
            include: { permission: true },
          });
          if (updatedData) {
            return {
              success: true,
              message: 'Permission Update SuccessFully',
              statusCode: 200,
            };
          } else {
            throw new HttpException('Permission UserId does not exists', 400);
          }
        } else {
          throw new HttpException('Permission UserId does not exists', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async AdminUserRegister(user: UserInfo): Promise<returnServiceRegisterDto> {
    try {
      var result = RegisterBodySchema.validate(user);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const findUser = await this.prismaService.user.findFirst({
          where: { username: user.username },
        });
        if (findUser) {
          throw new HttpException(`${user.username} is already exist`, 400);
        } else {
          var hashPassword = await bcrypt.hash(`${user.password}`, 10);
          const data = await this.prismaService.user.create({
            data: {
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              password: hashPassword,
              adminType: 'admin',
            },
          });
          await this.prismaService.profile.create({
            data: { userId: data.id },
          });
          await this.prismaService.address.create({
            data: { userId: data.id },
          });
          await this.prismaService.permission.create({
            data: {
              userId: data.id,
              student: [true, true, true, true],
              teacher: [true, true, true, true],
              permission: [true, true, true, true],
              staff: [true, true, true, true],
              dashboard: [true],
              changeStatus: [true],
            },
          });
          await this.prismaService.profileDetails.create({
            data: {
              userId: data.id,
            },
          });
          const updatedUser = await this.prismaService.user.update({
            where: { id: data.id },
            data: { adminUserId: data.id, createdBy: data.id },
            include: {
              permission: true,
              profile: true,
              address: true,
              ProfileDetails: true,
            },
          });

          updatedUser['authorizationToken'] = await generateToken({
            userId: data.id,
          });
          const { password, ...rest } = updatedUser;
          return {
            statusCode: 201,
            data: rest,
            message: 'new admin has been registered successfully',
            success: true,
          };
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async updateProfile(user: any): Promise<any> {
    try {
      const updatedData = await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          pic: user.pic,
          phoneNumber: user.phoneNumber,
          profile: {
            update: {
              fatherName: user.fatherName,
              motherName: user.motherName,
              sibling: user.sibling,
              emergencyNumber: user.emergencyNumber,
              nickName: user.nickName,
              gender: user.gender,
              standard: user.standard,
              dob: user.dob,
              description: user.description,
              medium: user.medium,
            },
          },
          address: {
            update: {
              country: user.country,
              city: user.city,
              state: user.state,
              address1: user.address1,
              address2: user.address2,
              zipCode: user.zipCode,
            },
          },
          ProfileDetails: {
            update: {
              facebook: user.facebook,
              instagram: user.instagram,
              linkedIn: user.linkedIn,
              twitter: user.twitter,
              youtube: user.youtube,
              gmail: user.gmail,
              refrenceVideo: user.refrenceVideo,
              profession: user.profession,
              picture: user.picture,
              backgroundPicture: user.backgroundPicture,
              skill: user.skill,
              details: user.details,
              expirience: user.expirience,
            },
          },
        },
        include: {
          permission: true,
          profile: true,
          address: true,
          ProfileDetails: true,
        },
      });
      if (updatedData) {
        const { password, ...rest } = updatedData;
        return {
          message: 'SuccessFully Updated',
          success: true,
          data: rest,
          statusCode: 200,
        };
      } else {
        throw new HttpException('User Profile Does not exists', 400);
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async getUserWebCount(data: GetUsersWebCountDto): Promise<successReturnDto> {
    try {
      const result = GetUserWebCountSchema.validate(data);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const result = await this.prismaService.$transaction([
          this.prismaService.user.count({
            where: {
              adminUserId: data.adminUserId,
            },
          }),
          this.prismaService.blog.count({
            where: { userId: data.adminUserId },
          }),
          this.prismaService.testimonial.count({
            where: { adminUserId: data.adminUserId },
          }),
        ]);
        if (result) {
          return {
            success: true,
            message: 'Get Counts SuccessFully',
            statusCode: 200,
            data: {
              Users : result[0],
              Blogs : result[1],
              Testimonials : result[2],
            },
          };
        } else {
          throw new HttpException('Something went wrong', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async getAllUserCount(
    userData: GetUsersCountDto,
  ): Promise<successReturnGetUserCount> {
    try {
      var result = GetUserCountSchema.validate(userData);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const teachers = await this.prismaService.user.count({
          where: {
            adminUserId: userData.adminUserId,
            adminType: 'teacher',
          },
        });
        const students = await this.prismaService.user.count({
          where: {
            adminUserId: userData.adminUserId,
            adminType: 'student',
          },
        });
        const staffs = await this.prismaService.user.count({
          where: {
            adminUserId: userData.adminUserId,
            adminType: 'staff',
          },
        });
        if (
          students ||
          students === 0 ||
          teachers ||
          teachers === 0 ||
          staffs ||
          staffs === 0
        ) {
          return {
            success: true,
            message: 'get successfully users counts',
            data: { students, teachers, staffs },
            statusCode: 200,
          };
        } else {
          throw new HttpException('Something went wrong', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }
}



// async getAllUserCount(userData: GetUsersCountDto): Promise<successReturnGetUserCount> {
//   try {
//     const result = GetUserCountSchema.validate(userData);
//     if (result.error) {
//       throw new HttpException(await convertToMessageResponse(result), 422);
//     } else {
//       const currentYear = new Date().getFullYear();
//       const startYear = 2017; // Starting year for counting

//       const countMap = {};

//       for (let year = startYear; year <= currentYear; year++) {
//         const startDate = new Date(year, 0, 1);
//         const endDate = new Date(year + 1, 0, 1);

//         const count = await this.prismaService.user.count({
//           where: {
//             adminUserId: userData.adminUserId,
//             adminType: 'student',
//             createdAt: {
//               gte: startDate,
//               lt: endDate,
//             },
//           },
//         });

//         countMap[year] = count;
//       }

//       const countPairs = Object.entries(countMap).map(([year, count]) => ({
//         year: Number(year),
//         count,
//       }));

//       return {
//         success: true,
//         message: 'Successfully retrieved student counts',
//         data: countPairs,
//         statusCode: 200,
//       };
//     }
//   } catch (err) {
//     throw new HttpException(err, err.status || 500, {
//       cause: new Error(err),
//     });
//   }
// }