import {
  Controller,
  UseGuards,
  Post,
  UsePipes,
  Body,
  Get,
  Param,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiConflictResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { JoiValidationPipe } from 'src/shared/joi-validation.pipe';
import {
  createUserValidationSchema,
  User,
  UserStatuses,
} from './model/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Bearer token',
    description: 'Token for authorization',
  })
  @ApiOkResponse({
    description: 'The record list has been successfully returned.',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized.' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Bearer token',
    description: 'Token for authorization',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized.' })
  async find(@Param('id') id: string): Promise<User> {
    return this.usersService.find(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Bearer token',
    description: 'Token for authorization',
  })
  @UsePipes(new JoiValidationPipe(createUserValidationSchema))
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  @ApiConflictResponse({ description: 'Duplicated data.' })
  @ApiForbiddenResponse({ description: 'Unauthorized.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const passHash = await hash(password, 10);

    const user = await this.usersService.findOne(email);

    if (user) throw new ConflictException('Duplicated data');

    return this.usersService.create({
      ...createUserDto,
      password: passHash,
      status: UserStatuses.active,
    });
  }
}
