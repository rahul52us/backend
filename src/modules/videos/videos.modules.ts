import { Module } from '@nestjs/common';
import { VideosServices } from './videos.services';
import { VideosController } from './videos.controller';

@Module({
  providers: [VideosServices],
  controllers: [VideosController],
})
export class VideoModules {}
