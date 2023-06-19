import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { WebService } from './web.service';
import { WebSuccessReturnDto, WebBody } from './common/web.dto';
import { AdminGuard } from 'src/guards/admin.guards';
import { RequestBodyDto } from '../user/dto/users.dto';
import { CreateWebRoute, WebRoute, getWeb } from './common/web.routes';

@Controller(WebRoute)
export class WebController {
  constructor(private readonly webService: WebService) {}

  @UseGuards(AdminGuard)
  @Post(CreateWebRoute)
  async createWebController(
    @Req() request: RequestBodyDto,
    @Body() webData: WebBody,
  ): Promise<WebSuccessReturnDto> {
    webData['userId'] = request.bodyData['adminUserId'];
    const { success, message, data, statusCode } =
      await this.webService.createWebService(webData);
    return {
      success,
      message,
      data,
      statusCode,
    };
  }

  @Get(getWeb)
  async getWebController(
    @Param('webName') webName : string
  ): Promise<WebSuccessReturnDto> {
    const { success, message, data, statusCode } =
      await this.webService.getWeb(webName);
    return {
      success,
      message,
      data,
      statusCode,
    };
  }

}
