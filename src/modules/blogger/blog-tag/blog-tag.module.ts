import { Module } from '@nestjs/common';
import { BlogTagService } from './blog-tag.service';
import { BlogTagController } from './blog-tag.controller';

@Module({
  providers: [BlogTagService],
  controllers: [BlogTagController]
})
export class BlogTagModule {}
