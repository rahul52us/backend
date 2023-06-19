import { Injectable, Logger, HttpException } from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  TeacherBodySchema,
  UpdateTeacherBodySchema,
  getSingleTeacherSchema,
  getTeacherSchema,
  getUserTeacherSchema,
} from './teacher.validation';
import {
  TeacherReturnSuccessdto,
  getSingleTeacherBodyDto,
} from './dto/teacher.dto';
import { generateExcel } from 'src/modules/common/generateExcel.users';
import { convertToMessageResponse } from 'src/modules/common/function';
import { pageSizeLimit } from 'src/modules/common/constant.variabl';

@Injectable()
export class TeacherService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(TeacherService.name);

  async RegisterNewTeacher(teacher: any): Promise<TeacherReturnSuccessdto> {
    try {
      const result = TeacherBodySchema.validate(teacher);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const findUser = await this.prismaService.user.findFirst({
          where: { username: teacher.username },
        });
        if (!findUser) {
          var hashPassword = await bcrypt.hash(teacher.password, 10);
          const newTeacher = await this.prismaService.user.create({
            data: {
              firstName: teacher.firstName,
              lastName: teacher.lastName,
              adminUserId: teacher.adminUserId,
              createdBy:teacher.createdBy,
              username: teacher.username,
              pic:teacher.pic,
              phoneNumber: teacher.phoneNumber,
              password: hashPassword,
              adminType: 'teacher',
            },
          });
          if (newTeacher) {
            var profileData = await this.prismaService.profile.create({
              data: {
                userId: newTeacher.id,
                fatherName: teacher.fatherName,
                motherName: teacher.motherName,
                gender:teacher.gender,
                sibling: teacher.sibling,
                emergencyNumber: teacher.emergencyNumber,
                nickName: teacher.nickName,
                dob: teacher.dob,
                description: teacher.description,
              },
            });
            var addressData = await this.prismaService.address.create({
              data: {
                userId: newTeacher.id,
                country: teacher.country,
                city: teacher.city,
                state: teacher.state,
                address1: teacher.address1,
                address2: teacher.address2,
                zipCode: teacher.zipCode,
              },
            });
            var permissionData = await this.prismaService.permission.create({
              data: {
                userId: newTeacher.id,
                changeStatus: teacher.permission.changeStatus,
                student: teacher.permission.student,
                teacher: teacher.permission.teacher,
                permission: teacher.permission.permission,
                dashboard:teacher.permission.dashboard
              },
            });
            var detailsData = await this.prismaService.profileDetails.create({
              data: {
                userId: newTeacher.id,
                facebook: teacher.facebook,
                instagram: teacher.instagram,
                linkedIn: teacher.linkedIn,
                twitter: teacher.twitter,
                youtube: teacher.youtube,
                gmail: teacher.gmail,
                refrenceVideo: teacher.refrenceVideo,
                profession: teacher.profession,
                picture: teacher.picture,
                backgroundPicture: teacher.backgroundPicture,
                skill: teacher.skill,
                details: teacher.details,
                expirience:teacher.expirience
              },
            });
            newTeacher['profile'] = profileData;
            newTeacher['address'] = addressData;
            newTeacher['permissions'] = permissionData;
            newTeacher['details'] = detailsData
            const { password, ...rest } = newTeacher;
            return {
              statusCode: 201,
              success: true,
              data: rest,
              message: 'New Teacher has been created successFully',
            };
          } else {
            throw new HttpException(
              'Something went wrong , cannot create teacher',
              500,
            );
          }
        } else {
          throw new HttpException(
            `${teacher.username} username is already exists`,
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

  async UpdateTeacher(
    teacher: any,
  ): Promise<TeacherReturnSuccessdto> {
    try {
      const result = UpdateTeacherBodySchema.validate(teacher);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const updatedData = await this.prismaService.user.update({
          where: { id: teacher.id },
          data: {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            pic:teacher.pic,
            adminUserId: teacher.adminUserId,
            createdBy:teacher.createdBy,
            phoneNumber: teacher.phoneNumber,
            profile: {
              update: {
                fatherName: teacher.fatherName,
                motherName: teacher.motherName,
                gender: teacher.gender,
                sibling: teacher.sibling,
                emergencyNumber: teacher.emergencyNumber,
                nickName: teacher.nickName,
                dob: teacher.dob,
                description: teacher.description,
              },
            },
            address: {
              update: {
                country: teacher.country,
                city: teacher.city,
                state: teacher.state,
                address1: teacher.address1,
                address2: teacher.address2,
                zipCode: teacher.zipCode,
              },
            },
            permission:{
              update : {
                changeStatus: teacher.permission.changeStatus,
                student: teacher.permission.student,
                teacher: teacher.permission.teacher,
                permission: teacher.permission.permission,
                dashboard:teacher.permission.dashboard
              }
            },
            ProfileDetails: {
              update: {
                facebook: teacher.facebook,
                instagram: teacher.instagram,
                linkedIn: teacher.linkedIn,
                twitter: teacher.twitter,
                youtube: teacher.youtube,
                gmail: teacher.gmail,
                refrenceVideo: teacher.refrenceVideo,
                profession: teacher.profession,
                picture: teacher.picture,
                backgroundPicture: teacher.backgroundPicture,
                skill: teacher.skill,
                details: teacher.details,
                expirience:teacher.expirience
              },
            },
          },
          include: { profile: true, address: true, permission: true , ProfileDetails : true},
        });
        if (updatedData) {
          const { password, ...rest } = updatedData;
          return {
            message: 'SuccessFully Updated teacher record',
            success: true,
            data: rest,
            statusCode: 200,
          };
        } else {
          throw new HttpException('teacher record Does not exists', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async getTeachers(teacher: any): Promise<TeacherReturnSuccessdto> {
    try {
      const result = getTeacherSchema.validate(teacher);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const pageSize = teacher.limit || pageSizeLimit;
        const skip = (teacher.page - 1) * pageSize;

        const result = await this.prismaService.$transaction([
           this.prismaService.user.findMany({
            where: {
              adminType: 'teacher',
              status: teacher.status === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED',
              adminUserId: teacher.adminUserId,
              OR: teacher.search ? [{ username : { contains: teacher.search } }] : undefined,
            },
            take: teacher.limit ? Math.min(teacher.limit, pageSize) : pageSize,
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
              adminType: 'teacher',
              status: teacher.status === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED',
              adminUserId: teacher.adminUserId
            }
          })
        ]);

        const teachers = result[0];
        const totalData = result[1];
        const totalPages = Math.ceil(totalData / pageSize);
        const remainingPages = Math.max(totalPages - teacher.page, 0);
        const hasNextPage = remainingPages > 0;

        return {
          data: {
            list : teachers,
            totalPages,
            totalData,
            remainingPages,
            currentPage: teacher.page,
            hasNextPage,
            hasPreviousPage: teacher.page > 1,
          },
          success: true,
          message: 'Get Teachers successfully',
          statusCode: 200,
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async getSingleTeacher(
    teacherBodyData: getSingleTeacherBodyDto,
  ): Promise<TeacherReturnSuccessdto> {
    try {
      const result = getSingleTeacherSchema.validate(teacherBodyData);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const teacher = await this.prismaService.user.findUnique({
          where: { id: teacherBodyData.id },
          include: {
            profile: true,
            permission: true,
            address: true,
            ProfileDetails: true,
          },
        });
        if (teacher) {
          var { password, ...rest } = teacher;
          return {
            success: true,
            message: 'Teacher Get SuccessFully',
            data: rest,
            statusCode: 200,
          };
        } else {
          throw new HttpException('teacher does not exists', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async getUserTeachers(teacher: any): Promise<TeacherReturnSuccessdto> {
    try {
      const result = getUserTeacherSchema.validate(teacher);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const teachers = await this.prismaService.user.findMany({
          where: {
            adminType: 'teacher',
            status: 'ACCEPTED',
            adminUserId: teacher.userId,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            pic: true,
            adminUserId: true,
            ProfileDetails:true
          },
          orderBy: { createdAt: 'desc' },
        });
        return {
          success: true,
          data: teachers,
          message: 'teacher recieved successfully',
          statusCode: 200,
        };
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async getSingleUserTeacher(
    teacherBodyData: getSingleTeacherBodyDto,
  ): Promise<TeacherReturnSuccessdto> {
    try {
      const result = getSingleTeacherSchema.validate(teacherBodyData);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const teacher = await this.prismaService.user.findUnique({
          where: { id: teacherBodyData.id },
          include: {
            profile: true,
            ProfileDetails: true,
          },
        });
        if (teacher) {
          var { password, ...rest } = teacher;
          return {
            success: true,
            message: 'Teacher Get SuccessFully',
            data: rest,
            statusCode: 200,
          };
        } else {
          throw new HttpException('teacher does not exists', 400);
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async downloadTeacherList(recieveData: any, res: any): Promise<any> {
    try {
      const teachers = await this.prismaService.user.findMany({
        where: {
          adminType: 'teacher',
          adminUserId: recieveData.bodyData['adminUserId'],
          status: recieveData.status
        },
        include: { profile: true, address: true, ProfileDetails: true },
      });

      const columns = [
        { key: 'firstName', name: 'First Name', type: 'text' },
        { key: 'lastName', name: 'Last Name', type: 'text' },
        { key: 'username', name: 'Username', type: 'text' },
        { key: 'pic', name: 'Profile Picture', type: 'text' },
        { key: 'phoneNumber', name: 'Phone Number', type: 'text' },
        { key: 'status', name: 'Status', type: 'text' },
        { key: 'profile.sibling', name: 'Sibling', type: 'text' },
        { key: 'profile.fatherName', name: 'Father Name', type: 'text' },
        { key: 'profile.motherName', name: 'Mother Name', type: 'text' },
        { key: 'profile.nickName', name: 'Nick Name', type: 'text' },
        {
          key: 'profile.emergencyNumber',
          name: 'Emergency Number',
          type: 'text',
        },
        { key: 'address.address1', name: 'Address 1', type: 'text' },
        { key: 'address.address2', name: 'Address 2', type: 'text' },
        { key: 'address.country', name: 'Country', type: 'text' },
        { key: 'address.state', name: 'State', type: 'text' },
        { key: 'address.city', name: 'City', type: 'text' },
        { key: 'address.zipCode', name: 'Zip Code', type: 'text' },
        { key: 'ProfileDetails.facebook', name: 'Facebook Link', type: 'link' },
        {
          key: 'ProfileDetails.instagram',
          name: 'Instagram Link',
          type: 'link',
        },
        { key: 'ProfileDetails.twitter', name: 'Twitter Link', type: 'link' },
        { key: 'ProfileDetails.linkedIn', name: 'LinkedIn Link', type: 'link' },
        { key: 'ProfileDetails.gmail', name: 'Gmail', type: 'text' },
        { key: 'createdAt', name: 'Joining Date' },
      ];

      await generateExcel(
        columns,
        teachers,
        res,
        'Teacher List',
        'Teacher Data',
        'teacher',
      );
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }


}
