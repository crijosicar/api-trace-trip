import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/swagger';

export class LogInUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
