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
@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The record list has been successfully returned.',
    type: Page,
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
    return this.pagesService.find(id);
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
    const user = await this.pagesService.find(id);

    if (!user) throw new NotFoundException('Data not found');

    return this.pagesService.update(id, updatePageDto);
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
