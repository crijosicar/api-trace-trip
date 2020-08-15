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
import { ApiTags } from '@nestjs/swagger';
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

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async find(@Param('id') id: string): Promise<User> {
    return this.usersService.find(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new JoiValidationPipe(createUserValidationSchema))
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
