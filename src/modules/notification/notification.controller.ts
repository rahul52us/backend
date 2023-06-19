import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService  : NotificationService) {}

    @Post('create')
    async NotificationSave(@Body() tokenData : any){
        await this.notificationService.saveNotificationToken({token : tokenData.token})
    }
}