import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

interface UploadedFileType {
  buffer: Buffer;
  originalname: string;
  size: number;
  mimetype: string;
}

@ApiTags('Upload')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private cloudinaryService: CloudinaryService) {}

    @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiOperation({ summary: 'Uploader un fichier sur Cloudinary' })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })],
      }),
    )
    file: UploadedFileType,
  ) {
    if (!file.buffer) {
      throw new BadRequestException("Le fichier n'a pas de buffer");
    }

    const result = await this.cloudinaryService.uploadImage(file, 'raw');
    return {
      url: (result as { secure_url: string }).secure_url,
      publicId: (result as { public_id: string }).public_id,
      originalname: file.originalname,
      taille: file.size,
      mimetype: file.mimetype,
    };
  }

  @Post('image')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @ApiOperation({ summary: 'Uploader une image sur Cloudinary' })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif|webp)' }),
        ],
      }),
    )
    file: UploadedFileType,
  ) {
    if (!file.buffer) {
      throw new BadRequestException("L'image n'a pas de buffer");
    }

    const result = await this.cloudinaryService.uploadImage(file);
    return {
      url: (result as { secure_url: string }).secure_url,
      publicId: (result as { public_id: string }).public_id,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
