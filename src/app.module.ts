import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GlobalModule } from './global/global.module';
import { StudentModule } from './modules/AllTypesUsers/student/student.module';
import { TeacherModule } from './modules/AllTypesUsers/teacher/teacher.module';
import { UsersModule } from './modules/user/users.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { AppGateway } from './app/app.gateway';
import { WebModule } from './modules/web/web.module';
import {StaffModule} from './modules/AllTypesUsers/staff/staff.module'
import { TestimonialModule } from './modules/testimonial/testimonial.module';
import { NotesModule } from './modules/Notes/notes.module'
import { QueueModule } from './modules/queue/queue.module';

// videos
import { VideoModules } from './modules/videos/videos.modules';
// blogger
import { BlogTagModule } from './modules/blogger/blog-tag/blog-tag.module';
import { BlogModule } from './modules/blogger/blog/blog.module';
import { CommentModule } from './modules/blogger/comment/comment.module';
import { ReactionModule } from './modules/blogger/reaction/reaction.module';
import { NotificationModule } from './modules/notification/notification.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    GlobalModule,
    UsersModule,
    StudentModule,
    TeacherModule,
    StaffModule,
    GalleryModule,
    TestimonialModule,
    VideoModules,
    NotesModule,
    WebModule,
    QueueModule,
    BlogModule,
    CommentModule,
    ReactionModule,
    BlogTagModule,
    NotificationModule
  ],
  providers: [AppGateway],
})
export class AppModule {}
