import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Page } from 'src/pages/model/page.schema';
import { maxSize, storage } from 'src/shared/cloudinary.config';

@ApiTags('files')
@Controller('files')
export class FilesController {

    @Post('upload')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOkResponse({
      description: 'The record has been successfully created.',
      type: Page,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @UseInterceptors(AnyFilesInterceptor({ limits: { fileSize: maxSize }, storage: storage({ folder: 'assets', resource_type: 'auto'}) }))
    @ApiConsumes('multipart/form-data')
    async upload(@UploadedFiles() files: Record<string, any>): Promise<any> {
      return files;
    }

}
