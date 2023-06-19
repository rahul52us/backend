import { Test, TestingModule } from '@nestjs/testing';
import { BlogTagController } from './blog-tag.controller';

describe('BlogTagController', () => {
  let controller: BlogTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogTagController],
    }).compile();

    controller = module.get<BlogTagController>(BlogTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
