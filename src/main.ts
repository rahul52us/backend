import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { notesDirectory } from './common/constant';
import { QueueService } from './modules/queue/queue.service';


var express = require('express');

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const queueService = app.get(QueueService); // Get instance of QueueService
  await queueService.processTasks(); // Start task processing
  app.use('/images', express.static(path.join(__dirname, '../public/upload_pic')));
  app.use('/testimonials', express.static(path.join(__dirname, '../public/testimonials')));
  app.use(`/${notesDirectory}`, express.static(path.join(__dirname, `../public/${notesDirectory}`)));
  app.use(express.urlencoded({ extended: true }));
  app.enableCors({
    origin : '*'
  });
  await app.listen(5000);
}

bootstrap();
