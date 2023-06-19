import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('queueName') private queue: Queue) {}

  async processTasks() {
    this.queue.process(async (job) => {
        console.log(job)
      // Job processing logic here

      // Simulate job completion
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Job completed, no need to call `done`
    });
  }
}
