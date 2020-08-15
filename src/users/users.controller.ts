import {
  Controller,
  UseGuards,
  Post,
  UsePipes,
  Body,
  Get,
  Param,
  ConflictException,
  Put,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { JoiValidationPipe } from 'src/shared/joi-validation.pipe';
import {
  createUserValidationSchema,
  updateUserValidationSchema,
  User,
  UserStatuses,
} from './model/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The record list has been successfully returned.',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async find(@Param('id') id: string): Promise<User> {
    return this.usersService.find(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.find(id);

    if (!user) throw new NotFoundException('Data not found');

    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePasswordUserDto })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async updatePassword(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateUserValidationSchema))
    updatePasswordUserDto: UpdatePasswordUserDto,
  ): Promise<User> {
    const user = await this.usersService.find(id);

    if (!user) throw new NotFoundException('Data not found');

    const { password } = updatePasswordUserDto;
    const passHash = await hash(password, 10);

    return this.usersService.update(id, { password: passHash });
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  @ApiConflictResponse({ description: 'Duplicated data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async create(
    @Body(new JoiValidationPipe(createUserValidationSchema))
    createUserDto: CreateUserDto,
  ): Promise<User> {
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
