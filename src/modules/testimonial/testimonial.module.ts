import { Module } from "@nestjs/common";
import { TestimonialService } from "./testimonial.service";
import { TestimonialController } from "./testimonial.controller";

@Module({
    providers : [TestimonialService],
    controllers : [TestimonialController]
})

export class TestimonialModule {}