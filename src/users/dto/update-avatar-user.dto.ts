import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateAvatarUserDto extends PickType(CreateUserDto, [
  'avatar',
] as const) {}
