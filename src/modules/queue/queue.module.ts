import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'queueName', // Replace 'queueName' with your desired queue name
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
