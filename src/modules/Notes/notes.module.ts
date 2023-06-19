import { Module } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { NotesController } from "./notes.controller";
import { FileStorageService } from "../FileStorage/fileStorage.service";

@Module({
    providers : [NotesService,FileStorageService],
    controllers : [NotesController],
})

export class NotesModule {}