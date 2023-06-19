import { Module } from "@nestjs/common";
import { WebController } from "./web.controller";
import { WebService } from "./web.service";

@Module({
    providers: [WebService],
    controllers: [WebController],
  })
  export class WebModule {}