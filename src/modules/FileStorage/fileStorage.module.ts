import { Module } from "@nestjs/common";
import { FileStorageService } from "./fileStorage.service";

@Module({
    providers : [FileStorageService],
})

export class FileStorageModule {}