import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Put,
  Body,
  NotFoundException,
  ConflictException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Page,
  createPageValidationSchema,
  updatePageValidationSchema,
} from './model/page.schema';
import { JoiValidationPipe } from 'src/shared/joi-validation.pipe';
import { UpdatePageDto } from './dto/update-page.dto';
import { CreatePageDto } from './dto/create-page.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { maxSize, imageFileFilter, storage } from 'src/shared/cloudinary.config';
import { get, find, unionBy } from 'lodash';
import { v4 } from 'uuid'

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The record list has been successfully returned.',
    type: [Page],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async findAll(): Promise<Page[]> {
    return this.pagesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: Page,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async find(@Param('id') id: string): Promise<Page> {
    const page = this.pagesService.find(id);

    if(!page) throw new NotFoundException('Data not found');

    return page;

  }

  @Get('name/:name')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'name', type: String })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: Page,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async findByName(@Param('name') name: string): Promise<Page> {
    const page = this.pagesService.findOne(name);

    if(!page) throw new NotFoundException('Data not found');

    return page;
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePageDto })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: Page,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updatePageValidationSchema))
    updatePageDto: UpdatePageDto,
  ): Promise<Page> {
    const page = await this.pagesService.find(id);

    if (!page) throw new NotFoundException('Data not found');

    return this.pagesService.update(id, updatePageDto);
  }

  @Put('name/:name')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'name', type: String })
  @ApiBody({ type: UpdatePageDto })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: Page,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseInterceptors(AnyFilesInterceptor({ limits: { fileSize: maxSize }, fileFilter: imageFileFilter,  storage: storage('pages/home/slider') }))
  @ApiConsumes('multipart/form-data')
  async updateByName(
    @Param('name') name: string,
    @Body(new JoiValidationPipe(updatePageValidationSchema))
    updatePageDto: UpdatePageDto,
    @UploadedFiles() files: Record<string, any>,
  ): Promise<Page> {
    const page = await this.pagesService.findOne(name);
    
    if (!page) throw new NotFoundException('Data not found');

    const slider = get(updatePageDto, 'additionalFields.slider');

    if(slider){
      const currentSlider =  get(page, 'additionalFields.slider', []);
      
      !slider['id'] && (slider['id'] = v4());
      slider['image'] = files[0] ? files[0].path : get(find(currentSlider, { id: slider.id }), 'image');
      updatePageDto.additionalFields.slider = unionBy([slider], currentSlider, 'id')
    }

    return this.pagesService.update(page.id, updatePageDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: CreatePageDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Page,
  })
  @ApiConflictResponse({ description: 'Duplicated data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async create(
    @Body(new JoiValidationPipe(createPageValidationSchema))
    createPageDto: CreatePageDto,
  ): Promise<Page> {
    const { name } = createPageDto;

    const page = await this.pagesService.findOne(name);

    if (page) throw new ConflictException('Duplicated data');

    return this.pagesService.create(createPageDto);
  }
}
