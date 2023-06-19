import {
  Injectable,
  Logger,
  HttpException,
} from '@nestjs/common';
import {
  StaffSuccessReturnDto,
} from './dto/staff.dto';
import {
  getSingleStaffSchema,
  getStaffSchema,
  StaffBodySchema,
  UpdateStaffBodySchema,
} from './staffValidation';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../services/prisma.service';
import { pageSizeLimit } from 'src/modules/common/constant.variabl';
import { successReturnDto } from 'src/modules/user/dto/common.dto';

@Injectable()
export class StaffService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(StaffService.name);

  async RegsiterNewStaff(
    staff: any,
  ): Promise<StaffSuccessReturnDto> {
    try {
      const result = StaffBodySchema.validate(staff);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const findUser = await this.prismaService.user.findFirst({
          where: { username: staff.username },
        });
        if (!findUser) {
          var hashPassword = await bcrypt.hash(staff.password, 10);
          const newStaff = await this.prismaService.user.create({
            data: {
              firstName: staff.firstName,
              lastName: staff.lastName,
              adminUserId: staff.adminUserId,
              createdBy: staff.createdBy,
              pic: staff.pic,
              username: staff.username,
              phoneNumber: staff.phoneNumber,
              password: hashPassword,
              adminType:'staff'
            },
          });
          if (newStaff) {
            var profileData = await this.prismaService.profile.create({
              data: {
                userId: newStaff.id,
                fatherName: staff.fatherName,
                motherName: staff.motherName,
                sibling: staff.sibling,
                emergencyNumber: staff.emergencyNumber,
                nickName: staff.nickName,
                dob: staff.dob,
                description: staff.description,
                gender: staff.gender,
              },
            });
            var addressData = await this.prismaService.address.create({
              data: {
                userId: newStaff.id,
                country: staff.country,
                city: staff.city,
                state: staff.state,
                address1: staff.address1,
                address2: staff.address2,
                zipCode: staff.zipCode,
              },
            });
            var permissionData = await this.prismaService.permission.create({
              data: {
                userId: newStaff.id,
                changeStatus: staff.permission?.changeStatus,
                student: staff.permission?.student,
                teacher: staff.permission?.teacher,
                staff: staff.permission?.staff,
                permission: staff.permission?.permission,
                dashboard: staff.permission?.dashboard
              },
            });
            var detailsData = await this.prismaService.profileDetails.create({
              data: {
                userId: newStaff.id,
                facebook: staff.facebook,
                instagram: staff.instagram,
                linkedIn: staff.linkedIn,
                twitter: staff.twitter,
                youtube: staff.youtube,
                gmail: staff.gmail,
                refrenceVideo: staff.refrenceVideo,
                profession: staff.profession,
                picture: staff.picture,
                backgroundPicture: staff.backgroundPicture,
                skill: staff.skill,
                details: staff.details,
              },
            });
            newStaff['profile'] = profileData;
            newStaff['address'] = addressData;
            newStaff['permissions'] = permissionData;
            newStaff['details'] = detailsData;
            const { password, ...rest } = newStaff;
            return {
              statusCode: 201,
              success: true,
              data: rest,
              message: 'New Staff has been created successFully',
            };
          } else {
            throw new HttpException(
              'Something went wrong , cannot create student',
              500,
            );
          }
        } else {
          throw new HttpException(
            `${staff.username} username is already exists`,
            400,
          );
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async UpdateStaff(
    staff: any,
  ): Promise<StaffSuccessReturnDto> {
    try {
      const result = UpdateStaffBodySchema.validate(staff);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const updatedData = await this.prismaService.user.update({
          where: { id: staff.id },
          data: {
            firstName: staff.firstName,
            lastName: staff.lastName,
            adminUserId: staff.adminUserId,
            phoneNumber: staff.phoneNumber,
            pic: staff.pic,
            profile: {
              update: {
                fatherName: staff.fatherName,
                motherName: staff.motherName,
                sibling: staff.sibling,
                emergencyNumber: staff.emergencyNumber,
                nickName: staff.nickName,
                gender: staff.gender,
                standard: staff.standard,
                dob: staff.dob,
                description: staff.description,
                medium: staff.medium,
              },
            },
            address: {
              update: {
                country: staff.country,
                city: staff.city,
                state: staff.state,
                address1: staff.address1,
                address2: staff.address2,
                zipCode: staff.zipCode,
              },
            },
            permission: {
              update: {
                changeStatus: staff.permission?.changeStatus,
                student: staff.permission?.student,
                teacher: staff.permission?.teacher,
                permission: staff.permission?.permission,
                staff:staff.permission?.staff,
                dashboard : staff.permission?.dashboard
              },
            },
            ProfileDetails: {
              update: {
                facebook: staff.facebook,
                instagram: staff.instagram,
                linkedIn: staff.linkedIn,
                twitter: staff.twitter,
                youtube: staff.youtube,
                gmail: staff.gmail,
                refrenceVideo: staff.refrenceVideo,
                profession: staff.profession,
                picture: staff.picture,
                backgroundPicture: staff.backgroundPicture,
                skill: staff.skill,
                details: staff.details
              },
            },
          },
          include: {
            profile: true,
            address: true,
            permission: true,
            ProfileDetails: true,
          },
        });
        if (updatedData) {
          const { password, ...rest } = updatedData;
          return {
            message: 'Staff details SuccessFully Updated',
            success: true,
            data: rest,
            statusCode: 200,
          };
        } else {
          throw new HttpException('Staff Does not exists', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async getStaff(staff: any): Promise<successReturnDto> {
    try {
      const result = getStaffSchema.validate(staff);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const pageSize = staff.limit || pageSizeLimit;
        const skip = (staff.page - 1) * pageSize;

        const result = await this.prismaService.$transaction([
           this.prismaService.user.findMany({
            where: {
              adminType: 'staff',
              status: staff.status === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED',
              adminUserId: staff.adminUserId,
              OR: staff.search ? [{ username : { contains: staff.search } }] : undefined,
            },
            take: staff.limit ? Math.min(staff.limit, pageSize) : pageSize,
            skip,
            select: {
              id: true,
              firstName: true,
              lastName: true,
              pic: true,
              username: true,
              createdBy: true,
              phoneNumber: true,
              status: true,
              createdAt: true,
              adminUserId: true,
              profile: true,
            },
            orderBy: { createdAt: 'desc' },
          }),
          this.prismaService.user.count({
            where: {
              adminType: 'staff',
              status: staff.status === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED',
              adminUserId: staff.adminUserId
            }
          })
        ]);

        const staffs = result[0];
        const totalData = result[1];
        const totalPages = Math.ceil(totalData / pageSize);
        const remainingPages = Math.max(totalPages - staff.page, 0);
        const hasNextPage = remainingPages > 0;

        return {
          data: {
            list : staffs,
            totalPages,
            totalData,
            remainingPages,
            currentPage: staff.page,
            hasNextPage,
            hasPreviousPage: staff.page > 1,
          },
          success: true,
          message: 'Get Staff successfully',
          statusCode: 200,
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async getSingleStaff(
    staffBodyData: any,
  ): Promise<StaffSuccessReturnDto> {
    try {
      const result = getSingleStaffSchema.validate(staffBodyData);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const student = await this.prismaService.user.findUnique({
          where: { id: staffBodyData.id },
          include: {
            profile: true,
            permission: true,
            address: true,
            ProfileDetails: true,
          },
        });
        if (student) {
          var { password, ...rest } = student;
          return {
            success: true,
            message: 'Staff Get SuccessFully',
            data: rest,
            statusCode: 200,
          };
        } else {
          throw new HttpException('Staff does not exists', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }
}
