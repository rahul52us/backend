import { Injectable, Logger, HttpException } from '@nestjs/common';
import {
  getSingleStudentBodyDto,
  getStudentBodyDto,
  getStudentReturnDto,
  RegisterStudentReturnDto,
  SingleStudentReturnDto,
  StudentInfo,
  UpdateStudentInfo,
  UpdateStudentReturnDto,
} from './dto/student.dto';
import {
  getSingleStudentSchema,
  getStudentSchema,
  StudentBodySchema,
  UpdateStudentBodySchema,
} from './studentValidation';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../services/prisma.service';
import { Readable } from 'stream';
import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import axios from 'axios';
import * as Jimp from 'jimp';
import { generateExcel } from 'src/modules/common/generateExcel.users';
import { convertToMessageResponse } from 'src/modules/common/function';
import { pageSizeLimit } from 'src/modules/common/constant.variabl';
import { CustomMessage } from '../utils/messages';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(StudentService.name);

  async RegisterNewStudent(
    student: StudentInfo,
  ): Promise<RegisterStudentReturnDto> {
    try {
      const result = StudentBodySchema.validate(student);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const findUser = await this.prismaService.user.findFirst({
          where: { username: student.username },
        });
        if (!findUser) {
          var hashPassword = await bcrypt.hash(student.password, 10);
          const newstudent = await this.prismaService.user.create({
            data: {
              firstName: student.firstName,
              lastName: student.lastName,
              adminUserId: student.adminUserId,
              createdBy: student.createdBy,
              pic: student.pic,
              username: student.username,
              phoneNumber: student.phoneNumber,
              password: hashPassword,
            },
          });
          if (newstudent) {
            var profileData = await this.prismaService.profile.create({
              data: {
                userId: newstudent.id,
                fatherName: student.fatherName,
                motherName: student.motherName,
                sibling: student.sibling,
                emergencyNumber: student.emergencyNumber,
                nickName: student.nickName,
                standard: student.standard,
                dob: student.dob,
                description: student.description,
                gender: student.gender,
                medium: student.medium,
              },
            });
            var standardDetails = await this.prismaService.standardDetails.create({
              data : {
                 profileId:profileData.id,
                 class: student.standard,
                 startYear: new Date(student.startYear),
                 endYear: new Date(student.endYear),
              }
            })
            var addressData = await this.prismaService.address.create({
              data: {
                userId: newstudent.id,
                country: student.country,
                city: student.city,
                state: student.state,
                address1: student.address1,
                address2: student.address2,
                zipCode: student.zipCode,
              },
            });
            var permissionData = await this.prismaService.permission.create({
              data: {
                userId: newstudent.id,
                changeStatus: student.permission.changeStatus,
                student: student.permission.student,
                staff: student.permission.staff,
                teacher: student.permission.teacher,
                permission: student.permission.permission,
                dashboard: student.permission.dashboard,
              },
            });
            var detailsData = await this.prismaService.profileDetails.create({
              data: {
                userId: newstudent.id,
                facebook: student.facebook,
                instagram: student.instagram,
                linkedIn: student.linkedIn,
                twitter: student.twitter,
                youtube: student.youtube,
                gmail: student.gmail,
                refrenceVideo: student.refrenceVideo,
                profession: student.profession,
                picture: student.picture,
                backgroundPicture: student.backgroundPicture,
                skill: student.skill,
                details: student.details,
              },
            });
            newstudent['profile'] = profileData;
            newstudent['address'] = addressData;
            newstudent['permissions'] = permissionData;
            newstudent['details'] = detailsData;
            newstudent['standardDetails'] = standardDetails
            const { password, ...rest } = newstudent;
            return {
              statusCode: 201,
              success: true,
              data: rest,
              message: CustomMessage('student', '').CREATE,
            };
          } else {
            throw new HttpException(
              CustomMessage('student', '').CANNOT_CREATE,
              500,
            );
          }
        } else {
          throw new HttpException(
            CustomMessage('student', student.username).ALREADY_EXISTS,
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

  async UpdateStudent(
    student: UpdateStudentInfo,
  ): Promise<UpdateStudentReturnDto> {
    try {
      const result = UpdateStudentBodySchema.validate(student);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const updatedData = await this.prismaService.user.update({
          where: { id: student.id },
          data: {
            firstName: student.firstName,
            lastName: student.lastName,
            adminUserId: student.adminUserId,
            phoneNumber: student.phoneNumber,
            pic: student.pic,
            profile: {
              update: {
                fatherName: student.fatherName,
                motherName: student.motherName,
                sibling: student.sibling,
                emergencyNumber: student.emergencyNumber,
                nickName: student.nickName,
                gender: student.gender,
                standard: student.standard,
                dob: student.dob,
                description: student.description,
                medium: student.medium,
              },
            },
            address: {
              update: {
                country: student.country,
                city: student.city,
                state: student.state,
                address1: student.address1,
                address2: student.address2,
                zipCode: student.zipCode,
              },
            },
            permission: {
              update: {
                changeStatus: student.permission?.changeStatus,
                student: student.permission?.student,
                teacher: student.permission?.teacher,
                permission: student.permission?.permission,
                staff: student.permission?.staff,
                dashboard: student.permission?.dashboard,
              },
            },
            ProfileDetails: {
              update: {
                facebook: student.facebook,
                instagram: student.instagram,
                linkedIn: student.linkedIn,
                twitter: student.twitter,
                youtube: student.youtube,
                gmail: student.gmail,
                refrenceVideo: student.refrenceVideo,
                profession: student.profession,
                picture: student.picture,
                backgroundPicture: student.backgroundPicture,
                skill: student.skill,
                details: student.details,
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
            message: CustomMessage('student', '').UPDATE,
            success: true,
            data: rest,
            statusCode: 200,
          };
        } else {
          throw new HttpException(
            CustomMessage('Student', 'Student').DOES_NOT_EXISTS,
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

  async getStudents(student: getStudentBodyDto): Promise<getStudentReturnDto> {
    try {
      const result = getStudentSchema.validate(student);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const pageSize = student.limit || pageSizeLimit;
        const skip = (student.page - 1) * pageSize;

        const result = await this.prismaService.$transaction([
          this.prismaService.user.findMany({
            where: {
              adminType: 'student',
              status: student.status === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED',
              adminUserId: student.adminUserId,
              OR: student.search
                ? [{ username: { contains: student.search } }]
                : undefined,
                profile: {
                  StandardInfo: {
                    some: {
                      class: student.standard,
                      startYear: student.startYear ? new Date(student.startYear)  : undefined,
                      endYear: student.endYear ? new Date(student.endYear) : undefined,
                    },
                  },
                },
            },
            take: student.limit ? Math.min(student.limit, pageSize) : pageSize,
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
              profile: {
                select: {
                  id: true,
                  sibling: true,
                  standard: true,
                  gender: true,
                  fatherName: true,
                  motherName: true,
                  nickName: true,
                  medium: true,
                  dob: true,
                  emergencyNumber: true,
                  description: true,
                  StandardInfo: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          }),
          this.prismaService.user.count({
            where: {
              adminType: 'student',
              status: student.status === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED',
              adminUserId: student.adminUserId,
              profile: {
                standard: student.standard || undefined,
              },
            },
          }),
        ]);

        const students = result[0];
        const totalData = result[1];
        const totalPages = Math.ceil(totalData / pageSize);
        const remainingPages = Math.max(totalPages - student.page, 0);
        const hasNextPage = remainingPages > 0;

        return {
          data: {
            list: students,
            totalPages,
            totalData,
            remainingPages,
            currentPage: student.page,
            hasNextPage,
            hasPreviousPage: student.page > 1,
          },
          success: true,
          message: CustomMessage('student', '').GET,
          statusCode: 200,
        };
      }
    } catch (err) {
      console.log(err.message)
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  async getSingleStudent(
    studentBodyData: getSingleStudentBodyDto,
  ): Promise<SingleStudentReturnDto> {
    try {
      const result = getSingleStudentSchema.validate(studentBodyData);
      if (result.error) {
        throw new HttpException(await convertToMessageResponse(result), 422);
      } else {
        const student = await this.prismaService.user.findUnique({
          where: { id: studentBodyData.id },
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
            message: CustomMessage('student', '').SINGLE_GET,
            data: rest,
            statusCode: 200,
          };
        } else {
          throw new HttpException(
            CustomMessage('student', 'Student').DOES_NOT_EXISTS,
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

  async downloadStudentSheet(recieveData: any, res: any): Promise<any> {
    try {
      const students = await this.prismaService.user.findMany({
        where: {
          adminType: 'student',
          adminUserId: recieveData.bodyData['adminUserId'],
          status: recieveData.status,
          profile: {
            standard: recieveData.standard,
          },
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
        { key: 'profile.standard', name: 'Standard', type: 'text' },
        { key: 'profile.gender', name: 'Gender', type: 'text' },
        { key: 'profile.medium', name: 'Medium', type: 'text' },
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
        students,
        res,
        'Student List',
        'Student Data',
        'student',
      );
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }

  // create the student pdf templates
  async downloadTemplate(recieveData: any, res: any): Promise<any> {
    try {
      const pdfStream = await designPDF();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=generated.pdf',
      );
      pdfStream.pipe(res);
    } catch (err) {
      throw new HttpException(err, err.status || 500, {
        cause: new Error(err),
      });
    }
  }
}

async function designPDF(): Promise<Readable> {
  // Load an existing PDF document
  const pdfDoc = await PDFDocument.create();
  // Add a new page to the document
  const page: PDFPage = pdfDoc.addPage();

  // Set the font and font size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.setFont(font);
  page.setFontSize(12);

  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const titleFontSize = 18;
  const titleSubFontSize = 12;

  const titleText = 'Knowledge For Curious';
  const titleWidth = titleFont.widthOfTextAtSize(titleText, titleFontSize);

  const { width, height } = page.getSize();
  const centerX = width / 2;

  const titleColor = rgb(0, 0, 1); // Divide RGB values by 255
  const titleSubColor = rgb(0, 0, 0); // Divide RGB values by 255

  page.drawText(titleText, {
    x: centerX - titleWidth / 2,
    y: page.getHeight() - 30, // Adjust the Y coordinate as needed
    font: titleFont,
    size: titleFontSize,
    color: titleColor,
  });

  const titleSubText = 'Knowledge For Curious Knowledge For Curious';
  const titleSubWidth = titleFont.widthOfTextAtSize(
    titleSubText,
    titleSubFontSize,
  );

  page.drawText(titleSubText, {
    x: centerX - titleSubWidth / 2,
    y: page.getHeight() - 50, // Adjust the Y coordinate as needed
    font: titleFont,
    size: titleSubFontSize,
    color: titleSubColor,
  });

  const imageUrl =
    'https://knowledgeforcurious.com/wp-content/uploads/2022/09/277676154_342117717942284_2141374188090488483_n-1.jpg';
  const logoResponse = await axios.get(imageUrl, {
    responseType: 'arraybuffer',
  });
  const logoBuffer = Buffer.from(logoResponse.data);

  // Load the logo image using jimp
  const logoImage = await Jimp.read(logoBuffer);

  // Resize the logo image if necessary
  logoImage.resize(100, 50); // Adjust the dimensions as needed

  // Convert the logo image to a buffer
  const logoImageBuffer = await logoImage.getBufferAsync(Jimp.MIME_PNG);

  // Embed the logo image into the PDF document
  const logoImageEmbed = await pdfDoc.embedPng(logoImageBuffer);
  // Add the logo image to the page

  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  const borderWidth = 2; // Specify the border width
  const borderColor = rgb(0, 0, 1); // Specify the border color using the rgb() function

  // Draw a rectangle as the border around the page
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    borderWidth,
    borderColor,
  });

  page.drawImage(logoImageEmbed, {
    x: 20, // Specify the X position of the logo
    y: 760, // Specify the Y position of the logo
    width: 80, // Specify the width of the logo
    height: 60, // Specify the height of the logo
  });

  // Add other content to the page (invoice details)
  // ...

  // Save the modified PDF document as a readable stream
  const pdfBytes = await pdfDoc.save();
  const pdfStream = new Readable();
  pdfStream.push(pdfBytes);
  pdfStream.push(null);

  return pdfStream;
}
