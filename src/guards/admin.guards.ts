import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import * as jwt from "jsonwebtoken";

interface JwtPayload {
  userId: {
    userId: string;
    iat: number;
  };
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      var { authorization } = request.headers;
      if (authorization?.split?.length && authorization) {
        authorization = authorization.split(" ");
        if (authorization[0] === "Bearer") {
          var { userId } = jwt.verify(
            authorization[1],
            process.env.SECRET_KEY
          ) as JwtPayload;
          const data = await this.prismaService.user.findUniqueOrThrow({
            where: { id: userId.userId },
            include: { permission: true },
          });
          if (data) {
            request.bodyData = data;
            request.userId = data.id;
            return data;
          } else {
            throw new HttpException("UnAuthorized User", 401);
          }
        } else {
          throw new HttpException("UnAuthorized User", 401);
        }
      } else {
        throw new HttpException("UnAuthorized User", 401);
      }
    } catch (err) {
      throw new HttpException(err.message, err.status ? err.status : 500);
    }
  }
}
