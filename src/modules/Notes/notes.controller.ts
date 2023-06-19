import {
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import {
  NotesCategoryCreateRoute,
  NotesCategoryGetRoute,
  NotesCreateRoute,
  NotesGetRoute,
  NotesRoute,
} from './common/notes.routes';
import { AdminGuard } from 'src/guards/admin.guards';
import { RequestBodyDto } from '../user/dto/users.dto';
import {
  CreateNotesCaegoryDto,
  CreateNotesDto,
  SuccessNotesReturnDto,
} from './common/notes.dto';
import { FileStorageService } from '../FileStorage/fileStorage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {MulterFile} from 'multer'

@Controller(NotesRoute)
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  @UseGuards(AdminGuard)
  @Post(NotesCategoryCreateRoute)
  async createNotesCategory(
    @Req() req: RequestBodyDto,
    @Body() notes: CreateNotesCaegoryDto,
  ): Promise<SuccessNotesReturnDto> {
    if (req.bodyData['adminUserId'] === req.userId) {
      notes['adminUserId'] = req.bodyData['adminUserId'];
      notes['createdBy'] = req.userId;
      const { success, message, data, statusCode } =
        await this.notesService.createNotesCategory(notes);
      return {
        success,
        message,
        data,
        statusCode,
      };
    } else {
      throw new HttpException('cannot create notes category', 403);
    }
  }

  @Post(NotesCategoryGetRoute)
  async getNotesCategories(@Req() req: RequestBodyDto, @Body() NotesData: any) {
      const { data, success, message, statusCode } =
        await this.notesService.getCategoryNotes(NotesData);
      return {
        data,
        success,
        message,
        statusCode,
      };
    }

  @UseGuards(AdminGuard)
  @Post(NotesCreateRoute)
  @UseInterceptors(FileInterceptor('file'))
  async createNotes(@UploadedFile() file: MulterFile, @Req() req: RequestBodyDto, @Body() notesData : CreateNotesDto){
    if(req.bodyData['adminUserId'] === req.userId)
    {
      notesData['file'] = file
      notesData['adminUserId'] = req.bodyData['adminUserId']
      notesData['createdBy'] = req.userId
      const {success , data , statusCode , message} = await this.notesService.createNotes(notesData)
      return {
        success,
        data,
        statusCode,
        message
      }
    }
  }
}
