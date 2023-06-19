import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { WebSuccessReturnDto, WebValidation } from './common/web.dto';

@Injectable()
export class WebService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(WebService.name);

  async createWebService(web: any): Promise<WebSuccessReturnDto> {
    try {
      const result = WebValidation.validate(web);
      if (result.error) {
        throw new HttpException(result.error.details, 422);
      } else {
        const webName = await this.prismaService.web.findFirst({
          where: { OR: [{ webName: web.webName }, { userId: web.userId }] },
        });
        if (webName) {
          throw new HttpException(
            `you have already created a web site as an ${webName?.webName}`,
            400,
          );
        } else {
          const webs = await this.prismaService.web.create({
            data: {
              userId: web.userId,
              facebook: web.facebook,
              linkedIn: web.linkedIn,
              instagram: web.instagram,
              youtube: web.youtube,
              twitter: web.twitter,
              email: web.email,
              logo: web.logo,
              phoneNumber1: web.phoneNumber1,
              phoneNumber2: web.phoneNumber2,
              address: web.address,
              webLink1: web.webLink1,
              webName: web.webName,
              startTime: web.startTime,
              endTime: web.endTime,
            },
          });
          if (webs) {
            return {
              success: true,
              message: 'Web created Successfully',
              data: webs,
              statusCode: 200,
            };
          } else {
            throw new HttpException(
              'something went wrong while creating the new Web',
              400,
            );
          }
        }
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }

  async getWeb(webName: any): Promise<WebSuccessReturnDto> {
    try {
      const web = await this.prismaService.web.findFirst({
        where: { webName: webName },
      });
      if (web) {
        return {
          success: true,
          message: 'get web details successfully',
          data: web,
          statusCode: 200,
        };
      } else {
        throw new HttpException(`${webName} does not exists`, 400);
      }
    } catch (err) {
      throw new HttpException(err, err.status ? err.status : 500, {
        cause: new Error(err),
      });
    }
  }
}
